package com.dripdoggy.backend.serviceImpl;

import com.dripdoggy.backend.Iservice.IPaymentService;
import com.dripdoggy.backend.RequestDto.BankSettlementRequestDto;
import com.dripdoggy.backend.ResponseDto.PaymentItemDto;
import com.dripdoggy.backend.ResponseDto.PaymentLedgerFullResponseDto;
import com.dripdoggy.backend.ResponseDto.PaymentSummaryDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.entity.Address;
import com.dripdoggy.backend.entity.Orders;
import com.dripdoggy.backend.entity.Payment;
import com.dripdoggy.backend.entity.User;
import com.dripdoggy.backend.enums.BankSettlementStatus;
import com.dripdoggy.backend.enums.DeliveryStatus;
import com.dripdoggy.backend.enums.PaymentStatus;
import com.dripdoggy.backend.exception.InvalidBankSettlementException;
import com.dripdoggy.backend.exception.ResourceNotFoundException;
import com.dripdoggy.backend.exception.UnauthorizedAdminAccessException;
import com.dripdoggy.backend.repository.OrdersRepository;
import com.dripdoggy.backend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PaymentServiceImpl implements IPaymentService {

    private final PaymentRepository paymentRepository;
    private final OrdersRepository ordersRepository;

    @Autowired
    public PaymentServiceImpl(PaymentRepository paymentRepository, OrdersRepository ordersRepository) {
        this.paymentRepository = paymentRepository;
        this.ordersRepository = ordersRepository;
    }

    private void verifyAdminRole() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new UnauthorizedAdminAccessException("Access denied. Only administrators can access the Payments Ledger.");
        }
    }

    @Override
    public Payment createPaymentRecordForOrder(Orders order) {
        if (order == null) return null;

        Optional<Payment> existing = paymentRepository.findByOrder(order);
        if (existing.isPresent()) {
            return existing.get();
        }

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setOrderNumber(formatOrderNumber(order.getId()));
        payment.setCustomerName(resolveCustomerName(order));
        payment.setAmount(order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO);
        payment.setPaymentType("COD");

        PaymentStatus initialStatus = order.getPaymentStatus() != null ? order.getPaymentStatus() : PaymentStatus.PENDING;
        if (order.getDeliveryStatus() == DeliveryStatus.CANCELLED) {
            initialStatus = PaymentStatus.FAILED;
        } else if (order.getDeliveryStatus() == DeliveryStatus.DELIVERED) {
            initialStatus = PaymentStatus.SUCCESS;
        } else if (order.getDeliveryStatus() == DeliveryStatus.RETURN_DELIVERED) {
            initialStatus = PaymentStatus.REFUNDED;
        }
        payment.setPaymentStatus(initialStatus);
        payment.setBankSettlementStatus(BankSettlementStatus.PENDING_DEPOSIT);

        return paymentRepository.save(payment);
    }

    @Override
    public void syncPaymentOnOrderStatusChange(Orders order, DeliveryStatus newDeliveryStatus) {
        if (order == null) return;

        Payment payment = paymentRepository.findByOrder(order)
                .orElseGet(() -> createPaymentRecordForOrder(order));

        if (newDeliveryStatus == DeliveryStatus.DELIVERED) {
            payment.setPaymentStatus(PaymentStatus.SUCCESS);
        } else if (newDeliveryStatus == DeliveryStatus.CANCELLED) {
            payment.setPaymentStatus(PaymentStatus.FAILED);
        } else if (newDeliveryStatus == DeliveryStatus.RETURN_DELIVERED) {
            payment.setPaymentStatus(PaymentStatus.REFUNDED);
        }

        paymentRepository.save(payment);
    }

    @Override
    @Transactional
    public PaymentLedgerFullResponseDto getPaymentLedger(String statusFilter, String dateRange, String search) {
        verifyAdminRole();

        // 1. Ensure all orders have payment entries
        syncMissingPayments();

        List<Payment> allPayments = paymentRepository.findAllByOrderByCreatedAtDesc();

        LocalDateTime startOfToday = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime endOfToday = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);

        BigDecimal totalActiveCashFlow = BigDecimal.ZERO;
        BigDecimal todayRevenue = BigDecimal.ZERO;
        long cancelledOrdersCount = 0;
        BigDecimal lostMoney = BigDecimal.ZERO;

        for (Payment p : allPayments) {
            BigDecimal amt = p.getAmount() != null ? p.getAmount() : BigDecimal.ZERO;
            PaymentStatus effectiveStatus = p.getPaymentStatus();
            if (p.getOrder() != null && p.getOrder().getDeliveryStatus() == DeliveryStatus.CANCELLED) {
                effectiveStatus = PaymentStatus.FAILED;
            }

            // Active Cash Flow: Pending bank deposit and not cancelled
            if (p.getBankSettlementStatus() == BankSettlementStatus.PENDING_DEPOSIT &&
                effectiveStatus != PaymentStatus.FAILED &&
                effectiveStatus != PaymentStatus.REFUNDED) {
                totalActiveCashFlow = totalActiveCashFlow.add(amt);
            }

            // Today Revenue: Paid today
            if (p.getCreatedAt() != null &&
                !p.getCreatedAt().isBefore(startOfToday) &&
                !p.getCreatedAt().isAfter(endOfToday) &&
                effectiveStatus == PaymentStatus.SUCCESS) {
                todayRevenue = todayRevenue.add(amt);
            }

            // Cancelled orders & lost money
            if (effectiveStatus == PaymentStatus.FAILED ||
                effectiveStatus == PaymentStatus.REFUNDED ||
                (p.getOrder() != null && p.getOrder().getDeliveryStatus() == DeliveryStatus.CANCELLED)) {
                cancelledOrdersCount++;
                lostMoney = lostMoney.add(amt);
            }
        }

        PaymentSummaryDto summary = new PaymentSummaryDto(totalActiveCashFlow, todayRevenue, cancelledOrdersCount, lostMoney);

        // Filter Payments List
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime filterStart = null;
        if (dateRange != null) {
            String dr = dateRange.trim();
            if ("TODAY".equalsIgnoreCase(dr)) {
                filterStart = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
            } else if ("THIS_WEEK".equalsIgnoreCase(dr)) {
                filterStart = now.minusDays(7);
            } else if ("THIS_MONTH".equalsIgnoreCase(dr)) {
                filterStart = now.minusDays(30);
            }
        }

        final LocalDateTime startDateLimit = filterStart;

        List<PaymentItemDto> paymentItems = allPayments.stream()
                .filter(p -> startDateLimit == null || (p.getCreatedAt() != null && !p.getCreatedAt().isBefore(startDateLimit)))
                .filter(p -> {
                    if (statusFilter == null || statusFilter.trim().isEmpty() || "ALL".equalsIgnoreCase(statusFilter.trim())) return true;
                    String sf = statusFilter.trim().toUpperCase();
                    
                    PaymentStatus ps = p.getPaymentStatus();
                    DeliveryStatus ds = p.getOrder() != null ? p.getOrder().getDeliveryStatus() : null;
                    if (ds == DeliveryStatus.CANCELLED) {
                        ps = PaymentStatus.FAILED;
                    }
                    String statusName = mapPaymentStatusToString(ps).toUpperCase();

                    if ("PAID".equals(sf) || "SUCCESS".equals(sf)) {
                        return ps == PaymentStatus.SUCCESS || "PAID".equals(statusName);
                    }
                    if ("PENDING".equals(sf)) {
                        return (ps == PaymentStatus.PENDING || "PENDING".equals(statusName)) && (ds != DeliveryStatus.CANCELLED);
                    }
                    if ("CANCELLED".equals(sf) || "FAILED".equals(sf)) {
                        return ps == PaymentStatus.FAILED || "CANCELLED".equals(statusName) || ds == DeliveryStatus.CANCELLED;
                    }
                    if (sf.startsWith("REFUND")) {
                        return ps == PaymentStatus.REFUNDED || ps == PaymentStatus.REFUND_PENDING || "REFUNDED".equals(statusName);
                    }
                    return statusName.contains(sf) || (ps != null && ps.name().contains(sf));
                })
                .filter(p -> {
                    if (search == null || search.trim().isEmpty()) return true;
                    String q = search.trim().toLowerCase();
                    String ordNum = p.getOrderNumber() != null ? p.getOrderNumber().toLowerCase() : "";
                    String custName = p.getCustomerName() != null ? p.getCustomerName().toLowerCase() : "";
                    return ordNum.contains(q) || custName.contains(q) || String.valueOf(p.getId()).contains(q);
                })
                .map(this::mapToItemDto)
                .collect(Collectors.toList());

        return new PaymentLedgerFullResponseDto(summary, paymentItems);
    }

    @Override
    public ResponseMsgDto updateBankSettlement(String orderNumberIdentifier, BankSettlementRequestDto request) {
        verifyAdminRole();

        if (request == null || request.getBankSettlementStatus() == null) {
            throw new IllegalArgumentException("Bank settlement status is required.");
        }

        Payment payment = findPaymentByIdentifier(orderNumberIdentifier);

        PaymentStatus ps = payment.getPaymentStatus();
        DeliveryStatus ds = payment.getOrder() != null ? payment.getOrder().getDeliveryStatus() : null;

        // Validation: Cannot set BANK_DEPOSITED for CANCELLED, FAILED, or REFUNDED orders
        if (request.getBankSettlementStatus() == BankSettlementStatus.BANK_DEPOSITED) {
            if (ps == PaymentStatus.FAILED || ps == PaymentStatus.REFUNDED || ds == DeliveryStatus.CANCELLED) {
                String errorStatus = (ds == DeliveryStatus.CANCELLED) ? "CANCELLED" : (ps != null ? ps.name() : "FAILED");
                throw new InvalidBankSettlementException("Cannot set bank settlement status to BANK_DEPOSITED for order " +
                        payment.getOrderNumber() + " because its payment/order status is " + errorStatus + ".");
            }
        }

        payment.setBankSettlementStatus(request.getBankSettlementStatus());
        if (request.getBankSettlementStatus() == BankSettlementStatus.BANK_DEPOSITED) {
            payment.setBankSettledAt(LocalDateTime.now());
        } else {
            payment.setBankSettledAt(null);
        }

        paymentRepository.save(payment);

        return new ResponseMsgDto(200, "Bank settlement status updated successfully for order " + payment.getOrderNumber() + " to " + request.getBankSettlementStatus().name());
    }

    private void syncMissingPayments() {
        List<Orders> orders = ordersRepository.findAll();
        for (Orders order : orders) {
            Optional<Payment> existingOpt = paymentRepository.findByOrder(order);
            if (existingOpt.isEmpty()) {
                createPaymentRecordForOrder(order);
            } else {
                // Auto-cleanup: If an order was cancelled/failed/refunded, ensure bank deposit is reset to PENDING_DEPOSIT
                Payment p = existingOpt.get();
                if (order.getDeliveryStatus() == DeliveryStatus.CANCELLED ||
                    p.getPaymentStatus() == PaymentStatus.FAILED ||
                    p.getPaymentStatus() == PaymentStatus.REFUNDED) {
                    if (p.getBankSettlementStatus() == BankSettlementStatus.BANK_DEPOSITED) {
                        p.setBankSettlementStatus(BankSettlementStatus.PENDING_DEPOSIT);
                        p.setBankSettledAt(null);
                        paymentRepository.save(p);
                    }
                }
            }
        }
    }

    private Payment findPaymentByIdentifier(String identifier) {
        if (identifier == null || identifier.trim().isEmpty()) {
            throw new ResourceNotFoundException("Order number identifier is required.");
        }
        String query = identifier.trim();

        // 1. Try exact match by order_number (e.g. "DD-ORD-1001" or "#DD-0001")
        Optional<Payment> byNum = paymentRepository.findByOrderNumber(query);
        if (byNum.isPresent()) return byNum.get();

        // 2. Try adding prefix if passed numeric e.g. "1" -> "#DD-0001" or "DD-ORD-1"
        if (query.matches("^\\d+$")) {
            Long orderId = Long.parseLong(query);
            Optional<Payment> byOrderId = paymentRepository.findByOrderId(orderId);
            if (byOrderId.isPresent()) return byOrderId.get();
        }

        throw new ResourceNotFoundException("Payment record not found for order number: " + identifier);
    }

    private PaymentItemDto mapToItemDto(Payment p) {
        LocalDateTime date = p.getCreatedAt();
        if (p.getOrder() != null && p.getOrder().getOrderTimestamp() != null) {
            date = p.getOrder().getOrderTimestamp();
        }

        PaymentStatus statusToMap = p.getPaymentStatus();
        if (p.getOrder() != null && p.getOrder().getDeliveryStatus() == DeliveryStatus.CANCELLED) {
            statusToMap = PaymentStatus.FAILED;
        }

        return new PaymentItemDto(
                p.getOrderNumber(),
                p.getCustomerName(),
                "COD",
                p.getAmount(),
                date,
                mapPaymentStatusToString(statusToMap),
                p.getBankSettlementStatus() != null ? p.getBankSettlementStatus().name() : "PENDING_DEPOSIT"
        );
    }

    private String mapPaymentStatusToString(PaymentStatus status) {
        if (status == null) return "PENDING";
        if (status == PaymentStatus.SUCCESS) return "PAID";
        if (status == PaymentStatus.FAILED) return "CANCELLED";
        return status.name();
    }

    private String formatOrderNumber(Long id) {
        if (id == null) return "DD-ORD-0000";
        return String.format("DD-ORD-%04d", id);
    }

    private String resolveCustomerName(Orders order) {
        if (order == null) return "Guest Customer";
        Address addr = order.getAddress();
        if (addr != null && addr.getFirstName() != null && !addr.getFirstName().trim().isEmpty()) {
            return ((addr.getFirstName() != null ? addr.getFirstName() : "") + " " +
                    (addr.getLastName() != null ? addr.getLastName() : "")).trim();
        }
        User user = order.getUser();
        if (user != null) {
            return ((user.getFirstName() != null ? user.getFirstName() : "") + " " +
                    (user.getLastName() != null ? user.getLastName() : "")).trim();
        }
        return "Guest Customer";
    }
}
