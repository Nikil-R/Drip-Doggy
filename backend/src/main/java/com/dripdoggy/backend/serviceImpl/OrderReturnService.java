package com.dripdoggy.backend.serviceImpl;

import com.dripdoggy.backend.Iservice.IOrderReturnService;
import com.dripdoggy.backend.RequestDto.OrderCancelRequestDto;
import com.dripdoggy.backend.RequestDto.ReturnSubmitRequestDto;
import com.dripdoggy.backend.RequestDto.ExchangeSubmitRequestDto;
import com.dripdoggy.backend.ResponseDto.AdminReturnResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.entity.*;
import com.dripdoggy.backend.enums.*;
import com.dripdoggy.backend.exception.*;
import com.dripdoggy.backend.repository.*;
import com.dripdoggy.backend.Configuration.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderReturnService implements IOrderReturnService {

	private final OrdersRepository ordersRepository;
	private final OrderReturnRepository orderReturnRepository;
	private final OrderItemRepository orderItemRepository;
	private final UserRepository userRepository;
	private final S3Service s3Service;
	private final ProductVariantRepository productVariantRepository;
	private final EmailService emailService;

	@Autowired
	public OrderReturnService(OrdersRepository ordersRepository, OrderReturnRepository orderReturnRepository,
			OrderItemRepository orderItemRepository, UserRepository userRepository, S3Service s3Service,
			ProductVariantRepository productVariantRepository, EmailService emailService) {
		this.ordersRepository = ordersRepository;
		this.orderReturnRepository = orderReturnRepository;
		this.orderItemRepository = orderItemRepository;
		this.userRepository = userRepository;
		this.s3Service = s3Service;
		this.productVariantRepository = productVariantRepository;
		this.emailService = emailService;
	}

	private User getCurrentCustomer() {
		org.springframework.security.core.Authentication authentication = org.springframework.security.core.context.SecurityContextHolder
				.getContext().getAuthentication();
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
			user = userRepository.findByPhoneNo(principalName).or(() -> userRepository.findByPhoneNo(alternative))
					.orElseThrow(() -> new PhoneNotFoundException("Phone number is not registered: " + principalName));
		}
		if (user.getRole() != UserRole.CUSTOMER) {
			throw new IllegalArgumentException("Access Denied: Only customers can perform this action.");
		}
		return user;
	}

	@Override
	public ResponseMsgDto createReturnRequest(Long orderId, ReturnSubmitRequestDto dto) {
		User user = getCurrentCustomer();
		List<MultipartFile> images = dto.getImages();
		Orders order = ordersRepository.findById(orderId)
				.orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

		// Validate ownership
		if (!order.getUser().getId().equals(user.getId())) {
			throw new InvalidCredentialsException("Access Denied: You do not own this order.");
		}

		if (order.getDeliveredTimestamp() == null) {
			throw new InvalidOrderStateException("Returns are only allowed for delivered orders.");
		}

		if (order.getDeliveredTimestamp().plusHours(24).isBefore(LocalDateTime.now())) {
			throw new ReturnWindowExpiredException("Return is not possible because 24 hours is over.");
		}

		// Validate order item exists in this order
		OrderItem orderItem = orderItemRepository.findById(dto.getOrderItemId()).orElseThrow(
				() -> new ResourceNotFoundException("Order item not found with id: " + dto.getOrderItemId()));
		if (!orderItem.getOrder().getId().equals(order.getId())) {
			throw new InvalidOrderItemIDException("Invalid order item for this order.");
		}

		// Validate and extract quantity (must not be null and must be at least 1)
		if (dto.getQuantity() == null || dto.getQuantity() < 1) {
			throw new InvalidReturnQuantityException(orderItem.getQuantity(), dto.getQuantity() != null ? dto.getQuantity() : 0, 0);
		}
		int requestedQuantity = dto.getQuantity();

		// Enforce cumulative quantity check for active return/exchange requests
		List<OrderReturn> existingRequests = orderReturnRepository.findByOrderItemId(dto.getOrderItemId());
		int activeQuantity = 0;
		for (OrderReturn r : existingRequests) {
			if (r.getStatus() != ReturnStatus.REJECTED) {
				activeQuantity += (r.getQuantity() != null) ? r.getQuantity() : orderItem.getQuantity();
			}
		}

		if (activeQuantity + requestedQuantity > orderItem.getQuantity()) {
			throw new InvalidReturnQuantityException(orderItem.getQuantity(), requestedQuantity, activeQuantity);
		}

		// Validate cancel reason word count (max 250 words)
		if (countWords(dto.getCancelReason()) > 250) {
			throw new InvalidOrderStateException("Cancellation reason cannot exceed 250 words.");
		}

		// Filter null or empty files
		List<MultipartFile> activeImages = new ArrayList<>();
		if (images != null) {
			for (MultipartFile img : images) {
				if (img != null && !img.isEmpty()) {
					activeImages.add(img);
				}
			}
		}

		// Return requires between 1 and 3 images.
		if (activeImages.isEmpty() || activeImages.size() > 3) {
			throw new InvalidOrderStateException("You must upload between 1 and 3 defect images.");
		}

		// Validate refund method details (exactly one option)
		boolean isQr = (dto.getQrCodeImage() != null && !dto.getQrCodeImage().isEmpty());
		boolean isUpi = (dto.getUpiId() != null && !dto.getUpiId().trim().isEmpty())
				|| (dto.getUpiPhone() != null && !dto.getUpiPhone().trim().isEmpty());
		boolean isBank = (dto.getBankAccountNumber() != null && !dto.getBankAccountNumber().trim().isEmpty())
				|| (dto.getBankAccountName() != null && !dto.getBankAccountName().trim().isEmpty())
				|| (dto.getBankIfsc() != null && !dto.getBankIfsc().trim().isEmpty());

		int countMethods = 0;
		if (isQr)
			countMethods++;
		if (isUpi)
			countMethods++;
		if (isBank)
			countMethods++;

		if (countMethods == 0) {
			throw new InvalidOrderStateException(
					"You must submit exactly one refund method (QR Code, UPI ID, or Bank details).");
		}
		if (countMethods > 1) {
			throw new InvalidOrderStateException(
					"You can only submit one type of refund method. Please choose either QR Code, UPI ID, or Bank details, not multiple.");
		}

		if (isUpi && dto.getUpiPhone() != null && !dto.getUpiPhone().trim().isEmpty()) {
			String phone = dto.getUpiPhone().trim();
			if (!phone.matches("^\\d{10}$")) {
				throw new InvalidOrderStateException("UPI Phone number must be exactly 10 digits.");
			}
		}

		// Upload QR Code image if QR method is selected
		String qrCodeImageUrl = null;
		if (isQr) {
			try {
				qrCodeImageUrl = s3Service.uploadFile(dto.getQrCodeImage());
			} catch (IOException e) {
				throw new FailedToUploadImageException("Failed to upload QR Code image to S3: " + e.getMessage());
			}
		}

		// Upload images to S3
		List<String> imageUrls = new ArrayList<>();
		for (MultipartFile img : activeImages) {
			try {
				String url = s3Service.uploadFile(img);
				imageUrls.add(url);
			} catch (IOException e) {
				throw new FailedToUploadImageException("Failed to upload defect image to S3: " + e.getMessage());
			}
		}

		OrderReturn orderReturn = new OrderReturn();
		orderReturn.setOrder(order);
		orderReturn.setOrderItemId(dto.getOrderItemId());
		orderReturn.setQuantity(requestedQuantity);
		orderReturn.setRequestType(ReturnRequestType.RETURN);
		orderReturn.setCancelReason(dto.getCancelReason());
		orderReturn.setStatus(ReturnStatus.PENDING);

		if (isQr) {
			orderReturn.setQrCodeImageUrl(qrCodeImageUrl);
		} else if (isUpi) {
			orderReturn.setUpiId(dto.getUpiId());
			orderReturn.setUpiPhone(dto.getUpiPhone());
		} else if (isBank) {
			orderReturn.setBankAccountName(dto.getBankAccountName());
			orderReturn.setBankName(dto.getBankName());
			orderReturn.setBankIfsc(dto.getBankIfsc());
			orderReturn.setBankAccountNumber(dto.getBankAccountNumber());
		}

		if (imageUrls.size() > 0)
			orderReturn.setDefectImageUrl1(imageUrls.get(0));
		if (imageUrls.size() > 1)
			orderReturn.setDefectImageUrl2(imageUrls.get(1));
		if (imageUrls.size() > 2)
			orderReturn.setDefectImageUrl3(imageUrls.get(2));

		orderReturnRepository.save(orderReturn);

		// Update parent order delivery status
		order.setDeliveryStatus(DeliveryStatus.RETURN_INITIATED);
		ordersRepository.save(order);

		// Notify admin via email
		try {
			String adminEmail = "dripdoggyofficial@gmail.com";
			String orderNumber = "#DD-" + order.getId();
			Address address = order.getAddress();
			String customerName = "";
			if (address != null && address.getFirstName() != null && !address.getFirstName().trim().isEmpty()) {
				customerName = ((address.getFirstName() != null ? address.getFirstName() : "") + " "
						+ (address.getLastName() != null ? address.getLastName() : "")).trim();
			} else {
				customerName = ((user.getFirstName() != null ? user.getFirstName() : "") + " "
						+ (user.getLastName() != null ? user.getLastName() : "")).trim();
			}
			String productName = "";
			String variantName = "Default";
			String sizeName = "N/A";
			if (orderItem.getProductVariantSize() != null) {
				sizeName = orderItem.getProductVariantSize().getSizeName();
				if (orderItem.getProductVariantSize().getProductVariant() != null) {
					variantName = orderItem.getProductVariantSize().getProductVariant().getVariantName();
					if (orderItem.getProductVariantSize().getProductVariant().getProduct() != null) {
						productName = orderItem.getProductVariantSize().getProductVariant().getProduct().getProductName();
					}
				}
			}
			emailService.sendAdminReturnRequestNotification(adminEmail, orderNumber, "RETURN", customerName,
					user.getEmail(), productName, dto.getCancelReason());

			// Notify customer via email
			emailService.sendCustomerReturnInitiatedEmail(
					user.getEmail(), 
					orderNumber, 
					"RETURN", 
					customerName,
					productName,
					variantName,
					sizeName,
					orderItem.getPrice().doubleValue(),
					requestedQuantity
			);
		} catch (Exception e) {
			// Log or ignore email failure to prevent rolling back successful DB transaction
			e.printStackTrace();
		}

		return new ResponseMsgDto(200, "Return request submitted successfully. Awaiting Admin approval.");
	}

	@Override
	public ResponseMsgDto createExchangeRequest(Long orderId, ExchangeSubmitRequestDto dto) {
		User user = getCurrentCustomer();
		List<MultipartFile> images = dto.getImages();
		Orders order = ordersRepository.findById(orderId)
				.orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

		// Validate ownership
		if (!order.getUser().getId().equals(user.getId())) {
			throw new InvalidCredentialsException("Access Denied: You do not own this order.");
		}

		if (order.getDeliveredTimestamp() == null) {
			throw new InvalidOrderStateException("Exchanges are only allowed for delivered orders.");
		}

		if (order.getDeliveredTimestamp().plusHours(24).isBefore(LocalDateTime.now())) {
			throw new ReturnWindowExpiredException("Exchange is not possible because 24 hours is over.");
		}

		// Validate order item exists in this order
		OrderItem orderItem = orderItemRepository.findById(dto.getOrderItemId()).orElseThrow(
				() -> new ResourceNotFoundException("Order item not found with id: " + dto.getOrderItemId()));
		if (!orderItem.getOrder().getId().equals(order.getId())) {
			throw new InvalidOrderItemIDException("Invalid order item for this order.");
		}

		// Validate and extract quantity (must not be null and must be at least 1)
		if (dto.getQuantity() == null || dto.getQuantity() < 1) {
			throw new InvalidReturnQuantityException(orderItem.getQuantity(), dto.getQuantity() != null ? dto.getQuantity() : 0, 0);
		}
		int requestedQuantity = dto.getQuantity();

		// Enforce cumulative quantity check for active return/exchange requests
		List<OrderReturn> existingRequests = orderReturnRepository.findByOrderItemId(dto.getOrderItemId());
		int activeQuantity = 0;
		for (OrderReturn r : existingRequests) {
			if (r.getStatus() != ReturnStatus.REJECTED) {
				activeQuantity += (r.getQuantity() != null) ? r.getQuantity() : orderItem.getQuantity();
			}
		}

		if (activeQuantity + requestedQuantity > orderItem.getQuantity()) {
			throw new InvalidReturnQuantityException(orderItem.getQuantity(), requestedQuantity, activeQuantity);
		}

		// Validate exchange reason word count (max 250 words)
		if (countWords(dto.getExchangeReason()) > 250) {
			throw new InvalidOrderStateException("Exchange reason cannot exceed 250 words.");
		}

		// Calculate price differences
		java.math.BigDecimal originalPrice = orderItem.getPrice();
		java.math.BigDecimal targetPrice = originalPrice;
		String variantName = orderItem.getProductVariantSize().getProductVariant().getVariantName();

		if (dto.getTargetVariantId() != null) {
			ProductVariant targetVariant = productVariantRepository.findById(dto.getTargetVariantId())
					.orElseThrow(() -> new ResourceNotFoundException("Target product variant not found with id: " + dto.getTargetVariantId()));
			
			// Validate that the target variant belongs to the same product as the original order item
			Long originalProductId = orderItem.getProductVariantSize().getProductVariant().getProduct().getId();
			Long targetProductId = targetVariant.getProduct().getId();
			if (!originalProductId.equals(targetProductId)) {
				throw new InvalidOrderStateException("You can only exchange this item for a variant of the same product.");
			}
			
			targetPrice = targetVariant.getPrice();
			variantName = targetVariant.getVariantName();
		}

		java.math.BigDecimal difference = java.math.BigDecimal.ZERO; // Set to ZERO as all variants have the same price

		// Filter null or empty files
		List<MultipartFile> activeImages = new ArrayList<>();
		if (images != null) {
			for (MultipartFile img : images) {
				if (img != null && !img.isEmpty()) {
					activeImages.add(img);
				}
			}
		}

		// Exchange requires between 1 and 3 images.
		if (activeImages.isEmpty() || activeImages.size() > 3) {
			throw new InvalidOrderStateException("You must upload between 1 and 3 defect images.");
		}

		// Upload images to S3
		List<String> imageUrls = new ArrayList<>();
		for (MultipartFile img : activeImages) {
			try {
				String url = s3Service.uploadFile(img);
				imageUrls.add(url);
			} catch (IOException e) {
				throw new FailedToUploadImageException("Failed to upload defect image to S3: " + e.getMessage());
			}
		}

		OrderReturn orderReturn = new OrderReturn();
		orderReturn.setOrder(order);
		orderReturn.setOrderItemId(dto.getOrderItemId());
		orderReturn.setQuantity(requestedQuantity);
		orderReturn.setRequestType(ReturnRequestType.EXCHANGE);
		orderReturn.setCancelReason(dto.getExchangeReason());
		orderReturn.setTargetSize(dto.getTargetSize());
		orderReturn.setTargetVariantId(dto.getTargetVariantId());
		orderReturn.setStatus(ReturnStatus.PENDING);

		if (imageUrls.size() > 0)
			orderReturn.setDefectImageUrl1(imageUrls.get(0));
		if (imageUrls.size() > 1)
			orderReturn.setDefectImageUrl2(imageUrls.get(1));
		if (imageUrls.size() > 2)
			orderReturn.setDefectImageUrl3(imageUrls.get(2));

		orderReturnRepository.save(orderReturn);

		// Update parent order delivery status
		order.setDeliveryStatus(DeliveryStatus.EXCHANGE_INITIATED);
		ordersRepository.save(order);

		String productName = "";
		if (orderItem.getProductVariantSize() != null
				&& orderItem.getProductVariantSize().getProductVariant() != null
				&& orderItem.getProductVariantSize().getProductVariant().getProduct() != null) {
			productName = orderItem.getProductVariantSize().getProductVariant().getProduct().getProductName();
		}

		// Notify admin & customer via email
		try {
			String adminEmail = "dripdoggyofficial@gmail.com";
			String orderNumber = "#DD-" + order.getId();
			Address address = order.getAddress();
			String customerName = "";
			if (address != null && address.getFirstName() != null && !address.getFirstName().trim().isEmpty()) {
				customerName = ((address.getFirstName() != null ? address.getFirstName() : "") + " "
						+ (address.getLastName() != null ? address.getLastName() : "")).trim();
			} else {
				customerName = ((user.getFirstName() != null ? user.getFirstName() : "") + " "
						+ (user.getLastName() != null ? user.getLastName() : "")).trim();
			}

			// Admin notification
			emailService.sendAdminReturnRequestNotification(adminEmail, orderNumber, "EXCHANGE", customerName,
					user.getEmail(), productName, dto.getExchangeReason());

			// Customer notification depending on price difference
			String origVariantName = "Default";
			String origSizeName = "N/A";
			if (orderItem.getProductVariantSize() != null) {
				origSizeName = orderItem.getProductVariantSize().getSizeName();
				if (orderItem.getProductVariantSize().getProductVariant() != null) {
					origVariantName = orderItem.getProductVariantSize().getProductVariant().getVariantName();
				}
			}
			String exchangeVariantText = origVariantName;
			if (dto.getTargetVariantId() != null) {
				exchangeVariantText = origVariantName + " (Exchange requested to: " + variantName + ")";
			}
			String sizeText = origSizeName;
			if (dto.getTargetSize() != null && !dto.getTargetSize().equalsIgnoreCase(origSizeName)) {
				sizeText = origSizeName + " (Exchange requested to: " + dto.getTargetSize() + ")";
			}

			// Customer notification depending on price difference
			if (difference.compareTo(java.math.BigDecimal.ZERO) > 0) {
				// Send standard exchange initiation email. Payment request email will be triggered manually by the admin.
				emailService.sendCustomerReturnInitiatedEmail(
						user.getEmail(), 
						orderNumber, 
						"EXCHANGE", 
						customerName,
						productName,
						exchangeVariantText,
						sizeText,
						orderItem.getPrice().doubleValue(),
						requestedQuantity
				);
			} else if (difference.compareTo(java.math.BigDecimal.ZERO) < 0) {
				emailService.sendCustomerExchangeRefundInitiatedEmail(
						user.getEmail(),
						orderNumber,
						customerName,
						productName,
						exchangeVariantText,
						difference.abs().doubleValue(),
						sizeText,
						orderItem.getPrice().doubleValue(),
						requestedQuantity
				);
			} else {
				emailService.sendCustomerReturnInitiatedEmail(
						user.getEmail(), 
						orderNumber, 
						"EXCHANGE", 
						customerName,
						productName,
						exchangeVariantText,
						sizeText,
						orderItem.getPrice().doubleValue(),
						requestedQuantity
				);
			}
		} catch (Exception e) {
			// Log or ignore email failure to prevent rolling back successful DB transaction
			e.printStackTrace();
		}

		if (difference.compareTo(java.math.BigDecimal.ZERO) > 0) {
			return new ResponseMsgDto(200, "Exchange request submitted successfully. A net difference payment of ₹" 
					+ difference + " is required for " + productName + " (" + variantName + "). You will receive an email with the payment QR code once approved by the Admin.");
		} else if (difference.compareTo(java.math.BigDecimal.ZERO) < 0) {
			return new ResponseMsgDto(200, "Exchange request submitted successfully. A refund of ₹" 
					+ difference.abs() + " will be processed for " + productName + " (" + variantName + ") upon approval.");
		} else {
			return new ResponseMsgDto(200, "Exchange request submitted successfully. Awaiting Admin approval.");
		}
	}

	@Override
	public ResponseMsgDto cancelOrder(Long orderId, OrderCancelRequestDto dto, String cancelledBy) {
		Orders order = ordersRepository.findById(orderId)
				.orElseThrow(() -> new ResourceNotFoundException("Order not found"));

		// If cancelled by customer, validate ownership
		if ("USER".equalsIgnoreCase(cancelledBy)) {
			User user = getCurrentCustomer();
			if (!order.getUser().getId().equals(user.getId())) {
				throw new InvalidCredentialsException("Access Denied: You do not own this order.");
			}
			DeliveryStatus currentStatus = order.getDeliveryStatus();
			if (currentStatus == DeliveryStatus.PACKED
					|| currentStatus == DeliveryStatus.SHIPPED
					|| currentStatus == DeliveryStatus.OUT_FOR_DELIVERY
					|| currentStatus == DeliveryStatus.DELIVERED) {
				throw new OrderAlreadyPackedException("After packing, you cannot cancel the order.");
			}
		}

		// Cancellations are only allowed before shipping
		if (order.getDeliveryStatus() == DeliveryStatus.SHIPPED
				|| order.getDeliveryStatus() == DeliveryStatus.OUT_FOR_DELIVERY
				|| order.getDeliveryStatus() == DeliveryStatus.DELIVERED) {
			throw new OrderAlreadyShippedException(
					"Cannot cancel this order because it has already been shipped or delivered.");
		}
		if (order.getDeliveryStatus() == DeliveryStatus.CANCELLED) {
			throw new InvalidOrderStateException("This order is already cancelled.");
		}

		String reason = (dto != null && dto.getReason() != null && !dto.getReason().trim().isEmpty())
				? dto.getReason().trim()
				: ("USER".equalsIgnoreCase(cancelledBy) ? "Cancelled by Customer" : "Cancelled by Admin");

		order.setDeliveryStatus(DeliveryStatus.CANCELLED);
		order.setPaymentStatus(PaymentStatus.FAILED); // For COD, no money is collected so it is cancelled/failed
		order.setCancelledBy(cancelledBy.toUpperCase().trim());
		order.setCancellationReason(reason);
		order.setCancelledTimestamp(LocalDateTime.now());

		ordersRepository.save(order);

		// Notify customer via email
		try {
			User user = order.getUser();
			if (user != null) {
				Address address = order.getAddress();
				String customerName = "";
				if (address != null && address.getFirstName() != null && !address.getFirstName().trim().isEmpty()) {
					customerName = ((address.getFirstName() != null ? address.getFirstName() : "") + " "
							+ (address.getLastName() != null ? address.getLastName() : "")).trim();
				} else {
					customerName = ((user.getFirstName() != null ? user.getFirstName() : "") + " "
							+ (user.getLastName() != null ? user.getLastName() : "")).trim();
				}
				if (order.getOrderItems() == null) {
					List<OrderItem> orderItems = orderItemRepository.findByOrder(order);
					order.setOrderItems(orderItems);
				} else {
					order.getOrderItems().size(); // Trigger lazy loading of the managed collection
				}
				emailService.sendCustomerOrderCancelledEmail(user.getEmail(), "#DD-" + order.getId(), customerName, order);
			}
		} catch (Exception e) {
			System.err.println("Could not send cancel email: " + e.getMessage());
		}

		return new ResponseMsgDto(200, "Order cancelled successfully.");
	}

	@Override
	@Transactional(readOnly = true)
	public List<AdminReturnResponseDto> getAllReturnRequests() {
		return orderReturnRepository.findAll().stream().map(this::mapToAdminDto).collect(Collectors.toList());
	}

	@Override
	@Transactional(readOnly = true)
	public AdminReturnResponseDto getReturnRequestById(Long returnId) {
		OrderReturn returnRequest = orderReturnRepository.findById(returnId)
				.orElseThrow(() -> new ResourceNotFoundException("Return request not found"));
		return mapToAdminDto(returnRequest);
	}

	@Override
	public ResponseMsgDto updateReturnStatus(Long returnId, String status) {
		OrderReturn returnRequest = orderReturnRepository.findById(returnId)
				.orElseThrow(() -> new ResourceNotFoundException("Return request not found"));

		if (returnRequest.getStatus() == ReturnStatus.REFUND_COMPLETED) {
			throw new OrderAlreadyProcessedException("This request has already been completed via refund.");
		}
		if (returnRequest.getStatus() == ReturnStatus.EXCHANGE_COMPLETED) {
			throw new OrderAlreadyProcessedException("This request has already been completed via exchange.");
		}
		if (returnRequest.getStatus() == ReturnStatus.CLOSED_UNAVAILABLE_NO_REFUND) {
			throw new OrderAlreadyProcessedException("This exchange request is resolved: the customer chose to keep the original product.");
		}
		if (returnRequest.getStatus() == ReturnStatus.REJECTED) {
			throw new OrderAlreadyProcessedException("This request has already been rejected.");
		}
		if (returnRequest.getStatus() == ReturnStatus.REPLACEMENT_UNAVAILABLE) {
			throw new OrderAlreadyProcessedException("This exchange request is currently waiting for the customer to choose a resolution (Refund or Keep Original) because the replacement size is unavailable.");
		}

		ReturnStatus targetStatus;
		try {
			targetStatus = ReturnStatus.valueOf(status.toUpperCase().trim());
		} catch (IllegalArgumentException e) {
			throw new IllegalArgumentException("Invalid status update value. Must be APPROVED or REJECTED.");
		}

		if (targetStatus != ReturnStatus.APPROVED && targetStatus != ReturnStatus.REJECTED) {
			throw new IllegalArgumentException("Invalid status update value. Must be APPROVED or REJECTED.");
		}

		if (targetStatus == ReturnStatus.APPROVED && returnRequest.getRequestType() == ReturnRequestType.EXCHANGE) {
			OrderItem orderItem = orderItemRepository.findById(returnRequest.getOrderItemId())
					.orElseThrow(() -> new ResourceNotFoundException("Original order item not found"));

			ProductVariant variant = productVariantRepository
					.findById(
							returnRequest.getTargetVariantId() != null ? returnRequest.getTargetVariantId()
									: orderItem.getProductVariantSize().getProductVariant().getId())
					.orElseThrow(() -> new ResourceNotFoundException("Target product variant not found"));

			int requiredQty = returnRequest.getQuantity() != null ? returnRequest.getQuantity() : orderItem.getQuantity();
			java.util.Optional<ProductVariantSize> targetSizeOpt = variant.getProductVariantSizes().stream()
					.filter(s -> s.getSizeName().equalsIgnoreCase(returnRequest.getTargetSize())).findFirst();

			boolean isAvailable = targetSizeOpt.isPresent() && targetSizeOpt.get().getStockQuantity() >= requiredQty;

			if (!isAvailable) {
				returnRequest.setStatus(ReturnStatus.REPLACEMENT_UNAVAILABLE);
				orderReturnRepository.save(returnRequest);

				// Notify customer via unavailability email
				try {
					Orders order = returnRequest.getOrder();
					User user = order.getUser();
					String orderNumber = "#DD-" + order.getId();
					Address address = order.getAddress();
					String customerName = "";
					if (address != null && address.getFirstName() != null && !address.getFirstName().trim().isEmpty()) {
						customerName = ((address.getFirstName() != null ? address.getFirstName() : "") + " "
								+ (address.getLastName() != null ? address.getLastName() : "")).trim();
					} else {
						customerName = ((user.getFirstName() != null ? user.getFirstName() : "") + " "
								+ (user.getLastName() != null ? user.getLastName() : "")).trim();
					}
					
					String productName = "";
					if (orderItem.getProductVariantSize() != null
							&& orderItem.getProductVariantSize().getProductVariant() != null
							&& orderItem.getProductVariantSize().getProductVariant().getProduct() != null) {
						productName = orderItem.getProductVariantSize().getProductVariant().getProduct().getProductName();
					}

					double refundAmt = orderItem.getPrice().doubleValue() * requiredQty;
					emailService.sendCustomerExchangeSizeUnavailableEmail(
							user.getEmail(),
							orderNumber,
							customerName,
							productName,
							orderItem.getProductVariantSize().getSizeName(),
							orderItem.getProductVariantSize().getProductVariant().getVariantName(),
							requiredQty,
							returnRequest.getTargetSize(),
							variant.getVariantName(),
							refundAmt,
							returnRequest.getId()
					);
				} catch (Exception e) {
					e.printStackTrace();
				}

				return new ResponseMsgDto(200, "Replacement size '" + returnRequest.getTargetSize() + "' is out of stock. The request has been updated to REPLACEMENT_UNAVAILABLE and the customer has been notified via email.");
			}
		}

		returnRequest.setStatus(targetStatus);
		orderReturnRepository.save(returnRequest);

		// Notify customer via email
		try {
			Orders order = returnRequest.getOrder();
			User user = order.getUser();
			String orderNumber = "#DD-" + order.getId();
			Address address = order.getAddress();
			String customerName = "";
			if (address != null && address.getFirstName() != null && !address.getFirstName().trim().isEmpty()) {
				customerName = ((address.getFirstName() != null ? address.getFirstName() : "") + " "
						+ (address.getLastName() != null ? address.getLastName() : "")).trim();
			} else {
				customerName = ((user.getFirstName() != null ? user.getFirstName() : "") + " "
						+ (user.getLastName() != null ? user.getLastName() : "")).trim();
			}
			emailService.sendCustomerReturnStatusUpdateEmail(user.getEmail(), orderNumber,
					returnRequest.getRequestType().name(), customerName, targetStatus.name());
		} catch (Exception e) {
			// Ignore email failure to prevent rolling back transaction
			e.printStackTrace();
		}

		return new ResponseMsgDto(200, "Return request status updated to " + targetStatus.name() + " successfully.");
	}

	@Override
	public ResponseMsgDto resolveReturnRequest(Long returnId, String action, String trackingNumber,
			String transactionId) {
		OrderReturn returnRequest = orderReturnRepository.findById(returnId)
				.orElseThrow(() -> new ResourceNotFoundException("Return request not found"));

		if (returnRequest.getStatus() == ReturnStatus.REFUND_COMPLETED) {
			throw new OrderAlreadyProcessedException("This request has already been completed via refund.");
		}
		if (returnRequest.getStatus() == ReturnStatus.EXCHANGE_COMPLETED) {
			throw new OrderAlreadyProcessedException("This request has already been completed via exchange.");
		}
		if (returnRequest.getStatus() == ReturnStatus.CLOSED_UNAVAILABLE_NO_REFUND) {
			throw new OrderAlreadyProcessedException("This exchange request is resolved: the customer chose to keep the original product.");
		}
		if (returnRequest.getStatus() == ReturnStatus.REJECTED) {
			throw new OrderAlreadyProcessedException("This request has already been rejected.");
		}
		if (returnRequest.getStatus() == ReturnStatus.REPLACEMENT_UNAVAILABLE) {
			throw new OrderAlreadyProcessedException("This exchange request is currently waiting for the customer to choose a resolution (Refund or Keep Original) because the replacement size is unavailable.");
		}

		Orders order = returnRequest.getOrder();
		User user = order.getUser();
		Address address = order.getAddress();
		String customerName = "";
		if (address != null && address.getFirstName() != null && !address.getFirstName().trim().isEmpty()) {
			customerName = ((address.getFirstName() != null ? address.getFirstName() : "") + " "
					+ (address.getLastName() != null ? address.getLastName() : "")).trim();
		} else {
			customerName = ((user.getFirstName() != null ? user.getFirstName() : "") + " "
					+ (user.getLastName() != null ? user.getLastName() : "")).trim();
		}
		String orderNumber = "#DD-" + order.getId();

		// Find product name
		String productName = "";
		OrderItem orderItem = orderItemRepository.findById(returnRequest.getOrderItemId()).orElse(null);
		if (orderItem != null && orderItem.getProductVariantSize() != null
				&& orderItem.getProductVariantSize().getProductVariant() != null
				&& orderItem.getProductVariantSize().getProductVariant().getProduct() != null) {
			productName = orderItem.getProductVariantSize().getProductVariant().getProduct().getProductName();
		}

		// Validate action matches the customer's request type
		if (returnRequest.getRequestType() == ReturnRequestType.RETURN && !"REFUND".equalsIgnoreCase(action.trim())) {
			throw new InvalidOrderStateException("This return request is supposed to be a refund.");
		}
		if (returnRequest.getRequestType() == ReturnRequestType.EXCHANGE
				&& !"EXCHANGE".equalsIgnoreCase(action.trim())
				&& !"REFUND".equalsIgnoreCase(action.trim())) {
			throw new InvalidOrderStateException("An exchange request must be resolved via EXCHANGE or REFUND.");
		}
		// Validate that the returned product has reached the warehouse
		if (returnRequest.getRequestType() == ReturnRequestType.RETURN) {
			if (order.getDeliveryStatus() != DeliveryStatus.RETURN_DELIVERED) {
				throw new ReturnLogisticsIncompleteException("Cannot resolve return request because the returned product has not reached the warehouse yet.");
			}
		} else if (returnRequest.getRequestType() == ReturnRequestType.EXCHANGE) {
			if (order.getDeliveryStatus() != DeliveryStatus.EXCHANGE_DELIVERED) {
				throw new ReturnLogisticsIncompleteException("Cannot resolve exchange request because the returned product has not reached the warehouse yet.");
			}
		}
		if ("REFUND".equalsIgnoreCase(action.trim())) {
			if (transactionId != null && !transactionId.trim().isEmpty()) {
				returnRequest.setTransactionId(transactionId.trim());
			}

			returnRequest.setStatus(ReturnStatus.REFUND_COMPLETED);
			returnRequest.setResolvedAt(LocalDateTime.now());
			orderReturnRepository.save(returnRequest);

			updateParentOrderStatusAfterResolution(order);
			ordersRepository.save(order);

			// Notify customer via email with transaction ID
			try {
				boolean wasExchangeFallback = (returnRequest.getRequestType() == ReturnRequestType.EXCHANGE) || (returnRequest.getTargetSize() != null);
				double refundAmt = 0.0;
				if (orderItem != null) {
					int qty = returnRequest.getQuantity() != null ? returnRequest.getQuantity() : orderItem.getQuantity();
					refundAmt = orderItem.getPrice().doubleValue() * qty;
				}
				emailService.sendCustomerRefundCompletedEmail(user.getEmail(), orderNumber, customerName, productName,
						returnRequest.getTransactionId(), wasExchangeFallback, refundAmt);
			} catch (Exception e) {
				// Ignore email failure
				e.printStackTrace();
			}

		} else if ("EXCHANGE".equalsIgnoreCase(action.trim())) {
			if (trackingNumber == null || trackingNumber.trim().isEmpty()) {
				throw new InvalidOrderStateException("Courier Tracking ID is required to resolve an exchange request.");
			}
			String trimmedTracking = trackingNumber.trim();
			if (ordersRepository.existsByTrackingNumber(trimmedTracking)) {
				throw new InvalidOrderStateException("Courier Tracking ID '" + trimmedTracking + "' is already assigned to another order.");
			}
			if (orderItem == null) {
				throw new ResourceNotFoundException("Original order item not found");
			}



			// Exchanges: Admin sends a replacement size
			returnRequest.setStatus(ReturnStatus.EXCHANGE_COMPLETED);
			returnRequest.setResolvedAt(LocalDateTime.now());
			orderReturnRepository.save(returnRequest);

			updateParentOrderStatusAfterResolution(order);
			ordersRepository.save(order);

			// Generate linked exchange order with $0.00 price
			generateExchangeOrder(returnRequest, trimmedTracking);

			// Notify customer via email
			try {
				emailService.sendCustomerExchangeCompletedEmail(user.getEmail(), orderNumber, customerName, productName,
						returnRequest.getTargetSize(), trimmedTracking);
			} catch (Exception e) {
				// Ignore email failure
				e.printStackTrace();
			}

		} else {
			throw new IllegalArgumentException("Invalid resolution action. Must be REFUND or EXCHANGE.");
		}

		return new ResponseMsgDto(200, "Return request resolved successfully via " + action + ".");
	}

	private void generateExchangeOrder(OrderReturn returnRequest, String trackingNumber) {
		Orders originalOrder = returnRequest.getOrder();
		OrderItem originalItem = orderItemRepository.findById(returnRequest.getOrderItemId())
				.orElseThrow(() -> new ResourceNotFoundException("Original order item not found"));

		// Create the free exchange order
		Orders exchangeOrder = new Orders();
		exchangeOrder.setUser(originalOrder.getUser());
		exchangeOrder.setAddress(originalOrder.getAddress());
		exchangeOrder.setPhoneNumber(originalOrder.getPhoneNumber());
		exchangeOrder.setTotalAmount(BigDecimal.ZERO);
		exchangeOrder.setDiscount(BigDecimal.ZERO);
		exchangeOrder.setTax(BigDecimal.ZERO);
		LocalDateTime now = LocalDateTime.now();
		exchangeOrder.setOrderTimestamp(now);
		exchangeOrder.setProcessingTimestamp(now);
		exchangeOrder.setShippedTimestamp(now);
		exchangeOrder.setDeliveredTimestamp(now);
		exchangeOrder.setPaymentStatus(PaymentStatus.SUCCESS); // Pre-paid via exchange approval
		exchangeOrder.setDeliveryStatus(DeliveryStatus.DELIVERED); // Marked as DELIVERED automatically upon exchange completion
		exchangeOrder.setDeliveryMethod("EXCHANGE");
		exchangeOrder.setShippingFee(BigDecimal.ZERO);
		exchangeOrder.setTrackingNumber(trackingNumber);

		Orders savedExchange = ordersRepository.save(exchangeOrder);

		// Find the variant size representing the target exchange size
		ProductVariant variant;
		if (returnRequest.getTargetVariantId() != null) {
			variant = productVariantRepository.findById(returnRequest.getTargetVariantId())
					.orElseThrow(() -> new ResourceNotFoundException(
							"Target product variant not found with id: " + returnRequest.getTargetVariantId()));
		} else {
			variant = originalItem.getProductVariantSize().getProductVariant();
		}

		ProductVariantSize targetSizeEntity = variant.getProductVariantSizes().stream()
				.filter(s -> s.getSizeName().equalsIgnoreCase(returnRequest.getTargetSize())).findFirst()
				.orElseThrow(() -> new ResourceNotFoundException("Replacement size '" + returnRequest.getTargetSize()
						+ "' not found for this product variant."));

		// Save the exchange order item
		OrderItem exchangeItem = new OrderItem();
		exchangeItem.setOrder(savedExchange);
		exchangeItem.setProductVariantSize(targetSizeEntity);
		int exchangeQty = returnRequest.getQuantity() != null ? returnRequest.getQuantity() : originalItem.getQuantity();
		exchangeItem.setQuantity(exchangeQty);
		exchangeItem.setPrice(BigDecimal.ZERO);
		exchangeItem.setSubTotal(BigDecimal.ZERO);

		orderItemRepository.save(exchangeItem);
	}

	private AdminReturnResponseDto mapToAdminDto(OrderReturn r) {
		Orders order = r.getOrder();
		String orderNumber = "#DD-" + order.getId();

		String customerName = "";
		String customerEmail = "";
		Address address = order.getAddress();
		if (address != null && address.getFirstName() != null && !address.getFirstName().trim().isEmpty()) {
			customerName = ((address.getFirstName() != null ? address.getFirstName() : "") + " "
					+ (address.getLastName() != null ? address.getLastName() : "")).trim();
		} else if (order.getUser() != null) {
			customerName = ((order.getUser().getFirstName() != null ? order.getUser().getFirstName() : "") + " "
					+ (order.getUser().getLastName() != null ? order.getUser().getLastName() : "")).trim();
		}
		if (order.getUser() != null) {
			customerEmail = order.getUser().getEmail();
		}

		String productName = "";
		String productSize = "";
		String productColor = "";
		Double productPrice = 0.0;
		Integer productQuantity = 0;

		OrderItem item = orderItemRepository.findById(r.getOrderItemId()).orElse(null);
		if (item != null) {
			productPrice = item.getPrice().doubleValue();
			productQuantity = item.getQuantity();
			ProductVariantSize pvs = item.getProductVariantSize();
			if (pvs != null) {
				productSize = pvs.getSizeName();
				if (pvs.getProductVariant() != null) {
					productColor = pvs.getProductVariant().getVariantName();
					if (pvs.getProductVariant().getProduct() != null) {
						productName = pvs.getProductVariant().getProduct().getProductName();
					}
				}
			}
		}

		String targetColor = null;
		if (r.getTargetVariantId() != null) {
			ProductVariant targetVariant = productVariantRepository.findById(r.getTargetVariantId()).orElse(null);
			if (targetVariant != null) {
				targetColor = targetVariant.getVariantName();
			}
		}
		if (targetColor == null && r.getRequestType() == ReturnRequestType.EXCHANGE) {
			targetColor = productColor;
		}

		Double priceDifference = 0.0;
		int requestedQty = r.getQuantity() != null ? r.getQuantity() : productQuantity;
		if (r.getRequestType() == ReturnRequestType.EXCHANGE && r.getTargetVariantId() != null && item != null) {
			ProductVariant targetVariant = productVariantRepository.findById(r.getTargetVariantId()).orElse(null);
			if (targetVariant != null) {
				double targetPrice = targetVariant.getPrice().doubleValue();
				double originalPrice = item.getPrice().doubleValue();
				priceDifference = (targetPrice - originalPrice) * requestedQty;
			}
		}

		Double refundAmount = productPrice * requestedQty;

		return new AdminReturnResponseDto(r.getId(), order.getId(), orderNumber, r.getOrderItemId(),
				r.getRequestType() != null ? r.getRequestType().name() : null, r.getCancelReason(),
				r.getDefectImageUrl1(), r.getDefectImageUrl2(), r.getDefectImageUrl3(), r.getTargetSize(),
				r.getTargetVariantId(), r.getStatus() != null ? r.getStatus().name() : null, r.getCreatedAt(),
				r.getResolvedAt(), customerName, customerEmail, productName, productSize, productColor, targetColor, productPrice, productQuantity, requestedQty,
				r.getUpiId(), r.getUpiPhone(), r.getQrCodeImageUrl(), r.getBankAccountName(), r.getBankName(),
				r.getBankIfsc(), r.getBankAccountNumber(), priceDifference, refundAmount);
	}

	private void updateParentOrderStatusAfterResolution(Orders order) {
		// Calculate total quantity of items originally purchased
		int totalPurchased = 0;
		if (order.getOrderItems() != null) {
			for (OrderItem item : order.getOrderItems()) {
				totalPurchased += item.getQuantity();
			}
		}

		// Calculate total quantity of items returned/exchanged in completed return requests
		int totalReturnedOrExchanged = 0;
		List<OrderReturn> completedRequests = orderReturnRepository.findByOrderId(order.getId());
		if (completedRequests != null) {
			for (OrderReturn req : completedRequests) {
				if (req.getStatus() == ReturnStatus.REFUND_COMPLETED || req.getStatus() == ReturnStatus.EXCHANGE_COMPLETED) {
					totalReturnedOrExchanged += (req.getQuantity() != null) ? req.getQuantity() : 0;
				}
			}
		}

		// Perform conditional update
		if (totalReturnedOrExchanged >= totalPurchased) {
			boolean hasRefund = false;
			boolean hasExchange = false;
			for (OrderReturn req : completedRequests) {
				if (req.getStatus() == ReturnStatus.REFUND_COMPLETED) {
					hasRefund = true;
				}
				if (req.getStatus() == ReturnStatus.EXCHANGE_COMPLETED) {
					hasExchange = true;
				}
			}
			if (hasRefund && !hasExchange) {
				order.setDeliveryStatus(DeliveryStatus.RETURN_DELIVERED);
				order.setPaymentStatus(PaymentStatus.REFUNDED);
			} else if (hasExchange && !hasRefund) {
				order.setDeliveryStatus(DeliveryStatus.EXCHANGE_DELIVERED);
			} else {
				order.setDeliveryStatus(DeliveryStatus.RETURN_DELIVERED);
				order.setPaymentStatus(PaymentStatus.REFUNDED);
			}
		} else {
			// Partial Return/Exchange -> Keep parent order as DELIVERED and Payment as SUCCESS
			order.setDeliveryStatus(DeliveryStatus.DELIVERED);
			order.setPaymentStatus(PaymentStatus.SUCCESS);
		}
	}

	@Override
	public ResponseMsgDto handleUnavailabilityChoice(Long returnId, String choice) {
		User user = getCurrentCustomer();
		OrderReturn returnRequest = orderReturnRepository.findById(returnId)
				.orElseThrow(() -> new ResourceNotFoundException("Return request not found"));

		// Validate ownership
		if (!returnRequest.getOrder().getUser().getId().equals(user.getId())) {
			throw new InvalidCredentialsException("Access Denied: You do not own this order.");
		}

		if (returnRequest.getStatus() != ReturnStatus.REPLACEMENT_UNAVAILABLE) {
			throw new InvalidOrderStateException("This return request does not have an unavailable replacement size.");
		}

		String normalizedChoice = choice.toUpperCase().trim();
		Orders order = returnRequest.getOrder();

		if ("REFUND".equals(normalizedChoice)) {
			// Convert to return refund request
			returnRequest.setRequestType(ReturnRequestType.RETURN);
			returnRequest.setStatus(ReturnStatus.APPROVED); // Set to APPROVED so it's ready for admin resolution
			orderReturnRepository.save(returnRequest);

			// Update parent order delivery status to return initiated so logistics can continue
			order.setDeliveryStatus(DeliveryStatus.RETURN_INITIATED);
			ordersRepository.save(order);

			return new ResponseMsgDto(200, "Your choice has been recorded. The exchange request has been converted to a refund request.");

		} else if ("KEEP_ORIGINAL".equals(normalizedChoice)) {
			// Close the return request as satisfied
			returnRequest.setStatus(ReturnStatus.CLOSED_UNAVAILABLE_NO_REFUND);
			returnRequest.setResolvedAt(LocalDateTime.now());
			orderReturnRepository.save(returnRequest);

			// Revert/update the parent order delivery status
			updateParentOrderStatusAfterResolution(order);
			ordersRepository.save(order);

			// Notify customer via email
			try {
				String orderNumber = "#DD-" + order.getId();
				Address address = order.getAddress();
				String customerName = "";
				if (address != null && address.getFirstName() != null && !address.getFirstName().trim().isEmpty()) {
					customerName = ((address.getFirstName() != null ? address.getFirstName() : "") + " "
							+ (address.getLastName() != null ? address.getLastName() : "")).trim();
				} else {
					customerName = ((user.getFirstName() != null ? user.getFirstName() : "") + " "
							+ (user.getLastName() != null ? user.getLastName() : "")).trim();
				}
				
				// Get product details
				OrderItem orderItem = orderItemRepository.findById(returnRequest.getOrderItemId()).orElse(null);
				String productName = "";
				String variantName = "Default";
				String sizeName = "N/A";
				int quantity = returnRequest.getQuantity() != null ? returnRequest.getQuantity() : 1;
				if (orderItem != null) {
					if (orderItem.getProductVariantSize() != null) {
						sizeName = orderItem.getProductVariantSize().getSizeName();
						if (orderItem.getProductVariantSize().getProductVariant() != null) {
							variantName = orderItem.getProductVariantSize().getProductVariant().getVariantName();
							if (orderItem.getProductVariantSize().getProductVariant().getProduct() != null) {
								productName = orderItem.getProductVariantSize().getProductVariant().getProduct().getProductName();
							}
						}
					}
				}
				
				emailService.sendCustomerExchangeUnavailableClosedEmail(
						user.getEmail(), 
						orderNumber, 
						customerName,
						productName,
						variantName,
						sizeName,
						quantity
				);
			} catch (Exception e) {
				e.printStackTrace();
			}

			return new ResponseMsgDto(200, "Your choice has been recorded. The exchange request has been closed and your original items are kept.");
		} else {
			throw new IllegalArgumentException("Invalid choice. Must be REFUND or KEEP_ORIGINAL.");
		}
	}
	private int countWords(String text) {
		if (text == null || text.trim().isEmpty()) {
			return 0;
		}
		return text.trim().split("\\s+").length;
	}
}
