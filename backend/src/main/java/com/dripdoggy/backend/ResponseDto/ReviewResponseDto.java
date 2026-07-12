package com.dripdoggy.backend.ResponseDto;

public class ReviewResponseDto {
    private Long id;
    private String comment;
    private Boolean isActive;
    private Long userId;
    private String customerName;
    private Long orderId;
    private String orderNumber;
    private Long productVariantId;
    private String productVariantName;
    private String productName;

    public ReviewResponseDto() {
    }

    public ReviewResponseDto(Long id, String comment, Boolean isActive, Long userId, String customerName, Long orderId, String orderNumber, Long productVariantId, String productVariantName, String productName) {
        this.id = id;
        this.comment = comment;
        this.isActive = isActive;
        this.userId = userId;
        this.customerName = customerName;
        this.orderId = orderId;
        this.orderNumber = orderNumber;
        this.productVariantId = productVariantId;
        this.productVariantName = productVariantName;
        this.productName = productName;
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

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
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
}
