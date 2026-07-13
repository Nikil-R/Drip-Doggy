package com.dripdoggy.backend.RequestDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public class ReviewRequestDto {

    @NotNull(message = "Order ID is required.")
    private Long orderId;

    @NotNull(message = "Product Variant ID is required.")
    private Long productVariantId;

    @NotBlank(message = "Comment is required.")
    @Size(max = 250, message = "Comment cannot exceed 250 characters.")
    private String comment;

    @NotNull(message = "Rating is required.")
    @Min(value = 1, message = "Rating must be at least 1 star.")
    @Max(value = 5, message = "Rating cannot exceed 5 stars.")
    private Integer rating;

    private List<MultipartFile> images;

    public ReviewRequestDto() {
    }

    public ReviewRequestDto(Long orderId, Long productVariantId, String comment, Integer rating) {
        this.orderId = orderId;
        this.productVariantId = productVariantId;
        this.comment = comment;
        this.rating = rating;
    }

    public ReviewRequestDto(Long orderId, Long productVariantId, String comment, Integer rating, List<MultipartFile> images) {
        this.orderId = orderId;
        this.productVariantId = productVariantId;
        this.comment = comment;
        this.rating = rating;
        this.images = images;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getProductVariantId() {
        return productVariantId;
    }

    public void setProductVariantId(Long productVariantId) {
        this.productVariantId = productVariantId;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public List<MultipartFile> getImages() {
        return images;
    }

    public void setImages(List<MultipartFile> images) {
        this.images = images;
    }
}
