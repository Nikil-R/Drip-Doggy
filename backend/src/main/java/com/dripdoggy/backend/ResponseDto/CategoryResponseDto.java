package com.dripdoggy.backend.ResponseDto;

import java.util.List;

public class CategoryResponseDto {

    private Long id;
    private String categoryName;
    private String imageUrl;
    private String description;
    private Boolean isActive;
    private List<SubCategoryResponseDto> subCategories;

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
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
}
