package com.dripdoggy.backend.RequestDto;

import jakarta.validation.constraints.NotBlank;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public class CategoryRequestDto {

    @NotBlank(message = "Category name is required")
    private String categoryName;

    @NotBlank(message = "Description is required")
    private String description;

    private Boolean isActive = true;
    private List<Long> subCategoryIds;
    private MultipartFile image;

    // Constructors
    public CategoryRequestDto() {
    }

    public CategoryRequestDto(String categoryName, String description, Boolean isActive, List<Long> subCategoryIds, MultipartFile image) {
        this.categoryName = categoryName;
        this.description = description;
        this.isActive = isActive;
        this.subCategoryIds = subCategoryIds;
        this.image = image;
    }

    // Getters and Setters
    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
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

    public List<Long> getSubCategoryIds() {
        return subCategoryIds;
    }

    public void setSubCategoryIds(List<Long> subCategoryIds) {
        this.subCategoryIds = subCategoryIds;
    }

    public MultipartFile getImage() {
        return image;
    }

    public void setImage(MultipartFile image) {
        this.image = image;
    }
}
