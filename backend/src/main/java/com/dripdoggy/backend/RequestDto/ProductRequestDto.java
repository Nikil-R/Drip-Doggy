package com.dripdoggy.backend.RequestDto;

import java.util.List;

public class ProductRequestDto {
    private String productName;
    private String skuCode;
    private Long categoryId;
    private Long subCategoryId;
    private String baseTitle; // This is the label field (e.g., BEST SELLER)
    private String productDescription;
    private Boolean isActive = true;				
    private List<ProductVariantRequestDto> variants;
    private ProductSpecificationRequestDto specification;
    private List<String> features; // List of design detail bullet descriptions

    // Constructors
    public ProductRequestDto() {
    }

    public ProductRequestDto(String productName, String skuCode, Long categoryId, Long subCategoryId, String baseTitle, String productDescription, Boolean isActive, List<ProductVariantRequestDto> variants, ProductSpecificationRequestDto specification, List<String> features) {
        this.productName = productName;
        this.skuCode = skuCode;
        this.categoryId = categoryId;
        this.subCategoryId = subCategoryId;
        this.baseTitle = baseTitle;
        this.productDescription = productDescription;
        this.isActive = isActive;
        this.variants = variants;
        this.specification = specification;
        this.features = features;
    }

    // Getters and Setters
    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getSkuCode() {
        return skuCode;
    }

    public void setSkuCode(String skuCode) {
        this.skuCode = skuCode;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public Long getSubCategoryId() {
        return subCategoryId;
    }

    public void setSubCategoryId(Long subCategoryId) {
        this.subCategoryId = subCategoryId;
    }

    public String getBaseTitle() {
        return baseTitle;
    }

    public void setBaseTitle(String baseTitle) {
        this.baseTitle = baseTitle;
    }

    public String getProductDescription() {
        return productDescription;
    }

    public void setProductDescription(String productDescription) {
        this.productDescription = productDescription;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public List<ProductVariantRequestDto> getVariants() {
        return variants;
    }

    public void setVariants(List<ProductVariantRequestDto> variants) {
        this.variants = variants;
    }

    public ProductSpecificationRequestDto getSpecification() {
        return specification;
    }

    public void setSpecification(ProductSpecificationRequestDto specification) {
        this.specification = specification;
    }

    public List<String> getFeatures() {
        return features;
    }

    public void setFeatures(List<String> features) {
        this.features = features;
    }
}
