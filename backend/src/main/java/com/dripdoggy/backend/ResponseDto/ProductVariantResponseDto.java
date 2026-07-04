package com.dripdoggy.backend.ResponseDto;

import com.dripdoggy.backend.enums.DiscountType;
import java.math.BigDecimal;
import java.util.List;

public class ProductVariantResponseDto {
    private Long id;
    private String variantName;
    private String skuCode;
    private BigDecimal mrp;
    private BigDecimal price; // Computed price
    private DiscountType discountType;
    private BigDecimal discountValue;
    private Boolean isActive;
    private List<String> imageUrls;
    private List<ProductVariantSizeResponseDto> sizes;
    private String primaryImageUrl;

    // Constructors
    public ProductVariantResponseDto() {
    }

    public ProductVariantResponseDto(Long id, String variantName, String skuCode, BigDecimal mrp, BigDecimal price, DiscountType discountType, BigDecimal discountValue, Boolean isActive, List<String> imageUrls, List<ProductVariantSizeResponseDto> sizes) {
        this.id = id;
        this.variantName = variantName;
        this.skuCode = skuCode;
        this.mrp = mrp;
        this.price = price;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.isActive = isActive;
        this.imageUrls = imageUrls;
        this.sizes = sizes;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVariantName() {
        return variantName;
    }

    public void setVariantName(String variantName) {
        this.variantName = variantName;
    }

    public String getSkuCode() {
        return skuCode;
    }

    public void setSkuCode(String skuCode) {
        this.skuCode = skuCode;
    }

    public BigDecimal getMrp() {
        return mrp;
    }

    public void setMrp(BigDecimal mrp) {
        this.mrp = mrp;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
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

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public List<ProductVariantSizeResponseDto> getSizes() {
        return sizes;
    }

    public void setSizes(List<ProductVariantSizeResponseDto> sizes) {
        this.sizes = sizes;
    }

    public String getPrimaryImageUrl() {
        return primaryImageUrl;
    }

    public void setPrimaryImageUrl(String primaryImageUrl) {
        this.primaryImageUrl = primaryImageUrl;
    }
}
