package com.dripdoggy.backend.ResponseDto;

import java.util.List;

public class ProductResponseDto {
    private Long id;
    private String productName;
    private String skuCode;
    private Long categoryId;
    private String categoryName;
    private Long subCategoryId;
    private String subcategoryName;
    private String baseTitle; // This is the label field (e.g., BEST SELLER)
    private String productDescription;
    private Boolean isActive;
    private ProductSpecificationResponseDto specification;
    private List<ProductFeatureResponseDto> features;
    private List<ProductVariantResponseDto> variants;

    // Constructors
    public ProductResponseDto() {
    }

    public ProductResponseDto(Long id, String productName, String skuCode, Long categoryId, String categoryName, Long subCategoryId, String subcategoryName, String baseTitle, String productDescription, Boolean isActive, ProductSpecificationResponseDto specification, List<ProductFeatureResponseDto> features, List<ProductVariantResponseDto> variants) {
        this.id = id;
        this.productName = productName;
        this.skuCode = skuCode;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.subCategoryId = subCategoryId;
        this.subcategoryName = subcategoryName;
        this.baseTitle = baseTitle;
        this.productDescription = productDescription;
        this.isActive = isActive;
        this.specification = specification;
        this.features = features;
        this.variants = variants;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Long getSubCategoryId() {
        return subCategoryId;
    }

    public void setSubCategoryId(Long subCategoryId) {
        this.subCategoryId = subCategoryId;
    }

    public String getSubcategoryName() {
        return subcategoryName;
    }

    public void setSubcategoryName(String subcategoryName) {
        this.subcategoryName = subcategoryName;
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

    public ProductSpecificationResponseDto getSpecification() {
        return specification;
    }

    public void setSpecification(ProductSpecificationResponseDto specification) {
        this.specification = specification;
    }

    public List<ProductFeatureResponseDto> getFeatures() {
        return features;
    }

    public void setFeatures(List<ProductFeatureResponseDto> features) {
        this.features = features;
    }

    public List<ProductVariantResponseDto> getVariants() {
        return variants;
    }

    public void setVariants(List<ProductVariantResponseDto> variants) {
        this.variants = variants;
    }
}
