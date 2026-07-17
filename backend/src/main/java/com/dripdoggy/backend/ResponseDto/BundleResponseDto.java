package com.dripdoggy.backend.ResponseDto;

import com.dripdoggy.backend.enums.DiscountType;
import java.math.BigDecimal;
import java.util.List;

public class BundleResponseDto {

    private Long id;
    private String title;
    private Long mainProductVariantId;
    private DiscountType discountType;
    private BigDecimal discountValue;
    private BigDecimal originalTotal;
    private BigDecimal bundlePrice;
    private Boolean isActive;
    private List<BundleVariantResponseDto> variants;

    public BundleResponseDto() {
    }

    public BundleResponseDto(Long id, String title, Long mainProductVariantId, DiscountType discountType, BigDecimal discountValue, BigDecimal originalTotal, BigDecimal bundlePrice, Boolean isActive, List<BundleVariantResponseDto> variants) {
        this.id = id;
        this.title = title;
        this.mainProductVariantId = mainProductVariantId;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.originalTotal = originalTotal;
        this.bundlePrice = bundlePrice;
        this.isActive = isActive;
        this.variants = variants;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public BigDecimal getOriginalTotal() {
        return originalTotal;
    }

    public void setOriginalTotal(BigDecimal originalTotal) {
        this.originalTotal = originalTotal;
    }

    public BigDecimal getBundlePrice() {
        return bundlePrice;
    }

    public void setBundlePrice(BigDecimal bundlePrice) {
        this.bundlePrice = bundlePrice;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public List<BundleVariantResponseDto> getVariants() {
        return variants;
    }

    public void setVariants(List<BundleVariantResponseDto> variants) {
        this.variants = variants;
    }
}
