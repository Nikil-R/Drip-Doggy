package com.dripdoggy.backend.serviceImpl;

import com.dripdoggy.backend.Iservice.IReviewService;
import com.dripdoggy.backend.RequestDto.ReviewRequestDto;
import com.dripdoggy.backend.ResponseDto.ReviewResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.entity.*;
import com.dripdoggy.backend.enums.UserRole;
import com.dripdoggy.backend.exception.*;
import com.dripdoggy.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReviewService implements IReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final OrdersRepository ordersRepository;
    private final ProductVariantRepository productVariantRepository;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository, UserRepository userRepository,
                         OrdersRepository ordersRepository, ProductVariantRepository productVariantRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.ordersRepository = ordersRepository;
        this.productVariantRepository = productVariantRepository;
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
    public ReviewResponseDto createReview(ReviewRequestDto dto) {
        User user = getCurrentCustomer();
        
        Orders order = ordersRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + dto.getOrderId()));

        // Validate order ownership
        if (!order.getUser().getId().equals(user.getId())) {
            throw new ReviewNotAllowedException("Access Denied: You do not own this order.");
        }

        ProductVariant variant = productVariantRepository.findById(dto.getProductVariantId())
                .orElseThrow(() -> new ProductVariantNotFoundException("Product variant not found with id: " + dto.getProductVariantId()));

        // Validate that this specific variant was ordered in this order
        boolean variantOrdered = false;
        if (order.getOrderItems() != null) {
            for (OrderItem item : order.getOrderItems()) {
                ProductVariantSize size = item.getProductVariantSize();
                if (size != null && size.getProductVariant() != null &&
                    size.getProductVariant().getId().equals(variant.getId())) {
                    variantOrdered = true;
                    break;
                }
            }
        }

        if (!variantOrdered) {
            throw new ReviewNotAllowedException("You can only review product variants that you have ordered.");
        }

        // Prevent duplicate reviews for the same order and variant
        boolean alreadyReviewed = reviewRepository.existsByUserIdAndOrderIdAndProductVariantId(
                user.getId(), order.getId(), variant.getId());
        if (alreadyReviewed) {
            throw new DuplicateReviewException("You have already reviewed this product variant for this order.");
        }

        Review review = new Review();
        review.setComment(dto.getComment());
        review.setIsActive(true); // Active by default
        review.setUser(user);
        review.setOrder(order);
        review.setProductVariant(variant);

        Review savedReview = reviewRepository.save(review);
        return mapToDto(savedReview);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponseDto> getCustomerReviews() {
        User user = getCurrentCustomer();
        List<Review> reviews = reviewRepository.findByUserId(user.getId());
        return reviews.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewResponseDto getCustomerReviewById(Long id) {
        User user = getCurrentCustomer();
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ReviewNotFoundException("Review not found with id: " + id));

        // Validate ownership
        if (!review.getUser().getId().equals(user.getId())) {
            throw new ReviewNotAllowedException("Access Denied: You do not own this review.");
        }

        return mapToDto(review);
    }

    @Override
    public ReviewResponseDto updateReview(Long id, String comment) {
        User user = getCurrentCustomer();
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ReviewNotFoundException("Review not found with id: " + id));

        // Validate ownership
        if (!review.getUser().getId().equals(user.getId())) {
            throw new ReviewNotAllowedException("Access Denied: You do not own this review.");
        }

        review.setComment(comment);
        Review updatedReview = reviewRepository.save(review);
        return mapToDto(updatedReview);
    }

    @Override
    public ResponseMsgDto deleteReview(Long id) {
        User user = getCurrentCustomer();
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ReviewNotFoundException("Review not found with id: " + id));

        // Validate ownership
        if (!review.getUser().getId().equals(user.getId())) {
            throw new ReviewNotAllowedException("Access Denied: You do not own this review.");
        }

        reviewRepository.delete(review);
        return new ResponseMsgDto(200, "Review deleted successfully.");
    }

    // Admin Operations
    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponseDto> getAllReviews() {
        return reviewRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public ReviewResponseDto toggleReviewActiveStatus(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ReviewNotFoundException("Review not found with id: " + id));

        review.setIsActive(review.getIsActive() == null || !review.getIsActive());
        Review updated = reviewRepository.save(review);
        return mapToDto(updated);
    }

    @Override
    public ResponseMsgDto adminDeleteReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ReviewNotFoundException("Review not found with id: " + id));

        reviewRepository.delete(review);
        return new ResponseMsgDto(200, "Review deleted by admin successfully.");
    }

    private ReviewResponseDto mapToDto(Review review) {
        Long userId = review.getUser() != null ? review.getUser().getId() : null;
        String customerName = "";
        if (review.getUser() != null) {
            customerName = ((review.getUser().getFirstName() != null ? review.getUser().getFirstName() : "") + " " +
                           (review.getUser().getLastName() != null ? review.getUser().getLastName() : "")).trim();
        }
        Long orderId = review.getOrder() != null ? review.getOrder().getId() : null;
        String orderNumber = review.getOrder() != null ? "#DD-" + review.getOrder().getId() : "";
        Long productVariantId = review.getProductVariant() != null ? review.getProductVariant().getId() : null;
        String productVariantName = review.getProductVariant() != null ? review.getProductVariant().getVariantName() : "";
        String productName = "";
        if (review.getProductVariant() != null && review.getProductVariant().getProduct() != null) {
            productName = review.getProductVariant().getProduct().getProductName();
        }

        return new ReviewResponseDto(
                review.getId(),
                review.getComment(),
                review.getIsActive(),
                userId,
                customerName,
                orderId,
                orderNumber,
                productVariantId,
                productVariantName,
                productName
        );
    }
}
