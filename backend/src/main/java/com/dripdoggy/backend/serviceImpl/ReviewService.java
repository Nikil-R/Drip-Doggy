package com.dripdoggy.backend.serviceImpl;

import com.dripdoggy.backend.Iservice.IReviewService;
import com.dripdoggy.backend.RequestDto.ReviewRequestDto;
import com.dripdoggy.backend.RequestDto.ReviewUpdateRequestDto;
import com.dripdoggy.backend.ResponseDto.ReviewResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.entity.*;
import com.dripdoggy.backend.enums.UserRole;
import com.dripdoggy.backend.exception.*;
import com.dripdoggy.backend.repository.*;
import com.dripdoggy.backend.Configuration.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReviewService implements IReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final OrdersRepository ordersRepository;
    private final ProductVariantRepository productVariantRepository;
    private final S3Service s3Service;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository, UserRepository userRepository,
                         OrdersRepository ordersRepository, ProductVariantRepository productVariantRepository,
                         S3Service s3Service) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.ordersRepository = ordersRepository;
        this.productVariantRepository = productVariantRepository;
        this.s3Service = s3Service;
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

        // Validate that order is not cancelled
        if (order.getDeliveryStatus() == com.dripdoggy.backend.enums.DeliveryStatus.CANCELLED) {
            throw new ProductNotPurchasedException("You didn't purchase this product, so you are not allowed to give a review.");
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
            throw new ProductNotPurchasedException("You didn't purchase this product, so you are not allowed to give a review.");
        }

        // Prevent duplicate reviews for the same order and variant
        boolean alreadyReviewed = reviewRepository.existsByUserIdAndOrderIdAndProductVariantId(
                user.getId(), order.getId(), variant.getId());
        if (alreadyReviewed) {
            throw new DuplicateReviewException("You have already reviewed this product variant for this order.");
        }

        // Validate review images count
        List<MultipartFile> activeImages = new ArrayList<>();
        if (dto.getImages() != null) {
            for (MultipartFile file : dto.getImages()) {
                if (file != null && !file.isEmpty()) {
                    activeImages.add(file);
                }
            }
        }

        if (activeImages.size() > 3) {
            throw new ReviewImageLimitExceededException("You can upload at most 3 images for a review.");
        }

        Review review = new Review();
        review.setComment(dto.getComment());
        review.setIsActive(true); // Active by default
        review.setUser(user);
        review.setOrder(order);
        review.setProductVariant(variant);

        // Upload review images to S3
        if (!activeImages.isEmpty()) {
            for (MultipartFile imgFile : activeImages) {
                try {
                    String url = s3Service.uploadFile(imgFile);
                    Image image = new Image();
                    image.setImageUrl(url);
                    image.setIsActive(true);
                    image.setReview(review);
                    review.getImages().add(image);
                } catch (IOException e) {
                    throw new FailedToUploadImageException("Failed to upload review image to S3: " + e.getMessage());
                }
            }
        }

        Review savedReview = reviewRepository.save(review);
        return mapToDto(savedReview);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponseDto> getCustomerReviews() {
        User user = getCurrentCustomer();
        List<Review> reviews = reviewRepository.findByUserIdAndIsActiveTrue(user.getId());
        return reviews.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewResponseDto getCustomerReviewById(Long id) {
        User user = getCurrentCustomer();
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ReviewNotFoundException("Review not found"));

        // Validate active status
        if (review.getIsActive() == null || !review.getIsActive()) {
            throw new ReviewNotFoundException("Review not found");
        }

        // Validate ownership
        if (!review.getUser().getId().equals(user.getId())) {
            throw new ReviewNotAllowedException("Access Denied: You do not own this review.");
        }

        return mapToDto(review);
    }

    @Override
    public ReviewResponseDto updateReview(Long id, ReviewUpdateRequestDto dto) {
        User user = getCurrentCustomer();
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ReviewNotFoundException("Review not found for"+ user.getFirstName()));

        // Validate ownership
        if (!review.getUser().getId().equals(user.getId())) {
            throw new ReviewNotAllowedException("Access Denied: You do not own this review.");
        }

        review.setComment(dto.getComment());

        // Handle optional image updates
        if (dto.getImages() != null) {
            List<MultipartFile> activeImages = new ArrayList<>();
            for (MultipartFile file : dto.getImages()) {
                if (file != null && !file.isEmpty()) {
                    activeImages.add(file);
                }
            }

            if (activeImages.size() > 3) {
                throw new ReviewImageLimitExceededException("You can upload at most 3 images for a review.");
            }

            // If new images are uploaded, replace the old ones
            if (!activeImages.isEmpty()) {
                review.getImages().clear(); // orphanRemoval = true will delete them from DB
                for (MultipartFile imgFile : activeImages) {
                    try {
                        String url = s3Service.uploadFile(imgFile);
                        Image image = new Image();
                        image.setImageUrl(url);
                        image.setIsActive(true);
                        image.setReview(review);
                        review.getImages().add(image);
                    } catch (IOException e) {
                        throw new FailedToUploadImageException("Failed to upload review image to S3: " + e.getMessage());
                    }
                }
            }
        }

        Review updatedReview = reviewRepository.save(review);
        return mapToDto(updatedReview);
    }

    @Override
    public ResponseMsgDto deleteReview(Long id) {
        User user = getCurrentCustomer();
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ReviewNotFoundException("Review not found for"+ user.getFirstName()));

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
    public ResponseMsgDto toggleReviewActiveStatus(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ReviewNotFoundException("Review not found"));

        review.setIsActive(review.getIsActive() == null || !review.getIsActive());
        reviewRepository.save(review);
        String status = review.getIsActive() ? "active" : "inactive";
        return new ResponseMsgDto(200, "Review status updated to " + status + " successfully.");
    }

    @Override
    public ResponseMsgDto adminDeleteReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ReviewNotFoundException("Review not found"));

        reviewRepository.delete(review);
        return new ResponseMsgDto(200, "Review deleted by admin successfully.");
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponseDto> getActiveReviewsForProduct(Long productId) {
        List<Review> reviews = reviewRepository.findByProductVariantProductIdAndIsActiveTrue(productId);
        return reviews.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponseDto> getActiveReviewsForVariant(Long variantId) {
        List<Review> reviews = reviewRepository.findByProductVariantIdAndIsActiveTrue(variantId);
        return reviews.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private ReviewResponseDto mapToDto(Review review) {
        Long userId = review.getUser() != null ? review.getUser().getId() : null;
        String customerName = "";
        if (review.getUser() != null) {
            customerName = ((review.getUser().getFirstName() != null ? review.getUser().getFirstName() : "") + " " +
                           (review.getUser().getLastName() != null ? review.getUser().getLastName() : "")).trim();
        }
        Long productVariantId = review.getProductVariant() != null ? review.getProductVariant().getId() : null;
        String productVariantName = review.getProductVariant() != null ? review.getProductVariant().getVariantName() : "";
        String productName = "";
        if (review.getProductVariant() != null && review.getProductVariant().getProduct() != null) {
            productName = review.getProductVariant().getProduct().getProductName();
        }

        List<String> imageUrls = new ArrayList<>();
        if (review.getImages() != null) {
            for (Image img : review.getImages()) {
                if (img.getImageUrl() != null) {
                    imageUrls.add(img.getImageUrl());
                }
            }
        }

        Boolean isVerifiedPurchase = review.getOrder() != null;

        return new ReviewResponseDto(
                review.getId(),
                review.getComment(),
                review.getIsActive(),
                userId,
                customerName,
                productVariantId,
                productVariantName,
                productName,
                imageUrls,
                isVerifiedPurchase
        );
    }
}
