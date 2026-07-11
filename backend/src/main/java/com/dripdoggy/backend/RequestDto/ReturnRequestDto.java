package com.dripdoggy.backend.RequestDto;

import com.dripdoggy.backend.enums.ReturnRequestType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public class ReturnRequestDto {
    @NotNull(message = "Order item ID is required")
    private Long orderItemId;

    @NotNull(message = "Request type is required")
    private ReturnRequestType requestType; // RETURN or EXCHANGE

    @NotBlank(message = "Reason is required")
    private String cancelReason;

    private String targetSize;

    private List<MultipartFile> images;

    // Refund Method fields
    private String upiId;
    private String upiPhone;
    private MultipartFile qrCodeImage;

    private String bankAccountName;
    private String bankName;
    private String bankIfsc;
    private String bankAccountNumber;

    public ReturnRequestDto() {
    }

    public ReturnRequestDto(Long orderItemId, ReturnRequestType requestType, String cancelReason, String targetSize, String upiId, String upiPhone, MultipartFile qrCodeImage, String bankAccountName, String bankName, String bankIfsc, String bankAccountNumber) {
        this.orderItemId = orderItemId;
        this.requestType = requestType;
        this.cancelReason = cancelReason;
        this.targetSize = targetSize;
        this.upiId = upiId;
        this.upiPhone = upiPhone;
        this.qrCodeImage = qrCodeImage;
        this.bankAccountName = bankAccountName;
        this.bankName = bankName;
        this.bankIfsc = bankIfsc;
        this.bankAccountNumber = bankAccountNumber;
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

    public String getTargetSize() {
        return targetSize;
    }

    public void setTargetSize(String targetSize) {
        this.targetSize = targetSize;
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
}
