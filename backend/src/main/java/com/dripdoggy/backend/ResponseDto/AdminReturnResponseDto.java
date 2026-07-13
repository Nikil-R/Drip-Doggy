package com.dripdoggy.backend.ResponseDto;

import java.time.LocalDateTime;

public class AdminReturnResponseDto {
    private Long id;
    private Long orderId;
    private String orderNumber;
    private Long orderItemId;
    private String requestType;
    private String cancelReason;
    private String defectImageUrl1;
    private String defectImageUrl2;
    private String defectImageUrl3;
    private String targetSize;
    private Long targetVariantId; // Added for color/style swap tracking
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;

    private String customerName;
    private String customerEmail;
    private String productName;
    private String productSize;
    private Double productPrice;
    private Integer productQuantity;
    private Integer requestedQuantity;

    // Refund details
    private String upiId;
    private String upiPhone;
    private String qrCodeImageUrl;
    private String bankAccountName;
    private String bankName;
    private String bankIfsc;
    private String bankAccountNumber;
    private Double priceDifference;
    private Double refundAmount;

    public AdminReturnResponseDto() {
    }

    public AdminReturnResponseDto(Long id, Long orderId, String orderNumber, Long orderItemId, String requestType, String cancelReason, String defectImageUrl1, String defectImageUrl2, String defectImageUrl3, String targetSize, Long targetVariantId, String status, LocalDateTime createdAt, LocalDateTime resolvedAt, String customerName, String customerEmail, String productName, String productSize, Double productPrice, Integer productQuantity, Integer requestedQuantity, String upiId, String upiPhone, String qrCodeImageUrl, String bankAccountName, String bankName, String bankIfsc, String bankAccountNumber, Double priceDifference, Double refundAmount) {
        this.id = id;
        this.orderId = orderId;
        this.orderNumber = orderNumber;
        this.orderItemId = orderItemId;
        this.requestType = requestType;
        this.cancelReason = cancelReason;
        this.defectImageUrl1 = defectImageUrl1;
        this.defectImageUrl2 = defectImageUrl2;
        this.defectImageUrl3 = defectImageUrl3;
        this.targetSize = targetSize;
        this.targetVariantId = targetVariantId;
        this.status = status;
        this.createdAt = createdAt;
        this.resolvedAt = resolvedAt;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.productName = productName;
        this.productSize = productSize;
        this.productPrice = productPrice;
        this.productQuantity = productQuantity;
        this.requestedQuantity = requestedQuantity;
        this.upiId = upiId;
        this.upiPhone = upiPhone;
        this.qrCodeImageUrl = qrCodeImageUrl;
        this.bankAccountName = bankAccountName;
        this.bankName = bankName;
        this.bankIfsc = bankIfsc;
        this.bankAccountNumber = bankAccountNumber;
        this.priceDifference = priceDifference;
        this.refundAmount = refundAmount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
    public Long getOrderItemId() { return orderItemId; }
    public void setOrderItemId(Long orderItemId) { this.orderItemId = orderItemId; }
    public String getRequestType() { return requestType; }
    public void setRequestType(String requestType) { this.requestType = requestType; }
    public String getCancelReason() { return cancelReason; }
    public void setCancelReason(String cancelReason) { this.cancelReason = cancelReason; }
    public String getDefectImageUrl1() { return defectImageUrl1; }
    public void setDefectImageUrl1(String defectImageUrl1) { this.defectImageUrl1 = defectImageUrl1; }
    public String getDefectImageUrl2() { return defectImageUrl2; }
    public void setDefectImageUrl2(String defectImageUrl2) { this.defectImageUrl2 = defectImageUrl2; }
    public String getDefectImageUrl3() { return defectImageUrl3; }
    public void setDefectImageUrl3(String defectImageUrl3) { this.defectImageUrl3 = defectImageUrl3; }
    public String getTargetSize() { return targetSize; }
    public void setTargetSize(String targetSize) { this.targetSize = targetSize; }
    public Long getTargetVariantId() { return targetVariantId; }
    public void setTargetVariantId(Long targetVariantId) { this.targetVariantId = targetVariantId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getProductSize() { return productSize; }
    public void setProductSize(String productSize) { this.productSize = productSize; }
    public Double getProductPrice() { return productPrice; }
    public void setProductPrice(Double productPrice) { this.productPrice = productPrice; }
    public Integer getProductQuantity() { return productQuantity; }
    public void setProductQuantity(Integer productQuantity) { this.productQuantity = productQuantity; }
    public Integer getRequestedQuantity() { return requestedQuantity; }
    public void setRequestedQuantity(Integer requestedQuantity) { this.requestedQuantity = requestedQuantity; }

    public String getUpiId() { return upiId; }
    public void setUpiId(String upiId) { this.upiId = upiId; }
    public String getUpiPhone() { return upiPhone; }
    public void setUpiPhone(String upiPhone) { this.upiPhone = upiPhone; }
    public String getQrCodeImageUrl() { return qrCodeImageUrl; }
    public void setQrCodeImageUrl(String qrCodeImageUrl) { this.qrCodeImageUrl = qrCodeImageUrl; }
    public String getBankAccountName() { return bankAccountName; }
    public void setBankAccountName(String bankAccountName) { this.bankAccountName = bankAccountName; }
    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }
    public String getBankIfsc() { return bankIfsc; }
    public void setBankIfsc(String bankIfsc) { this.bankIfsc = bankIfsc; }
    public String getBankAccountNumber() { return bankAccountNumber; }
    public void setBankAccountNumber(String bankAccountNumber) { this.bankAccountNumber = bankAccountNumber; }
    public Double getPriceDifference() { return priceDifference; }
    public void setPriceDifference(Double priceDifference) { this.priceDifference = priceDifference; }
    public Double getRefundAmount() { return refundAmount; }
    public void setRefundAmount(Double refundAmount) { this.refundAmount = refundAmount; }
}
