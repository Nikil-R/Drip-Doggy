package com.dripdoggy.backend.RequestDto;

import com.dripdoggy.backend.enums.DiscountType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

public class BundleRequestDto {

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Main product variant ID is required")
    private Long mainProductVariantId;

    @NotNull(message = "Discount type is required")
    private DiscountType discountType;

    @NotNull(message = "Discount value is required")
    @DecimalMin(value = "0.00", message = "Discount value cannot be negative")
    private BigDecimal discountValue;

    @NotNull(message = "Product variant list is required")
    private List<Long> productVariantIds;

    private Boolean isActive = true;

    // Constructors
    public BundleRequestDto() {
    }

    public BundleRequestDto(String title, Long mainProductVariantId, DiscountType discountType, BigDecimal discountValue, List<Long> productVariantIds, Boolean isActive) {
        this.title = title;
        this.mainProductVariantId = mainProductVariantId;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.productVariantIds = productVariantIds;
        this.isActive = isActive;
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Long getMainProductVariantId() {
        return mainProductVariantId;
    }

    public void setMainProductVariantId(Long mainProductVariantId) {
        this.mainProductVariantId = mainProductVariantId;
    }

    public DiscountType getDiscountType() {
        return discountType;
    }

    public void setDiscountType(DiscountType discountType) {
        this.discountType = discountType;
    }

    public BigDecimal getDiscountValue() {
        return discountValue;
    }

    public void setDiscountValue(BigDecimal discountValue) {
        this.discountValue = discountValue;
    }

    public List<Long> getProductVariantIds() {
        return productVariantIds;
    }

    public void setProductVariantIds(List<Long> productVariantIds) {
        this.productVariantIds = productVariantIds;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}
