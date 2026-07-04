package com.dripdoggy.backend.ResponseDto;

public class ProductVariantSizeResponseDto {
    private Long id;
    private String sizeName;
    private Integer stockQuantity;
    private Boolean isActive;

    // Constructors
    public ProductVariantSizeResponseDto() {
    }

    public ProductVariantSizeResponseDto(Long id, String sizeName, Integer stockQuantity, Boolean isActive) {
        this.id = id;
        this.sizeName = sizeName;
        this.stockQuantity = stockQuantity;
        this.isActive = isActive;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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
