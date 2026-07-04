package com.dripdoggy.backend.RequestDto;

public class ProductVariantSizeRequestDto {
    private String sizeName;
    private Integer stockQuantity;
    private Boolean isActive = true;

    // Constructors
    public ProductVariantSizeRequestDto() {
    }

    public ProductVariantSizeRequestDto(String sizeName, Integer stockQuantity, Boolean isActive) {
        this.sizeName = sizeName;
        this.stockQuantity = stockQuantity;
        this.isActive = isActive;
    }

    // Getters and Setters
    public String getSizeName() {
        return sizeName;
    }

    public void setSizeName(String sizeName) {
        this.sizeName = sizeName;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}
