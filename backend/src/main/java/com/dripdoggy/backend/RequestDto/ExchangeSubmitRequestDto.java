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

    public ExchangeSubmitRequestDto() {
    }

    public ExchangeSubmitRequestDto(Long orderItemId, String exchangeReason, String targetSize, Long targetVariantId, Integer quantity, List<MultipartFile> images) {
        this.orderItemId = orderItemId;
        this.exchangeReason = exchangeReason;
        this.targetSize = targetSize;
        this.targetVariantId = targetVariantId;
        this.quantity = quantity;
        this.images = images;
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

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
