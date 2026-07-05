package com.dripdoggy.backend.ResponseDto;

import java.math.BigDecimal;

public class WishlistResponseDto {
    private Long id;
    private Long productVariantSizeId;
    private String sizeName;
    private String productName;
    private String variantName;
    private BigDecimal price;
    private String primaryImageUrl;
    private Boolean isActive;

    public WishlistResponseDto() {
    }

    public WishlistResponseDto(Long id, Long productVariantSizeId, String sizeName, String productName, String variantName, BigDecimal price, String primaryImageUrl, Boolean isActive) {
        this.id = id;
        this.productVariantSizeId = productVariantSizeId;
        this.sizeName = sizeName;
        this.productName = productName;
        this.variantName = variantName;
        this.price = price;
        this.primaryImageUrl = primaryImageUrl;
        this.isActive = isActive;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductVariantSizeId() {
        return productVariantSizeId;
    }

    public void setProductVariantSizeId(Long productVariantSizeId) {
        this.productVariantSizeId = productVariantSizeId;
    }

    public String getSizeName() {
        return sizeName;
    }

    public void setSizeName(String sizeName) {
        this.sizeName = sizeName;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getVariantName() {
        return variantName;
    }

    public void setVariantName(String variantName) {
        this.variantName = variantName;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getPrimaryImageUrl() {
        return primaryImageUrl;
    }

    public void setPrimaryImageUrl(String primaryImageUrl) {
        this.primaryImageUrl = primaryImageUrl;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}
