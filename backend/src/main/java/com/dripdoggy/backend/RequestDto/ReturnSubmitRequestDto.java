package com.dripdoggy.backend.RequestDto;

import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public class ReturnSubmitRequestDto {
    @NotNull(message = "Order item ID is required")
    private Long orderItemId;

    @NotNull(message = "Reason is required")
    private String cancelReason;

    private Integer quantity; // Optional: defaults to original quantity if not provided

    private List<MultipartFile> images;

    // Refund details
    private String upiId;
    private String upiPhone;
    private MultipartFile qrCodeImage;

    private String bankAccountName;
    private String bankName;
    private String bankIfsc;
    private String bankAccountNumber;

    public ReturnSubmitRequestDto() {
    }

    public ReturnSubmitRequestDto(Long orderItemId, String cancelReason, Integer quantity, List<MultipartFile> images, String upiId, String upiPhone, MultipartFile qrCodeImage, String bankAccountName, String bankName, String bankIfsc, String bankAccountNumber) {
        this.orderItemId = orderItemId;
        this.cancelReason = cancelReason;
        this.quantity = quantity;
        this.images = images;
        this.upiId = upiId;
        this.upiPhone = upiPhone;
        this.qrCodeImage = qrCodeImage;
        this.bankAccountName = bankAccountName;
        this.bankName = bankName;
        this.bankIfsc = bankIfsc;
        this.bankAccountNumber = bankAccountNumber;
    }

    public ReturnSubmitRequestDto(Long orderItemId, String cancelReason, List<MultipartFile> images, String upiId, String upiPhone, MultipartFile qrCodeImage, String bankAccountName, String bankName, String bankIfsc, String bankAccountNumber) {
        this(orderItemId, cancelReason, null, images, upiId, upiPhone, qrCodeImage, bankAccountName, bankName, bankIfsc, bankAccountNumber);
    }

    public Long getOrderItemId() {
        return orderItemId;
    }

    public void setOrderItemId(Long orderItemId) {
        this.orderItemId = orderItemId;
    }

    public String getCancelReason() {
        return cancelReason;
    }

    public void setCancelReason(String cancelReason) {
        this.cancelReason = cancelReason;
    }

    public List<MultipartFile> getImages() {
        return images;
    }

    public void setImages(List<MultipartFile> images) {
        this.images = images;
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

    public MultipartFile getQrCodeImage() {
        return qrCodeImage;
    }

    public void setQrCodeImage(MultipartFile qrCodeImage) {
        this.qrCodeImage = qrCodeImage;
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

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
