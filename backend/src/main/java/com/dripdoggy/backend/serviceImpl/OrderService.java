package com.dripdoggy.backend.serviceImpl;

import com.dripdoggy.backend.Iservice.IOrderService;
import com.dripdoggy.backend.Iservice.ICouponService;
import com.dripdoggy.backend.RequestDto.OrderRequestDto;
import com.dripdoggy.backend.RequestDto.OrderPreviewRequestDto;
import com.dripdoggy.backend.RequestDto.CheckoutOtpRequest;
import com.dripdoggy.backend.RequestDto.CheckoutOtpVerifyRequest;
import com.dripdoggy.backend.ResponseDto.OrderResponseDto;
import com.dripdoggy.backend.ResponseDto.OrderPreviewResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.ResponseDto.CouponValidationResponseDto;
import com.dripdoggy.backend.entity.*;
import com.dripdoggy.backend.enums.*;
import com.dripdoggy.backend.exception.*;
import com.dripdoggy.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class OrderService implements IOrderService {

    @Value("${order.tax.percentage}")
    private double taxPercentage;

    private final OrdersRepository ordersRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final OtpRepository otpRepository;
    private final OtpService otpService;
    private final ICouponService couponService;
    private final EmailService emailService;

    @Autowired
    public OrderService(OrdersRepository ordersRepository, 
                        OrderItemRepository orderItemRepository, 
                        CartRepository cartRepository, 
                        AddressRepository addressRepository, 
                        UserRepository userRepository, 
                        OtpRepository otpRepository, 
                        OtpService otpService, 
                        ICouponService couponService, 
                        EmailService emailService) {
        this.ordersRepository = ordersRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.otpService = otpService;
        this.couponService = couponService;
        this.emailService = emailService;
    }

    private User getCurrentCustomer() {
        org.springframework.security.core.Authentication authentication = 
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new InvalidCredentialsException("Access Denied: User must be authenticated.");
        }
        String principalName = authentication.getName();
        User user = null;
        if (principalName.contains("@")) {
            user = userRepository.findByEmail(principalName)
                    .orElseThrow(() -> new EmailNotFoundException("Email address is not registered: " + principalName));
        } else {
            String alternative = principalName.startsWith("+") ? principalName.substring(1) : "+" + principalName;
            user = userRepository.findByPhoneNo(principalName)
                    .or(() -> userRepository.findByPhoneNo(alternative))
                    .orElseThrow(() -> new PhoneNotFoundException("Phone number is not registered: " + principalName));
        }
        if (user.getRole() != UserRole.CUSTOMER) {
            throw new IllegalArgumentException("Access Denied: Only customers can access checkout and place orders.");
        }
        if (user.getFirstName() == null || user.getFirstName().trim().isEmpty()) {
            throw new UserNotRegisteredException("Register through the OTP first.");
        }
        return user;
    }

    @Override
    public ResponseMsgDto sendCheckoutOtp(CheckoutOtpRequest request) {
        // Enforce only registered customers can request checkout OTP
        getCurrentCustomer();
        
        otpService.generateAndSendOtp(request.getPhoneNo(), OtpType.PHONE);
        return new ResponseMsgDto(200, "Verification OTP code sent to " + request.getPhoneNo());
    }

    @Override
    public ResponseMsgDto verifyCheckoutOtp(CheckoutOtpVerifyRequest request) {
        User user = getCurrentCustomer();
        
        boolean verified = otpService.verifyOtp(request.getPhoneNo(), OtpType.PHONE, request.getOtpCode());
        if (!verified) {
            throw new InvalidCredentialsException("Invalid or expired OTP.");
        }
        
        // Save verified phone number to customer profile
        user.setPhoneNo(request.getPhoneNo());
        userRepository.save(user);
        
        return new ResponseMsgDto(200, "Phone number verified successfully.");
    }

    @Override
    public OrderResponseDto placeOrder(OrderRequestDto request) {
        User user = getCurrentCustomer();

        // 1. Verify that the customer has verified their phone number via OTP on checkout
        Otp otp = otpRepository.findTopByTargetValueAndOtpTypeOrderByCreatedAtDesc(request.getPhoneNo(), OtpType.PHONE)
                .orElseThrow(() -> new InvalidCredentialsException("Phone number verification is compulsory before checkout."));
        if (!Boolean.TRUE.equals(otp.getIsVerified())) {
            throw new InvalidCredentialsException("Phone number must be verified before placing an order.");
        }

        // 2. Fetch active cart items. Enforce cart is not empty.
        List<Cart> cartItems = cartRepository.findByUserAndIsActiveTrue(user);
        if (cartItems.isEmpty()) {
            throw new CartEmptyException("Cannot place order. Cart is empty.");
        }

        // 3. Fetch and validate shipping address
        Address address = addressRepository.findByIdAndUserAndIsActiveTrue(request.getAddressId(), user)
                .orElseThrow(() -> new AddressNotFoundException("Shipping Address not found."));

        // 4. Calculate Subtotal
        BigDecimal subtotal = BigDecimal.ZERO;
        for (Cart cart : cartItems) {
            ProductVariantSize size = cart.getProductVariantSize();
            if (size == null || !Boolean.TRUE.equals(size.getIsActive())) {
                throw new IllegalArgumentException("One of the items in your cart is no longer available.");
            }
            BigDecimal price = size.getProductVariant().getPrice();
            subtotal = subtotal.add(price.multiply(BigDecimal.valueOf(cart.getQuantity())));
        }

        // 5. Apply Coupon Discount (if any)
        BigDecimal discountVal = BigDecimal.ZERO;
        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            CouponValidationResponseDto couponResponse = couponService.validateAndCalculateDiscount(
                    request.getCouponCode(), subtotal
            );
            discountVal = couponResponse.getCalculatedDiscount();
        }

        // 6. Calculate Tax (18% calculated after discount)
        BigDecimal discountedSubtotal = subtotal.subtract(discountVal);
        if (discountedSubtotal.compareTo(BigDecimal.ZERO) < 0) {
            discountedSubtotal = BigDecimal.ZERO;
        }
        BigDecimal taxAmount = discountedSubtotal
                .multiply(BigDecimal.valueOf(taxPercentage))
                .divide(BigDecimal.valueOf(100.0), 2, RoundingMode.HALF_UP);

        // 7. Calculate Delivery Fee
        BigDecimal shippingFee = new BigDecimal("90.00"); // Standard Delivery Fee
        if ("EXPRESS".equalsIgnoreCase(request.getDeliveryMethod().trim())) {
            shippingFee = new BigDecimal("150.00"); // Express Shipping Fee
        }

        // 8. Calculate Final Total Amount (Discounted Subtotal + Tax + Shipping)
        BigDecimal totalAmount = discountedSubtotal.add(taxAmount).add(shippingFee);

        // 9. Create Order Record
        Orders order = new Orders();
        order.setUser(user);
        order.setAddress(address);
        order.setPhoneNumber(request.getPhoneNo());
        order.setTotalAmount(totalAmount);
        order.setDiscount(discountVal);
        order.setTax(taxAmount);
        order.setPlatformFee(BigDecimal.ZERO);
        order.setOrderTimestamp(LocalDateTime.now());
        order.setPaymentStatus(PaymentStatus.PENDING);
        order.setDeliveryStatus(DeliveryStatus.PLACED);
        order.setDeliveryMethod(request.getDeliveryMethod().toUpperCase().trim());
        order.setShippingFee(shippingFee);

        Orders savedOrder = ordersRepository.save(order);

        // 9. Convert Cart Items to OrderItems, and Soft Delete Cart Items
        for (Cart cart : cartItems) {
            ProductVariantSize size = cart.getProductVariantSize();

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProductVariantSize(size);
            orderItem.setQuantity(cart.getQuantity());
            orderItem.setPrice(size.getProductVariant().getPrice());
            orderItem.setSubTotal(size.getProductVariant().getPrice().multiply(BigDecimal.valueOf(cart.getQuantity())));
            
            orderItemRepository.save(orderItem);

            // Soft delete cart item
            cart.setIsActive(false);
            cartRepository.save(cart);
        }

        // 10. Increment usage count of Coupon
        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            couponService.incrementUsageCount(request.getCouponCode());
        }

        // 11. Send Confirmation Email to Customer
        String customerName = (user.getFirstName() != null ? user.getFirstName() : "") + " " +
                             (user.getLastName() != null ? user.getLastName() : "");
        emailService.sendOrderPlacementEmail(
                user.getEmail(),
                "#DD-" + savedOrder.getId(),
                customerName.trim(),
                totalAmount.doubleValue()
        );

        // 12. Map and Return Response
        String destination = address.getBuildingNo() + ", " + address.getBuildingName() + ", " +
                              address.getStreetName() + ", " + address.getArea() + ", " +
                              address.getCity() + ", " + address.getState() + " - " + address.getPincode();

        return new OrderResponseDto(
                "#DD-" + savedOrder.getId(),
                savedOrder.getOrderTimestamp(),
                savedOrder.getTotalAmount(),
                savedOrder.getDiscount(),
                savedOrder.getTax(),
                savedOrder.getPlatformFee(),
                savedOrder.getShippingFee(),
                savedOrder.getDeliveryMethod(),
                savedOrder.getDeliveryStatus().name(),
                savedOrder.getPaymentStatus().name(),
                savedOrder.getPhoneNumber(),
                user.getEmail(),
                customerName.trim(),
                destination
        );
    }

    @Override
    @Transactional(readOnly = true)
    public OrderPreviewResponseDto previewOrder(OrderPreviewRequestDto request) {
        User user = getCurrentCustomer();

        // 1. Fetch active cart items. Enforce cart is not empty.
        List<Cart> cartItems = cartRepository.findByUserAndIsActiveTrue(user);
        if (cartItems.isEmpty()) {
            throw new CartEmptyException("Cannot preview checkout. Cart is empty.");
        }

        // 2. Calculate Subtotal
        BigDecimal subtotal = BigDecimal.ZERO;
        for (Cart cart : cartItems) {
            ProductVariantSize size = cart.getProductVariantSize();
            if (size == null || !Boolean.TRUE.equals(size.getIsActive())) {
                throw new IllegalArgumentException("One of the items in your cart is no longer available.");
            }
            BigDecimal price = size.getProductVariant().getPrice();
            subtotal = subtotal.add(price.multiply(BigDecimal.valueOf(cart.getQuantity())));
        }

        // 3. Apply Coupon Discount (if any)
        BigDecimal discountVal = BigDecimal.ZERO;
        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            CouponValidationResponseDto couponResponse = couponService.validateAndCalculateDiscount(
                    request.getCouponCode(), subtotal
            );
            discountVal = couponResponse.getCalculatedDiscount();
        }

        // 4. Calculate Tax (18% calculated after discount)
        BigDecimal discountedSubtotal = subtotal.subtract(discountVal);
        if (discountedSubtotal.compareTo(BigDecimal.ZERO) < 0) {
            discountedSubtotal = BigDecimal.ZERO;
        }
        BigDecimal taxAmount = discountedSubtotal
                .multiply(BigDecimal.valueOf(taxPercentage))
                .divide(BigDecimal.valueOf(100.0), 2, RoundingMode.HALF_UP);

        // 5. Calculate Delivery Fee
        BigDecimal shippingFee = new BigDecimal("90.00"); // Standard Delivery Fee
        if ("EXPRESS".equalsIgnoreCase(request.getDeliveryMethod().trim())) {
            shippingFee = new BigDecimal("150.00"); // Express Shipping Fee
        }

        // 6. Calculate Final Total Amount
        BigDecimal grandTotal = discountedSubtotal.add(taxAmount).add(shippingFee);

        return new OrderPreviewResponseDto(subtotal, discountVal, taxAmount, shippingFee, grandTotal);
    }
}
