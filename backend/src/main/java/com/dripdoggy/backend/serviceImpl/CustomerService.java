package com.dripdoggy.backend.serviceImpl;

import com.dripdoggy.backend.Iservice.ICustomerService;
import com.dripdoggy.backend.ResponseDto.*;
import com.dripdoggy.backend.entity.*;
import com.dripdoggy.backend.enums.UserRole;
import com.dripdoggy.backend.enums.PaymentStatus;
import com.dripdoggy.backend.repository.UserRepository;
import com.dripdoggy.backend.exception.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CustomerService implements ICustomerService {

    private final UserRepository userRepository;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Autowired
    public CustomerService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public CustomerListResponseDto getAllCustomers() {
        List<User> customers = userRepository.findByRole(UserRole.CUSTOMER);
        List<CustomerListItemDto> data = new ArrayList<>();

        for (User user : customers) {
            String name = (user.getFirstName() != null ? user.getFirstName() : "") + " " +
                         (user.getLastName() != null ? user.getLastName() : "");
            name = name.trim();

            String registeredDate = user.getCreatedAt() != null ?
                    user.getCreatedAt().format(DATE_FORMATTER) : "2025-01-01";

            int orderCount = user.getOrders() != null ? user.getOrders().size() : 0;

            int cartCount = user.getCartItems() != null ?
                    (int) user.getCartItems().stream().filter(c -> Boolean.TRUE.equals(c.getIsActive())).count() : 0;

            int wishlistCount = user.getWishlistItems() != null ?
                    (int) user.getWishlistItems().stream().filter(w -> Boolean.TRUE.equals(w.getIsActive())).count() : 0;

            String status = "Active";
            if (Boolean.TRUE.equals(user.getIsBlocked())) {
                status = "Blocked";
            } else if (user.getCreatedAt() != null && user.getCreatedAt().isAfter(LocalDateTime.now().minusWeeks(1))) {
                status = "New";
            } else if (orderCount == 0) {
                status = "Inactive";
            }

            data.add(new CustomerListItemDto(
                    user.getId(),
                    name,
                    user.getEmail(),
                    user.getPhoneNo(),
                    registeredDate,
                    orderCount,
                    cartCount,
                    wishlistCount,
                    status
            ));
        }

        return new CustomerListResponseDto(200, "Customers fetched successfully", data);
    }

    @Override
    public CustomerDetailResponseDto getCustomerDetails(Long customerId) {
        User user = userRepository.findById(customerId)
                .orElseThrow(() -> new UserNotFoundException("Customer not found"));

        if (user.getRole() != UserRole.CUSTOMER) {
            throw new IllegalArgumentException("User is not a customer.");
        }

        // 1. Onboarding Profile
        String formattedId = "#DD-C" + String.format("%03d", user.getId());
        CustomerDetailResponseDto.OnboardingProfile profile = new CustomerDetailResponseDto.OnboardingProfile(
                formattedId,
                user.getFirstName(),
                user.getLastName(),
                user.getGender() != null ? user.getGender().name() : "Unspecified",
                user.getDob() != null ? user.getDob().toString() : "",
                user.getEmail(),
                user.getPhoneNo()
        );

        // 2. Shipping Addresses
        List<AddressResponseDto> shippingAddresses = new ArrayList<>();
        if (user.getAddresses() != null) {
            for (Address addr : user.getAddresses()) {
                if (Boolean.TRUE.equals(addr.getIsActive())) {
                    shippingAddresses.add(new AddressResponseDto(
                            addr.getId(),
                            addr.getAddressType(),
                            addr.getFirstName(),
                            addr.getLastName(),
                            addr.getBuildingNo(),
                            addr.getBuildingName(),
                            addr.getStreetName(),
                            addr.getArea(),
                            addr.getCity(),
                            addr.getState(),
                            addr.getPincode(),
                            addr.getPhoneNo(),
                            addr.getIsDefault()
                    ));
                }
            }
        }

        // 3. Recent Orders
        List<CustomerDetailResponseDto.RecentOrder> recentOrders = new ArrayList<>();
        LocalDateTime lastOrderTime = null;
        if (user.getOrders() != null) {
            // Sort orders descending by timestamp
            List<Orders> sortedOrders = user.getOrders().stream()
                    .sorted(Comparator.comparing(Orders::getOrderTimestamp).reversed())
                    .collect(Collectors.toList());

            if (!sortedOrders.isEmpty()) {
                lastOrderTime = sortedOrders.get(0).getOrderTimestamp();
            }

            for (Orders ord : sortedOrders) {
                String pendingAt = ord.getOrderTimestamp() != null ? ord.getOrderTimestamp().format(DATE_TIME_FORMATTER) : null;
                String processingAt = ord.getProcessingTimestamp() != null ? ord.getProcessingTimestamp().format(DATE_TIME_FORMATTER) : null;
                String shippedAt = ord.getShippedTimestamp() != null ? ord.getShippedTimestamp().format(DATE_TIME_FORMATTER) : null;
                String deliveredAt = ord.getDeliveredTimestamp() != null ? ord.getDeliveredTimestamp().format(DATE_TIME_FORMATTER) : null;
                String cancelledAt = ord.getCancelledTimestamp() != null ? ord.getCancelledTimestamp().format(DATE_TIME_FORMATTER) : null;

                recentOrders.add(new CustomerDetailResponseDto.RecentOrder(
                        "#DD-" + ord.getId(),
                        ord.getOrderTimestamp().format(DATE_TIME_FORMATTER),
                        ord.getTotalAmount().doubleValue(),
                        ord.getDeliveryStatus() != null ? ord.getDeliveryStatus().name() : "Pending",
                        ord.getPaymentStatus() == PaymentStatus.SUCCESS ? "PAID" : (ord.getPaymentStatus() != null ? ord.getPaymentStatus().name() : "Unpaid"),
                        ord.getTrackingNumber(),
                        pendingAt,
                        processingAt,
                        shippedAt,
                        deliveredAt,
                        cancelledAt
                ));
            }
        }

        // 4. Purchase Summary
        int totalOrders = user.getOrders() != null ? user.getOrders().size() : 0;
        String lastPurchaseStr = lastOrderTime != null ? lastOrderTime.format(DATE_FORMATTER) : "N/A";
        String dateJoined = user.getCreatedAt() != null ? user.getCreatedAt().format(DATE_FORMATTER) : "2025-01-01";
        CustomerDetailResponseDto.PurchaseSummary summary = new CustomerDetailResponseDto.PurchaseSummary(
                totalOrders,
                lastPurchaseStr,
                dateJoined
        );

        // 5. Shopping Cart Items
        List<CartResponseDto> cartItems = new ArrayList<>();
        if (user.getCartItems() != null) {
            for (Cart cart : user.getCartItems()) {
                if (Boolean.TRUE.equals(cart.getIsActive())) {
                    CartResponseDto dto = new CartResponseDto();
                    dto.setId(cart.getId());
                    dto.setQuantity(cart.getQuantity());
                    dto.setIsActive(cart.getIsActive());
                    if (cart.getProductVariantSize() != null) {
                        ProductVariantSize size = cart.getProductVariantSize();
                        dto.setProductVariantSizeId(size.getId());
                        dto.setSizeName(size.getSizeName());

                        ProductVariant variant = size.getProductVariant();
                        if (variant != null) {
                            dto.setVariantName(variant.getVariantName());
                            dto.setPrice(variant.getPrice());
                            if (variant.getImages() != null && !variant.getImages().isEmpty()) {
                                dto.setPrimaryImageUrl(variant.getImages().get(0).getImageUrl());
                            }
                            if (variant.getProduct() != null) {
                                dto.setProductName(variant.getProduct().getProductName());
                            }
                            if (variant.getPrice() != null && cart.getQuantity() != null) {
                                dto.setSubTotal(variant.getPrice().multiply(java.math.BigDecimal.valueOf(cart.getQuantity())));
                            }
                        }
                    }
                    cartItems.add(dto);
                }
            }
        }

        // 6. Wishlist Styles
        List<String> wishlistStyles = new ArrayList<>();
        if (user.getWishlistItems() != null) {
            wishlistStyles = user.getWishlistItems().stream()
                    .filter(w -> Boolean.TRUE.equals(w.getIsActive()))
                    .map(w -> {
                        if (w.getProductVariantSize() != null &&
                            w.getProductVariantSize().getProductVariant() != null) {
                            return w.getProductVariantSize().getProductVariant().getVariantName();
                        }
                        return null;
                    })
                    .filter(name -> name != null)
                    .distinct()
                    .collect(Collectors.toList());
        }

        CustomerDetailResponseDto.Data responseData = new CustomerDetailResponseDto.Data(
                profile,
                shippingAddresses,
                summary,
                recentOrders,
                cartItems,
                wishlistStyles
        );

        return new CustomerDetailResponseDto(200, "Customer details fetched successfully", responseData);
    }

    @Override
    public CustomerStatsResponseDto getCustomerStats() {
        long total = userRepository.countByRole(UserRole.CUSTOMER);
        long active = userRepository.countByRoleAndIsBlocked(UserRole.CUSTOMER, false);
        long blocked = userRepository.countByRoleAndIsBlocked(UserRole.CUSTOMER, true);
        
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        long newThisWeek = userRepository.countByRoleAndCreatedAtAfter(UserRole.CUSTOMER, oneWeekAgo);

        CustomerStatsResponseDto.Data statsData = new CustomerStatsResponseDto.Data(
                total,
                active,
                newThisWeek,
                blocked
        );

        return new CustomerStatsResponseDto(200, "Customer statistics fetched successfully", statsData);
    }

    @Override
    public ResponseMsgDto toggleCustomerBlockStatus(Long customerId) {
        User user = userRepository.findById(customerId)
                .orElseThrow(() -> new UserNotFoundException("Customer not found"));

        if (user.getRole() != UserRole.CUSTOMER) {
            throw new IllegalArgumentException("User is not a customer.");
        }

        boolean isBlocked = Boolean.TRUE.equals(user.getIsBlocked());
        user.setIsBlocked(!isBlocked);
        userRepository.save(user);

        String message = !isBlocked ? "Customer blocked successfully" : "Customer unblocked successfully";
        return new ResponseMsgDto(200, message);
    }
}
