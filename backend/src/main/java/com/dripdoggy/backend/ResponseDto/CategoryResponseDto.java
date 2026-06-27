package com.dripdoggy.backend.ResponseDto;

import java.util.List;

public class CategoryResponseDto {

    private Long id;
    private String categoryName;
    private String imageUrl;
    private String description;
    private Boolean isActive;
    private List<SubCategoryResponseDto> subCategories;

    // Frontend-expected fields
    private Long categoryId;
    private String imagePath;
    private String subCategoryIds;
    private Boolean isDeleted;

    // Constructors
    public CategoryResponseDto() {
    }

    public CategoryResponseDto(Long id, String categoryName, String imageUrl, String description, Boolean isActive, List<SubCategoryResponseDto> subCategories) {
        this.id = id;
        this.categoryName = categoryName;
        this.imageUrl = imageUrl;
        this.description = description;
        this.isActive = isActive;
        this.subCategories = subCategories;
        this.categoryId = id;
        this.imagePath = imageUrl;
    }

    public CategoryResponseDto(Long id, String categoryName, String imageUrl, String description, Boolean isActive, List<SubCategoryResponseDto> subCategories, Long categoryId, String imagePath, String subCategoryIds, Boolean isDeleted) {
        this.id = id;
        this.categoryName = categoryName;
        this.imageUrl = imageUrl;
        this.description = description;
        this.isActive = isActive;
        this.subCategories = subCategories;
        this.categoryId = categoryId;
        this.imagePath = imagePath;
        this.subCategoryIds = subCategoryIds;
        this.isDeleted = isDeleted;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
        this.categoryId = id;
    }

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
        this.imagePath = imageUrl;
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

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
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
