package com.dripdoggy.backend.serviceImpl;

import com.dripdoggy.backend.Iservice.IOrderService;
import com.dripdoggy.backend.Iservice.ICouponService;
import com.dripdoggy.backend.Iservice.IShippingFeeService;
import com.dripdoggy.backend.RequestDto.OrderRequestDto;
import com.dripdoggy.backend.RequestDto.OrderPreviewRequestDto;
import com.dripdoggy.backend.RequestDto.CheckoutOtpRequest;
import com.dripdoggy.backend.RequestDto.CheckoutOtpVerifyRequest;
import com.dripdoggy.backend.ResponseDto.OrderResponseDto;
import com.dripdoggy.backend.ResponseDto.OrderPreviewResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.ResponseDto.CouponValidationResponseDto;
import com.dripdoggy.backend.ResponseDto.AdminOrderResponseDto;
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

import com.dripdoggy.backend.Iservice.IPaymentService;

@Service
@Transactional
public class OrderService implements IOrderService {

    private final OrdersRepository ordersRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final OtpRepository otpRepository;
    private final OtpService otpService;
    private final ICouponService couponService;
    private final EmailService emailService;
    private final OrderReturnRepository orderReturnRepository;
    private final ProductVariantSizeRepository productVariantSizeRepository;
    private final IShippingFeeService shippingFeeService;
    private final IPaymentService paymentService;

    @Autowired
    public OrderService(OrdersRepository ordersRepository, 
                        OrderItemRepository orderItemRepository, 
                        CartRepository cartRepository, 
                        AddressRepository addressRepository, 
                        UserRepository userRepository, 
                        OtpRepository otpRepository, 
                        OtpService otpService, 
                        ICouponService couponService, 
                        EmailService emailService,
                        OrderReturnRepository orderReturnRepository,
                        ProductVariantSizeRepository productVariantSizeRepository,
                        IShippingFeeService shippingFeeService,
                        IPaymentService paymentService) {
        this.ordersRepository = ordersRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.otpService = otpService;
        this.couponService = couponService;
        this.emailService = emailService;
        this.orderReturnRepository = orderReturnRepository;
        this.productVariantSizeRepository = productVariantSizeRepository;
        this.shippingFeeService = shippingFeeService;
        this.paymentService = paymentService;
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
        User user = getCurrentCustomer();
        String regMethod = user.getRegistrationMethod();

        if ("PHONE".equalsIgnoreCase(regMethod)) {
            // Verify request phone matches registered phone
            String requestPhone = request.getPhoneNo();
            if (requestPhone == null || requestPhone.trim().isEmpty()) {
                throw new IllegalArgumentException("Phone number is required.");
            }
            String cleanReq = requestPhone.trim().startsWith("+") ? requestPhone.trim().substring(1) : requestPhone.trim();
            String dbPhone = user.getPhoneNo();
            if (dbPhone == null) {
                throw new PhoneNotFoundException("No registered phone number found for this user.");
            }
            String cleanDb = dbPhone.trim().startsWith("+") ? dbPhone.trim().substring(1) : dbPhone.trim();
            if (!cleanReq.equals(cleanDb)) {
                throw new PhoneMismatchException("The provided phone number does not match your registered phone number.");
            }

            String email = request.getEmail();
            if (email == null || email.trim().isEmpty() || !email.contains("@")) {
                throw new IllegalArgumentException("Email verification is required for checkout. Please provide a valid email.");
            }
            java.util.Optional<User> existingUserOpt = userRepository.findByEmail(email.trim());
            if (existingUserOpt.isPresent() && !existingUserOpt.get().getId().equals(user.getId())) {
                throw new IllegalArgumentException("This email address is already registered by another user.");
            }
            otpService.generateAndSendOtp(email.trim(), OtpType.EMAIL);
            return new ResponseMsgDto(200, "Verification OTP code sent to email: " + email.trim());
        } else {
            // Verify request email matches registered email
            String requestEmail = request.getEmail();
            if (requestEmail == null || requestEmail.trim().isEmpty()) {
                throw new IllegalArgumentException("Email address is required.");
            }
            String dbEmail = user.getEmail();
            if (dbEmail == null) {
                throw new EmailNotFoundException("No registered email address found for this user.");
            }
            if (!requestEmail.trim().equalsIgnoreCase(dbEmail.trim())) {
                throw new EmailMismatchException("The provided email address does not match your registered email address.");
            }

            String phoneNo = request.getPhoneNo();
            if (phoneNo == null || phoneNo.trim().isEmpty() || !phoneNo.matches("^[0-9]{10}$")) {
                throw new IllegalArgumentException("Phone number verification is required for checkout. Please provide a valid 10-digit phone number.");
            }
            String formattedPhone = phoneNo.trim();
            String alternative = formattedPhone.startsWith("+") ? formattedPhone.substring(1) : "+" + formattedPhone;
            java.util.Optional<User> existingUserOpt = userRepository.findByPhoneNo(formattedPhone)
                    .or(() -> userRepository.findByPhoneNo(alternative));
            if (existingUserOpt.isPresent() && !existingUserOpt.get().getId().equals(user.getId())) {
                throw new IllegalArgumentException("This phone number is already registered by another user.");
            }
            otpService.generateAndSendOtp(formattedPhone, OtpType.PHONE);
            return new ResponseMsgDto(200, "Verification OTP code sent to phone: " + formattedPhone);
        }
    }

    @Override
    public ResponseMsgDto verifyCheckoutOtp(CheckoutOtpVerifyRequest request) {
        User user = getCurrentCustomer();
        String regMethod = user.getRegistrationMethod();

        if ("PHONE".equalsIgnoreCase(regMethod)) {
            // Verify request phone matches registered phone
            String requestPhone = request.getPhoneNo();
            if (requestPhone == null || requestPhone.trim().isEmpty()) {
                throw new IllegalArgumentException("Phone number is required.");
            }
            String cleanReq = requestPhone.trim().startsWith("+") ? requestPhone.trim().substring(1) : requestPhone.trim();
            String dbPhone = user.getPhoneNo();
            if (dbPhone == null) {
                throw new PhoneNotFoundException("No registered phone number found for this user.");
            }
            String cleanDb = dbPhone.trim().startsWith("+") ? dbPhone.trim().substring(1) : dbPhone.trim();
            if (!cleanReq.equals(cleanDb)) {
                throw new PhoneMismatchException("The provided phone number does not match your registered phone number.");
            }

            String email = request.getEmail();
            if (email == null || email.trim().isEmpty()) {
                throw new IllegalArgumentException("Email is required for verification.");
            }
            boolean verified = otpService.verifyOtp(email.trim(), OtpType.EMAIL, request.getOtpCode());
            if (!verified) {
                throw new InvalidCredentialsException("Invalid or expired OTP.");
            }
            user.setEmail(email.trim());
            userRepository.save(user);
            return new ResponseMsgDto(200, "Email address verified and saved successfully.");
        } else {
            // Verify request email matches registered email
            String requestEmail = request.getEmail();
            if (requestEmail == null || requestEmail.trim().isEmpty()) {
                throw new IllegalArgumentException("Email address is required.");
            }
            String dbEmail = user.getEmail();
            if (dbEmail == null) {
                throw new EmailNotFoundException("No registered email address found for this user.");
            }
            if (!requestEmail.trim().equalsIgnoreCase(dbEmail.trim())) {
                throw new EmailMismatchException("The provided email address does not match your registered email address.");
            }

            String phoneNo = request.getPhoneNo();
            if (phoneNo == null || phoneNo.trim().isEmpty()) {
                throw new IllegalArgumentException("Phone number is required for verification.");
            }
            boolean verified = otpService.verifyOtp(phoneNo.trim(), OtpType.PHONE, request.getOtpCode());
            if (!verified) {
                throw new InvalidCredentialsException("Invalid or expired OTP.");
            }
            user.setPhoneNo(phoneNo.trim());
            userRepository.save(user);
            return new ResponseMsgDto(200, "Phone number verified and saved successfully.");
        }
    }

    @Override
    public OrderResponseDto placeOrder(OrderRequestDto request) {
        User user = getCurrentCustomer();

        // 1. Verify checkout OTP based on registration method
        String regMethod = user.getRegistrationMethod();
        if ("PHONE".equalsIgnoreCase(regMethod)) {
            String email = user.getEmail();
            if (email == null || email.trim().isEmpty()) {
                throw new InvalidCredentialsException("Email address must be added and verified before checkout.");
            }
            Otp otp = otpRepository.findTopByTargetValueAndOtpTypeOrderByCreatedAtDesc(email, OtpType.EMAIL)
                    .orElseThrow(() -> new InvalidCredentialsException("Email verification is compulsory before checkout."));
            if (!Boolean.TRUE.equals(otp.getIsVerified())) {
                throw new InvalidCredentialsException("Email address must be verified before placing an order.");
            }
        } else {
            String phoneNo = request.getPhoneNo();
            if (phoneNo == null || phoneNo.trim().isEmpty()) {
                throw new InvalidCredentialsException("Phone number must be added and verified before checkout.");
            }
            Otp otp = otpRepository.findTopByTargetValueAndOtpTypeOrderByCreatedAtDesc(phoneNo, OtpType.PHONE)
                    .orElseThrow(() -> new InvalidCredentialsException("Phone number verification is compulsory before checkout."));
            if (!Boolean.TRUE.equals(otp.getIsVerified())) {
                throw new InvalidCredentialsException("Phone number must be verified before placing an order.");
            }
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
            int stock = size.getStockQuantity() != null ? size.getStockQuantity() : 0;
            if (stock < cart.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for variant " + size.getProductVariant().getVariantName() + " (" + size.getSizeName() + "). Available: " + stock);
            }
            BigDecimal price = size.getProductVariant().getPrice();
            subtotal = subtotal.add(price.multiply(BigDecimal.valueOf(cart.getQuantity())));
        }

        // Calculate Bundle Discount
        BigDecimal bundleDiscount = calculateBundleDiscount(cartItems);

        // 5. Apply Coupon Discount (if any)
        BigDecimal couponDiscount = BigDecimal.ZERO;
        BigDecimal remainingSubtotalForCoupon = subtotal.subtract(bundleDiscount);
        if (remainingSubtotalForCoupon.compareTo(BigDecimal.ZERO) < 0) {
            remainingSubtotalForCoupon = BigDecimal.ZERO;
        }
        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            CouponValidationResponseDto couponResponse = couponService.validateAndCalculateDiscount(
                    request.getCouponCode(), remainingSubtotalForCoupon
            );
            couponDiscount = couponResponse.getCalculatedDiscount();
        }

        BigDecimal discountVal = bundleDiscount.add(couponDiscount);

        // 6. Calculate Tax (Tax calculations disabled - set to null as requested)
        BigDecimal discountedSubtotal = subtotal.subtract(discountVal);
        if (discountedSubtotal.compareTo(BigDecimal.ZERO) < 0) {
            discountedSubtotal = BigDecimal.ZERO;
        }
        BigDecimal taxAmount = null;

        // 7. Calculate Delivery Fee
        BigDecimal shippingFee = shippingFeeService.calculateShippingFee(
                address.getState(),
                address.getCity(),
                request.getDeliveryMethod()
        );

        // 8. Calculate Final Total Amount (Discounted Subtotal + Tax + Shipping)
        BigDecimal taxForTotal = (taxAmount != null) ? taxAmount : BigDecimal.ZERO;
        BigDecimal totalAmount = discountedSubtotal.add(taxForTotal).add(shippingFee);

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
        String dm = (request.getDeliveryMethod() != null && !request.getDeliveryMethod().trim().isEmpty())
                ? request.getDeliveryMethod().toUpperCase().trim()
                : "STANDARD";
        order.setDeliveryMethod(dm);
        order.setShippingFee(shippingFee);

        Orders savedOrder = ordersRepository.save(order);

        // Auto-create Payment Ledger Record for COD / Order
        try {
            paymentService.createPaymentRecordForOrder(savedOrder);
        } catch (Exception e) {
            System.err.println("Could not create payment record: " + e.getMessage());
        }

        // 9. Convert Cart Items to OrderItems, and Soft Delete Cart Items
        for (Cart cart : cartItems) {
            ProductVariantSize size = cart.getProductVariantSize();

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProductVariantSize(size);
            orderItem.setQuantity(cart.getQuantity());
            orderItem.setPrice(size.getProductVariant().getPrice());
            orderItem.setSubTotal(size.getProductVariant().getPrice().multiply(BigDecimal.valueOf(cart.getQuantity())));
            orderItem.setBundle(cart.getBundle());
            
            orderItemRepository.save(orderItem);

            // Decrement Stock
            int stock = size.getStockQuantity() != null ? size.getStockQuantity() : 0;
            size.setStockQuantity(stock - cart.getQuantity());
            productVariantSizeRepository.save(size);

            // Soft delete cart item
            cart.setIsActive(false);
            cartRepository.save(cart);
        }

        // 10. Increment usage count of Coupon
        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            couponService.incrementUsageCount(request.getCouponCode());
        }

        // 11. Send Confirmation Email to Customer
        String customerName = "";
        if (address != null && address.getFirstName() != null && !address.getFirstName().trim().isEmpty()) {
            customerName = ((address.getFirstName() != null ? address.getFirstName() : "") + " " +
                           (address.getLastName() != null ? address.getLastName() : "")).trim();
        } else {
            customerName = ((user.getFirstName() != null ? user.getFirstName() : "") + " " +
                           (user.getLastName() != null ? user.getLastName() : "")).trim();
        }
        List<OrderItem> orderItems = orderItemRepository.findByOrder(savedOrder);
        savedOrder.setOrderItems(orderItems);
        emailService.sendOrderPlacementEmail(
                user.getEmail(),
                "#DD-" + savedOrder.getId(),
                customerName.trim(),
                savedOrder
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
            int stock = size.getStockQuantity() != null ? size.getStockQuantity() : 0;
            if (stock < cart.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for variant " + size.getProductVariant().getVariantName() + " (" + size.getSizeName() + "). Available: " + stock);
            }
            BigDecimal price = size.getProductVariant().getPrice();
            subtotal = subtotal.add(price.multiply(BigDecimal.valueOf(cart.getQuantity())));
        }

        // Calculate Bundle Discount
        BigDecimal bundleDiscount = calculateBundleDiscount(cartItems);

        // 3. Apply Coupon Discount (if any)
        BigDecimal couponDiscount = BigDecimal.ZERO;
        BigDecimal remainingSubtotalForCoupon = subtotal.subtract(bundleDiscount);
        if (remainingSubtotalForCoupon.compareTo(BigDecimal.ZERO) < 0) {
            remainingSubtotalForCoupon = BigDecimal.ZERO;
        }
        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            CouponValidationResponseDto couponResponse = couponService.validateAndCalculateDiscount(
                    request.getCouponCode(), remainingSubtotalForCoupon
            );
            couponDiscount = couponResponse.getCalculatedDiscount();
        }

        BigDecimal discountVal = bundleDiscount.add(couponDiscount);

        // 4. Calculate Tax (Tax calculations disabled - set to null as requested)
        BigDecimal discountedSubtotal = subtotal.subtract(discountVal);
        if (discountedSubtotal.compareTo(BigDecimal.ZERO) < 0) {
            discountedSubtotal = BigDecimal.ZERO;
        }
        BigDecimal taxAmount = null;

        // 5. Calculate Delivery Fee
        String state = request.getState();
        String city = request.getCity();
        if ((state == null || state.trim().isEmpty()) && request.getAddressId() != null) {
            Address addr = addressRepository.findByIdAndUserAndIsActiveTrue(request.getAddressId(), user).orElse(null);
            if (addr != null) {
                state = addr.getState();
                city = addr.getCity();
            }
        }
        if (state == null || state.trim().isEmpty()) {
            List<Address> userAddresses = addressRepository.findByUserAndIsActiveTrue(user);
            if (!userAddresses.isEmpty()) {
                Address defaultAddr = userAddresses.stream()
                        .filter(a -> Boolean.TRUE.equals(a.getIsDefault()))
                        .findFirst()
                        .orElse(userAddresses.get(0));
                state = defaultAddr.getState();
                city = defaultAddr.getCity();
            }
        }
        BigDecimal shippingFee = shippingFeeService.calculateShippingFee(state, city, request.getDeliveryMethod());

        // 6. Calculate Final Total Amount
        BigDecimal taxForTotal = (taxAmount != null) ? taxAmount : BigDecimal.ZERO;
        BigDecimal grandTotal = discountedSubtotal.add(taxForTotal).add(shippingFee);

        return new OrderPreviewResponseDto(subtotal, discountVal, taxAmount, shippingFee, grandTotal);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDto> getCustomerOrders() {
        User user = getCurrentCustomer();
        List<Orders> orders = ordersRepository.findByUserOrderByOrderTimestampDesc(user);
        return orders.stream().map(this::mapToDto).collect(java.util.stream.Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponseDto getCustomerOrderById(Long id) {
        User user = getCurrentCustomer();
        Orders order = ordersRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + id));

        // Ownership validation (prevent IDOR)
        if (!order.getUser().getId().equals(user.getId())) {
            throw new OrderNotFoundException("Order not found with id: " + id);
        }

        return mapToDto(order);
    }

    private OrderResponseDto mapToDto(Orders order) {
        String orderNumber = "#DD-" + order.getId();
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

        List<AdminOrderResponseDto.OrderItemDetail> items = new java.util.ArrayList<>();
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

        OrderResponseDto dto = new OrderResponseDto(
                orderNumber,
                order.getOrderTimestamp(),
                order.getTotalAmount(),
                order.getDiscount(),
                order.getTax(),
                order.getPlatformFee(),
                order.getShippingFee(),
                order.getDeliveryMethod(),
                order.getDeliveryStatus() != null ? order.getDeliveryStatus().name() : "PLACED",
                order.getPaymentStatus() != null ? order.getPaymentStatus().name() : "UNPAID",
                order.getPhoneNumber(),
                customerEmail,
                customerName,
                destinationAddress
        );
        dto.setItems(items);
        dto.setProcessingTimestamp(order.getProcessingTimestamp());
        dto.setShippedTimestamp(order.getShippedTimestamp());
        dto.setDeliveredTimestamp(order.getDeliveredTimestamp());
        dto.setCancelledTimestamp(order.getCancelledTimestamp());
        return dto;
    }

    private BigDecimal calculateBundleDiscount(List<Cart> cartItems) {
        BigDecimal bundleDiscountTotal = BigDecimal.ZERO;

        // Group cart items by bundle ID (only for items that belong to a bundle)
        java.util.Map<Long, List<Cart>> bundleCartItemsMap = cartItems.stream()
                .filter(c -> c.getBundle() != null)
                .collect(java.util.stream.Collectors.groupingBy(c -> c.getBundle().getId()));

        for (java.util.Map.Entry<Long, List<Cart>> entry : bundleCartItemsMap.entrySet()) {
            List<Cart> itemsInCart = entry.getValue();
            if (itemsInCart.isEmpty()) continue;

            Bundle bundle = itemsInCart.get(0).getBundle();
            
            // Get the list of product variant IDs required for this bundle
            java.util.Set<Long> bundleVariantIds = bundle.getProductVariants().stream()
                    .map(ProductVariant::getId)
                    .collect(java.util.stream.Collectors.toSet());

            // Get product variant IDs present in cart for this bundle
            java.util.Set<Long> cartVariantIds = itemsInCart.stream()
                    .map(c -> c.getProductVariantSize().getProductVariant().getId())
                    .collect(java.util.stream.Collectors.toSet());

            // Check if the complete bundle is present in the cart
            if (cartVariantIds.containsAll(bundleVariantIds)) {
                // Find how many complete bundles are in the cart (min quantity of bundle variants)
                int bundleQuantity = itemsInCart.stream()
                        .filter(c -> bundleVariantIds.contains(c.getProductVariantSize().getProductVariant().getId()))
                        .mapToInt(Cart::getQuantity)
                        .min()
                        .orElse(0);

                if (bundleQuantity > 0) {
                    // Calculate the original total price for one bundle based on the specific variants in the cart
                    BigDecimal bundleOriginalPrice = BigDecimal.ZERO;
                    for (ProductVariant variant : bundle.getProductVariants()) {
                        Cart matchingItem = itemsInCart.stream()
                                .filter(c -> c.getProductVariantSize().getProductVariant().getId().equals(variant.getId()))
                                .findFirst()
                                .orElse(null);
                        if (matchingItem != null) {
                            bundleOriginalPrice = bundleOriginalPrice.add(matchingItem.getProductVariantSize().getProductVariant().getPrice());
                        }
                    }

                    // Calculate bundle price
                    BigDecimal discountedBundlePrice;
                    if (bundle.getDiscountType() == DiscountType.PERCENTAGE) {
                        BigDecimal discountFraction = bundle.getDiscountValue().divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
                        BigDecimal discountAmount = bundleOriginalPrice.multiply(discountFraction);
                        discountedBundlePrice = bundleOriginalPrice.subtract(discountAmount);
                    } else { // FLAT discount
                        discountedBundlePrice = bundleOriginalPrice.subtract(bundle.getDiscountValue());
                    }

                    if (discountedBundlePrice.compareTo(BigDecimal.ZERO) < 0) {
                        discountedBundlePrice = BigDecimal.ZERO;
                    }

                    // Bundle discount per bundle = bundleOriginalPrice - discountedBundlePrice
                    BigDecimal discountPerBundle = bundleOriginalPrice.subtract(discountedBundlePrice);
                    bundleDiscountTotal = bundleDiscountTotal.add(discountPerBundle.multiply(BigDecimal.valueOf(bundleQuantity)));
                }
            }
        }

        return bundleDiscountTotal;
    }
}
