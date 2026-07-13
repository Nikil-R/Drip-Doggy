package com.dripdoggy.backend.ResponseDto;

import java.util.List;

public class ReviewResponseDto {
    private Long id;
    private String comment;
    private Integer rating;
    private Boolean isActive;
    private Long userId;
    private String customerName;
    private Long productVariantId;
    private String productVariantName;
    private String productName;
    private List<String> imageUrls;
    private Boolean isVerifiedPurchase;

    public ReviewResponseDto() {
    }

    public ReviewResponseDto(Long id, String comment, Integer rating, Boolean isActive, Long userId, String customerName, Long productVariantId, String productVariantName, String productName) {
        this.id = id;
        this.comment = comment;
        this.rating = rating;
        this.isActive = isActive;
        this.userId = userId;
        this.customerName = customerName;
        this.productVariantId = productVariantId;
        this.productVariantName = productVariantName;
        this.productName = productName;
    }

    public ReviewResponseDto(Long id, String comment, Integer rating, Boolean isActive, Long userId, String customerName, Long productVariantId, String productVariantName, String productName, List<String> imageUrls, Boolean isVerifiedPurchase) {
        this.id = id;
        this.comment = comment;
        this.rating = rating;
        this.isActive = isActive;
        this.userId = userId;
        this.customerName = customerName;
        this.productVariantId = productVariantId;
        this.productVariantName = productVariantName;
        this.productName = productName;
        this.imageUrls = imageUrls;
        this.isVerifiedPurchase = isVerifiedPurchase;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Long getProductVariantId() {
        return productVariantId;
    }

    public void setProductVariantId(Long productVariantId) {
        this.productVariantId = productVariantId;
    }

    public String getProductVariantName() {
        return productVariantName;
    }

    public void setProductVariantName(String productVariantName) {
        this.productVariantName = productVariantName;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public Boolean getIsVerifiedPurchase() {
        return isVerifiedPurchase;
    }

    public void setIsVerifiedPurchase(Boolean isVerifiedPurchase) {
        this.isVerifiedPurchase = isVerifiedPurchase;
    }
}
