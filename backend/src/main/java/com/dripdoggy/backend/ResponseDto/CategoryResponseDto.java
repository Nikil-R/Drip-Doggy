package com.dripdoggy.backend.ResponseDto;

import java.util.List;

public class CategoryResponseDto {

    private String categoryName;
    private String imageUrl;
    private String description;
    private Boolean isActive;
    private List<SubCategoryResponseDto> subCategories;

    // Frontend-expected fields
    private Long categoryId;
    private String subCategoryIds;
    private Boolean isDeleted;

    // Constructors
    public CategoryResponseDto() {
    }

    public CategoryResponseDto(Long categoryId, String categoryName, String imageUrl, String description, Boolean isActive, List<SubCategoryResponseDto> subCategories) {
        this.categoryName = categoryName;
        this.imageUrl = imageUrl;
        this.description = description;
        this.isActive = isActive;
        this.subCategories = subCategories;
        this.categoryId = categoryId;
    }

    public CategoryResponseDto(Long categoryId, String categoryName, String imageUrl, String description, Boolean isActive, List<SubCategoryResponseDto> subCategories, String subCategoryIds, Boolean isDeleted) {
        this.categoryName = categoryName;
        this.imageUrl = imageUrl;
        this.description = description;
        this.isActive = isActive;
        this.subCategories = subCategories;
        this.categoryId = categoryId;
        this.subCategoryIds = subCategoryIds;
        this.isDeleted = isDeleted;
    }

    // Getters and Setters
    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
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

    public List<SubCategoryResponseDto> getSubCategories() {
        return subCategories;
    }

    public void setSubCategories(List<SubCategoryResponseDto> subCategories) {
        this.subCategories = subCategories;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getSubCategoryIds() {
        return subCategoryIds;
    }

    public void setSubCategoryIds(String subCategoryIds) {
        this.subCategoryIds = subCategoryIds;
    }

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }
}
