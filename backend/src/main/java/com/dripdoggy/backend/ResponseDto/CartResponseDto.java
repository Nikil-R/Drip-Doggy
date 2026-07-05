package com.dripdoggy.backend.ResponseDto;

import java.math.BigDecimal;

public class CartResponseDto {
    private Long id;
    private Integer quantity;
    private Boolean isActive;
    private Long productVariantSizeId;
    private String sizeName;
    private String productName;
    private String variantName;
    private BigDecimal price;
    private String primaryImageUrl;

    public CartResponseDto() {
    }

    public CartResponseDto(Long id, Integer quantity, Boolean isActive, Long productVariantSizeId, String sizeName, String productName, String variantName, BigDecimal price, String primaryImageUrl) {
        this.id = id;
        this.quantity = quantity;
        this.isActive = isActive;
        this.productVariantSizeId = productVariantSizeId;
        this.sizeName = sizeName;
        this.productName = productName;
        this.variantName = variantName;
        this.price = price;
        this.primaryImageUrl = primaryImageUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
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
}
