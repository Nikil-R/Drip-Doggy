package com.dripdoggy.backend.ResponseDto;

public class SubCategoryResponseDto {

    private Long id;
    private String subcategoryName;
    private String imageUrl;
    private String description;
    private Boolean isActive;

    // Constructors
    public SubCategoryResponseDto() {
    }

    public SubCategoryResponseDto(Long id, String subcategoryName, String imageUrl, String description, Boolean isActive) {
        this.id = id;
        this.subcategoryName = subcategoryName;
        this.imageUrl = imageUrl;
        this.description = description;
        this.isActive = isActive;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
}
