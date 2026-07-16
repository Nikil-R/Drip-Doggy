package com.dripdoggy.backend.serviceImpl;

import com.dripdoggy.backend.Iservice.IAdminOrderService;
import com.dripdoggy.backend.ResponseDto.AdminOrderResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.entity.*;
import com.dripdoggy.backend.enums.*;
import com.dripdoggy.backend.exception.*;
import com.dripdoggy.backend.repository.OrdersRepository;
import com.dripdoggy.backend.repository.OrderReturnRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminOrderService implements IAdminOrderService {

    private final OrdersRepository ordersRepository;
    private final EmailService emailService;
    private final OrderReturnRepository orderReturnRepository;
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Autowired
    public AdminOrderService(OrdersRepository ordersRepository, EmailService emailService, OrderReturnRepository orderReturnRepository) {
        this.ordersRepository = ordersRepository;
        this.emailService = emailService;
        this.orderReturnRepository = orderReturnRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdminOrderResponseDto> getAllOrders() {
        List<Orders> orders = ordersRepository.findAll();
        return orders.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AdminOrderResponseDto getOrderDetails(Long id) {
        Orders order = ordersRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        return mapToDto(order);
    }

    @Override
    public ResponseMsgDto updateOrderStatus(Long id, DeliveryStatus targetStatus) {
        if (targetStatus == null) {
            throw new InvalidOrderStateException("Delivery status cannot be null.");
        }
        Orders order = ordersRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        DeliveryStatus currentStatus = order.getDeliveryStatus();

        // 1. Terminal Cancelled Check
        if (currentStatus == DeliveryStatus.CANCELLED) {
            throw new InvalidOrderStateException("Cannot change status of a cancelled order.");
        }

        // 2. Terminal Delivered Check
        if (currentStatus == DeliveryStatus.DELIVERED && targetStatus != DeliveryStatus.RETURN_INITIATED && targetStatus != DeliveryStatus.EXCHANGE_INITIATED) {
            throw new InvalidOrderStateException("Cannot change status of a delivered order except to initiate return or exchange.");
        }

        // 3. Terminal Return/Exchange Delivered Check
        if (currentStatus == DeliveryStatus.RETURN_DELIVERED || currentStatus == DeliveryStatus.EXCHANGE_DELIVERED) {
            throw new InvalidOrderStateException("Cannot change status of a returned/exchanged order.");
        }

        // 4. Sequential Transition Validations
        if (targetStatus == DeliveryStatus.PROCESSING) {
            if (currentStatus != DeliveryStatus.PLACED) {
                throw new InvalidOrderStateException("Can only transition to PROCESSING from PLACED.");
            }
            order.setProcessingTimestamp(LocalDateTime.now());
        } else if (targetStatus == DeliveryStatus.PACKED) {
            if (currentStatus != DeliveryStatus.PROCESSING) {
                throw new InvalidOrderStateException("Can only transition to PACKED from PROCESSING.");
            }
        } else if (targetStatus == DeliveryStatus.SHIPPED) {
            if (currentStatus != DeliveryStatus.PACKED) {
                throw new InvalidOrderStateException("Can only transition to SHIPPED from PACKED.");
            }
            // Courier Tracking ID verification
            if (order.getTrackingNumber() == null || order.getTrackingNumber().trim().isEmpty()) {
                throw new InvalidOrderStateException("Courier Tracking ID is required to mark the order as SHIPPED.");
            }
            order.setShippedTimestamp(LocalDateTime.now());
        } else if (targetStatus == DeliveryStatus.OUT_FOR_DELIVERY) {
            if (currentStatus != DeliveryStatus.SHIPPED) {
                throw new InvalidOrderStateException("Can only transition to OUT_FOR_DELIVERY from SHIPPED.");
            }
        } else if (targetStatus == DeliveryStatus.DELIVERED) {
            if (currentStatus != DeliveryStatus.OUT_FOR_DELIVERY) {
                throw new InvalidOrderStateException("Can only transition to DELIVERED from OUT_FOR_DELIVERY.");
            }
            order.setDeliveredTimestamp(LocalDateTime.now());
            // Mark payment as SUCCESS (Paid) upon delivery
            order.setPaymentStatus(PaymentStatus.SUCCESS);

            // Send delivery confirmation email
            try {
                User user = order.getUser();
                Address address = order.getAddress();
                if (user != null) {
                    String orderNumber = "#DD-" + order.getId();
                    String customerName = "";
                    if (address != null && address.getFirstName() != null && !address.getFirstName().trim().isEmpty()) {
                        customerName = ((address.getFirstName() != null ? address.getFirstName() : "") + " " +
                                       (address.getLastName() != null ? address.getLastName() : "")).trim();
                    } else {
                        customerName = ((user.getFirstName() != null ? user.getFirstName() : "") + " " +
                                       (user.getLastName() != null ? user.getLastName() : "")).trim();
                    }
                    if (order.getDeliveryMethod() != null && "EXCHANGE".equalsIgnoreCase(order.getDeliveryMethod())) {
                        emailService.sendCustomerExchangeDeliveredEmail(
                                user.getEmail(),
                                orderNumber,
                                customerName
                        );
                    } else {
                        emailService.sendCustomerOrderDeliveredEmail(
                                user.getEmail(),
                                orderNumber,
                                customerName,
                                order
                        );
                    }
                }
            } catch (Exception e) {
                // Ignore email failure to prevent rolling back successful DB transaction
                System.err.println("Could not send delivery email: " + e.getMessage());
            }
        } else if (targetStatus == DeliveryStatus.CANCELLED) {
            if (currentStatus == DeliveryStatus.SHIPPED || currentStatus == DeliveryStatus.OUT_FOR_DELIVERY ||
                currentStatus == DeliveryStatus.DELIVERED || currentStatus == DeliveryStatus.CANCELLED ||
                currentStatus == DeliveryStatus.RETURN_INITIATED || currentStatus == DeliveryStatus.RETURN_PICKUPED ||
                currentStatus == DeliveryStatus.RETURN_SHIPPED || currentStatus == DeliveryStatus.RETURN_OUT_OF_DELIVERY ||
                currentStatus == DeliveryStatus.RETURN_DELIVERED ||
                currentStatus == DeliveryStatus.EXCHANGE_INITIATED || currentStatus == DeliveryStatus.EXCHANGE_PICKUPED ||
                currentStatus == DeliveryStatus.EXCHANGE_SHIPPED || currentStatus == DeliveryStatus.EXCHANGE_OUT_OF_DELIVERY ||
                currentStatus == DeliveryStatus.EXCHANGE_DELIVERED) {
                throw new InvalidOrderStateException("Cannot cancel order at this stage.");
            }
            // Cannot cancel if courier tracking ID exists
            if (order.getTrackingNumber() != null && !order.getTrackingNumber().trim().isEmpty()) {
                throw new InvalidOrderStateException("Cannot cancel order after courier tracking ID has been generated.");
            }
            order.setCancelledTimestamp(LocalDateTime.now());
        } else if (targetStatus == DeliveryStatus.RETURN_INITIATED) {
            if (currentStatus != DeliveryStatus.DELIVERED) {
                throw new InvalidOrderStateException("Can only transition to RETURN_INITIATED from DELIVERED.");
            }
        } else if (targetStatus == DeliveryStatus.EXCHANGE_INITIATED) {
            if (currentStatus != DeliveryStatus.DELIVERED) {
                throw new InvalidOrderStateException("Can only transition to EXCHANGE_INITIATED from DELIVERED.");
            }
        } else if (targetStatus == DeliveryStatus.RETURN_PICKUPED) {
            if (currentStatus != DeliveryStatus.RETURN_INITIATED) {
                throw new InvalidOrderStateException("Can only transition to RETURN_PICKUPED from RETURN_INITIATED.");
            }
        } else if (targetStatus == DeliveryStatus.EXCHANGE_PICKUPED) {
            if (currentStatus != DeliveryStatus.EXCHANGE_INITIATED) {
                throw new InvalidOrderStateException("Can only transition to EXCHANGE_PICKUPED from EXCHANGE_INITIATED.");
            }
        } else if (targetStatus == DeliveryStatus.RETURN_SHIPPED) {
            if (currentStatus != DeliveryStatus.RETURN_PICKUPED) {
                throw new InvalidOrderStateException("Can only transition to RETURN_SHIPPED from RETURN_PICKUPED.");
            }
        } else if (targetStatus == DeliveryStatus.EXCHANGE_SHIPPED) {
            if (currentStatus != DeliveryStatus.EXCHANGE_PICKUPED) {
                throw new InvalidOrderStateException("Can only transition to EXCHANGE_SHIPPED from EXCHANGE_PICKUPED.");
            }
        } else if (targetStatus == DeliveryStatus.RETURN_OUT_OF_DELIVERY) {
            if (currentStatus != DeliveryStatus.RETURN_SHIPPED) {
                throw new InvalidOrderStateException("Can only transition to RETURN_OUT_OF_DELIVERY from RETURN_SHIPPED.");
            }
        } else if (targetStatus == DeliveryStatus.EXCHANGE_OUT_OF_DELIVERY) {
            if (currentStatus != DeliveryStatus.EXCHANGE_SHIPPED) {
                throw new InvalidOrderStateException("Can only transition to EXCHANGE_OUT_OF_DELIVERY from EXCHANGE_SHIPPED.");
            }
        } else if (targetStatus == DeliveryStatus.RETURN_DELIVERED) {
            if (currentStatus != DeliveryStatus.RETURN_OUT_OF_DELIVERY) {
                throw new InvalidOrderStateException("Can only transition to RETURN_DELIVERED from RETURN_OUT_OF_DELIVERY.");
            }
        } else if (targetStatus == DeliveryStatus.EXCHANGE_DELIVERED) {
            if (currentStatus != DeliveryStatus.EXCHANGE_OUT_OF_DELIVERY) {
                throw new InvalidOrderStateException("Can only transition to EXCHANGE_DELIVERED from EXCHANGE_OUT_OF_DELIVERY.");
            }
        } else {
            throw new InvalidOrderStateException("Unsupported status transition: " + targetStatus);
        }

        order.setDeliveryStatus(targetStatus);
        ordersRepository.save(order);

        // Send email to customer for return logistics updates
        if (targetStatus == DeliveryStatus.RETURN_PICKUPED ||
            targetStatus == DeliveryStatus.RETURN_SHIPPED ||
            targetStatus == DeliveryStatus.RETURN_OUT_OF_DELIVERY ||
            targetStatus == DeliveryStatus.RETURN_DELIVERED) {
            try {
                User user = order.getUser();
                Address address = order.getAddress();
                String orderNumber = "#DD-" + order.getId();
                String customerName = "";
                if (address != null && address.getFirstName() != null && !address.getFirstName().trim().isEmpty()) {
                    customerName = ((address.getFirstName() != null ? address.getFirstName() : "") + " " +
                                   (address.getLastName() != null ? address.getLastName() : "")).trim();
                } else if (user != null) {
                    customerName = ((user.getFirstName() != null ? user.getFirstName() : "") + " " +
                                   (user.getLastName() != null ? user.getLastName() : "")).trim();
                }
                emailService.sendCustomerReturnLogisticsEmail(
                        user.getEmail(),
                        orderNumber,
                        customerName,
                        targetStatus.name()
                );
            } catch (Exception e) {
                // Ignore email failure to prevent rolling back successful DB transaction
            }
        }

        return new ResponseMsgDto(200, "Order status updated to " + targetStatus.name() + " successfully.");
    }

    @Override
    public ResponseMsgDto updateOrderTracking(Long id, String trackingNumber) {
        Orders order = ordersRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        // Validation: Cannot add/edit tracking if order is cancelled or delivered
        if (order.getDeliveryStatus() == DeliveryStatus.CANCELLED) {
            throw new InvalidOrderStateException("Cannot set tracking number for a cancelled order.");
        }
        if (order.getDeliveryStatus() == DeliveryStatus.DELIVERED) {
            throw new InvalidOrderStateException("Cannot set tracking number for a delivered order.");
        }

        // Validation: Courier Tracking ID must be unique (only check non-empty values)
        String trimmedTracking = (trackingNumber != null) ? trackingNumber.trim() : "";
        if (!trimmedTracking.isEmpty()) {
            if (ordersRepository.existsByTrackingNumberAndIdNot(trimmedTracking, id)) {
                throw new InvalidOrderStateException("Courier Tracking ID '" + trimmedTracking + "' is already assigned to another order.");
            }
            order.setTrackingNumber(trimmedTracking);
        } else {
            order.setTrackingNumber(null);
        }

        ordersRepository.save(order);

        return new ResponseMsgDto(200, "Courier Tracking ID updated successfully.");
    }

    private AdminOrderResponseDto mapToDto(Orders order) {
        String orderNumber = "#DD-" + order.getId();
        String orderTimestamp = order.getOrderTimestamp() != null ? order.getOrderTimestamp().format(DATE_TIME_FORMATTER) : null;
        String pendingAt = orderTimestamp;
        String processingAt = order.getProcessingTimestamp() != null ? order.getProcessingTimestamp().format(DATE_TIME_FORMATTER) : null;
        String shippedAt = order.getShippedTimestamp() != null ? order.getShippedTimestamp().format(DATE_TIME_FORMATTER) : null;
        String deliveredAt = order.getDeliveredTimestamp() != null ? order.getDeliveredTimestamp().format(DATE_TIME_FORMATTER) : null;
        String cancelledAt = order.getCancelledTimestamp() != null ? order.getCancelledTimestamp().format(DATE_TIME_FORMATTER) : null;

        User user = order.getUser();
        Address address = order.getAddress();
        String customerName = "";
        String customerEmail = "";
        if (address != null && address.getFirstName() != null && !address.getFirstName().trim().isEmpty()) {
            customerName = ((address.getFirstName() != null ? address.getFirstName() : "") + " " +
                           (address.getLastName() != null ? address.getLastName() : "")).trim();
        } else if (user != null) {
            customerName = ((user.getFirstName() != null ? user.getFirstName() : "") + " " +
                           (user.getLastName() != null ? user.getLastName() : "")).trim();
        }
        if (user != null) {
            customerEmail = user.getEmail();
        }
        String destinationAddress = "";
        if (address != null) {
            destinationAddress = (address.getBuildingNo() != null ? address.getBuildingNo() + ", " : "") +
                                 (address.getBuildingName() != null ? address.getBuildingName() + ", " : "") +
                                 (address.getStreetName() != null ? address.getStreetName() + ", " : "") +
                                 (address.getArea() != null ? address.getArea() + ", " : "") +
                                 (address.getCity() != null ? address.getCity() + ", " : "") +
                                 (address.getState() != null ? address.getState() + " - " : "") +
                                 (address.getPincode() != null ? address.getPincode() : "");
        }

        List<AdminOrderResponseDto.OrderItemDetail> items = new ArrayList<>();
        if (order.getOrderItems() != null) {
            for (OrderItem oi : order.getOrderItems()) {
                ProductVariantSize pvs = oi.getProductVariantSize();
                String name = "";
                String sku = "";
                String size = "";
                String image = "";
                if (pvs != null) {
                    size = pvs.getSizeName();
                    ProductVariant pv = pvs.getProductVariant();
                    if (pv != null) {
                        sku = pv.getVariantName();
                        if (pv.getImages() != null && !pv.getImages().isEmpty()) {
                            image = pv.getImages().get(0).getImageUrl();
                        }
                        Product p = pv.getProduct();
                        if (p != null) {
                            name = p.getProductName();
                        }
                    }
                }
                String returnRequestType = null;
                String returnRequestStatus = null;
                List<OrderReturn> returns = orderReturnRepository.findByOrderItemId(oi.getId());
                if (returns != null && !returns.isEmpty()) {
                    OrderReturn activeReturn = returns.stream()
                            .filter(r -> r.getStatus() != ReturnStatus.REJECTED)
                            .findFirst()
                            .orElse(returns.get(returns.size() - 1));
                    returnRequestType = activeReturn.getRequestType() != null ? activeReturn.getRequestType().name() : null;
                    returnRequestStatus = activeReturn.getStatus() != null ? activeReturn.getStatus().name() : null;
                }

                items.add(new AdminOrderResponseDto.OrderItemDetail(
                        oi.getId(),
                        name,
                        sku,
                        size,
                        oi.getQuantity(),
                        oi.getPrice() != null ? oi.getPrice().doubleValue() : 0.0,
                        image,
                        returnRequestType,
                        returnRequestStatus
                ));
            }
        }

        String paymentStatusStr = order.getPaymentStatus() == PaymentStatus.SUCCESS ? "PAID" :
                                  (order.getPaymentStatus() != null ? order.getPaymentStatus().name() : "UNPAID");

        return new AdminOrderResponseDto(
                orderNumber,
                orderTimestamp,
                order.getTotalAmount(),
                order.getDiscount(),
                order.getTax(),
                order.getPlatformFee(),
                order.getShippingFee(),
                order.getDeliveryMethod(),
                order.getDeliveryStatus() != null ? order.getDeliveryStatus().name() : "PLACED",
                paymentStatusStr,
                order.getPhoneNumber(),
                customerEmail,
                customerName,
                destinationAddress,
                order.getTrackingNumber(),
                pendingAt,
                processingAt,
                shippedAt,
                deliveredAt,
                cancelledAt,
                items
        );
    }
}
