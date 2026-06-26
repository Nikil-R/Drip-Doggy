package com.dripdoggy.backend.RequestDto;

import jakarta.validation.constraints.NotBlank;
import org.springframework.web.multipart.MultipartFile;

public class SubCategoryRequestDto {

    @NotBlank(message = "Subcategory name is required")
    private String subcategoryName;

    @NotBlank(message = "Description is required")
    private String description;

    private Boolean isActive = true;
    private MultipartFile image;
    private Long categoryId;

    public SubCategoryRequestDto() {
    }

    public SubCategoryRequestDto(String subcategoryName, String description, Boolean isActive, MultipartFile image, Long categoryId) {
        this.subcategoryName = subcategoryName;
        this.description = description;
        this.isActive = isActive;
        this.image = image;
        this.categoryId = categoryId;
    }

    public String getSubcategoryName() {
        return subcategoryName;
    }

    public void setSubcategoryName(String subcategoryName) {
        this.subcategoryName = subcategoryName;
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

    public MultipartFile getImage() {
        return image;
    }

    public void setImage(MultipartFile image) {
        this.image = image;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
}
