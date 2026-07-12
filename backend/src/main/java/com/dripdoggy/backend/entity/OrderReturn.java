package com.dripdoggy.backend.entity;

import com.dripdoggy.backend.enums.ReturnRequestType;
import com.dripdoggy.backend.enums.ReturnStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "order_returns")
public class OrderReturn {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Orders order;

    @Column(name = "order_item_id", nullable = false)
    private Long orderItemId;

    @Enumerated(EnumType.STRING)
    @Column(name = "request_type", nullable = false)
    private ReturnRequestType requestType; // RETURN or EXCHANGE

    @Column(name = "cancel_reason")
    private String cancelReason;

    @Column(name = "defect_image_url_1")
    private String defectImageUrl1;

    @Column(name = "defect_image_url_2")
    private String defectImageUrl2;

    @Column(name = "defect_image_url_3")
    private String defectImageUrl3;

    @Column(name = "target_size")
    private String targetSize;

    @Column(name = "target_variant_id")
    private Long targetVariantId;

    @Column(name = "quantity")
    private Integer quantity;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ReturnStatus status; // PENDING, APPROVED, REJECTED, RECEIVED, REFUND_COMPLETED, EXCHANGE_COMPLETED

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "upi_id")
    private String upiId;

    @Column(name = "upi_phone")
    private String upiPhone;

    @Column(name = "qr_code_image_url")
    private String qrCodeImageUrl;

    @Column(name = "bank_account_name")
    private String bankAccountName;

    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "bank_ifsc")
    private String bankIfsc;

    @Column(name = "bank_account_number")
    private String bankAccountNumber;

    @Column(name = "refund_proof_image_url")
    private String refundProofImageUrl;

    public OrderReturn() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Orders getOrder() {
        return order;
    }

    public void setOrder(Orders order) {
        this.order = order;
    }

    public Long getOrderItemId() {
        return orderItemId;
    }

    public void setOrderItemId(Long orderItemId) {
        this.orderItemId = orderItemId;
    }

    public ReturnRequestType getRequestType() {
        return requestType;
    }

    public void setRequestType(ReturnRequestType requestType) {
        this.requestType = requestType;
    }

    public String getCancelReason() {
        return cancelReason;
    }

    public void setCancelReason(String cancelReason) {
        this.cancelReason = cancelReason;
    }

    public String getDefectImageUrl1() {
        return defectImageUrl1;
    }

    public void setDefectImageUrl1(String defectImageUrl1) {
        this.defectImageUrl1 = defectImageUrl1;
    }

    public String getDefectImageUrl2() {
        return defectImageUrl2;
    }

    public void setDefectImageUrl2(String defectImageUrl2) {
        this.defectImageUrl2 = defectImageUrl2;
    }

    public String getDefectImageUrl3() {
        return defectImageUrl3;
    }

    public void setDefectImageUrl3(String defectImageUrl3) {
        this.defectImageUrl3 = defectImageUrl3;
    }

    public String getTargetSize() {
        return targetSize;
    }

    public void setTargetSize(String targetSize) {
        this.targetSize = targetSize;
    }

    public ReturnStatus getStatus() {
        return status;
    }

    public void setStatus(ReturnStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public String getUpiId() {
        return upiId;
    }

    public void setUpiId(String upiId) {
        this.upiId = upiId;
    }

    public String getUpiPhone() {
        return upiPhone;
    }

    public void setUpiPhone(String upiPhone) {
        this.upiPhone = upiPhone;
    }

    public String getQrCodeImageUrl() {
        return qrCodeImageUrl;
    }

    public void setQrCodeImageUrl(String qrCodeImageUrl) {
        this.qrCodeImageUrl = qrCodeImageUrl;
    }

    public String getBankAccountName() {
        return bankAccountName;
    }

    public void setBankAccountName(String bankAccountName) {
        this.bankAccountName = bankAccountName;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getBankIfsc() {
        return bankIfsc;
    }

    public void setBankIfsc(String bankIfsc) {
        this.bankIfsc = bankIfsc;
    }

    public String getBankAccountNumber() {
        return bankAccountNumber;
    }

    public void setBankAccountNumber(String bankAccountNumber) {
        this.bankAccountNumber = bankAccountNumber;
    }

    public Long getTargetVariantId() {
        return targetVariantId;
    }

    public void setTargetVariantId(Long targetVariantId) {
        this.targetVariantId = targetVariantId;
    }

    public String getRefundProofImageUrl() {
        return refundProofImageUrl;
    }

    public void setRefundProofImageUrl(String refundProofImageUrl) {
        this.refundProofImageUrl = refundProofImageUrl;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
