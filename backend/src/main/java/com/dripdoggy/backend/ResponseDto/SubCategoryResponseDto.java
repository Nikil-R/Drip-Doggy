package com.dripdoggy.backend.ResponseDto;

public class SubCategoryResponseDto {

    private Long subCategoryId;
    private String subcategoryName;
    private String imageUrl;
    private String description;
    private Boolean isActive;
    private Long categoryId;

    // Constructors
    public SubCategoryResponseDto() {
    }

    public SubCategoryResponseDto(Long subCategoryId, String subcategoryName, String imageUrl, String description, Boolean isActive, Long categoryId) {
        this.subCategoryId = subCategoryId;
        this.subcategoryName = subcategoryName;
        this.imageUrl = imageUrl;
        this.description = description;
        this.isActive = isActive;
        this.categoryId = categoryId;
    }

    // Getters and Setters
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
}
