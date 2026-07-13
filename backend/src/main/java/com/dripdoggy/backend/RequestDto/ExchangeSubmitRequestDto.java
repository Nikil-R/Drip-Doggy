package com.dripdoggy.backend.RequestDto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public class ExchangeSubmitRequestDto {
    @NotNull(message = "Order item ID is required")
    private Long orderItemId;

    @NotBlank(message = "Exchange reason is required")
    private String exchangeReason;

    @NotBlank(message = "Target size is required")
    private String targetSize;

    private Long targetVariantId; // Optional: specify if requesting a different color/variant

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    private List<MultipartFile> images;

    // Refund details (in case target variant is cheaper than original variant)
    private String upiId;
    private String upiPhone;
    private MultipartFile qrCodeImage;

    private String bankAccountName;
    private String bankName;
    private String bankIfsc;
    private String bankAccountNumber;

    public ExchangeSubmitRequestDto() {
    }

    public ExchangeSubmitRequestDto(Long orderItemId, String exchangeReason, String targetSize, Long targetVariantId, Integer quantity, List<MultipartFile> images, String upiId, String upiPhone, MultipartFile qrCodeImage, String bankAccountName, String bankName, String bankIfsc, String bankAccountNumber) {
        this.orderItemId = orderItemId;
        this.exchangeReason = exchangeReason;
        this.targetSize = targetSize;
        this.targetVariantId = targetVariantId;
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

    public ExchangeSubmitRequestDto(Long orderItemId, String exchangeReason, String targetSize, Long targetVariantId, List<MultipartFile> images, String upiId, String upiPhone, MultipartFile qrCodeImage, String bankAccountName, String bankName, String bankIfsc, String bankAccountNumber) {
        this(orderItemId, exchangeReason, targetSize, targetVariantId, null, images, upiId, upiPhone, qrCodeImage, bankAccountName, bankName, bankIfsc, bankAccountNumber);
    }

    public Long getOrderItemId() {
        return orderItemId;
    }

    public void setOrderItemId(Long orderItemId) {
        this.orderItemId = orderItemId;
    }

    public String getExchangeReason() {
        return exchangeReason;
    }

    public void setExchangeReason(String exchangeReason) {
        this.exchangeReason = exchangeReason;
    }

    public String getTargetSize() {
        return targetSize;
    }

    public void setTargetSize(String targetSize) {
        this.targetSize = targetSize;
    }

    public Long getTargetVariantId() {
        return targetVariantId;
    }

    public void setTargetVariantId(Long targetVariantId) {
        this.targetVariantId = targetVariantId;
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
