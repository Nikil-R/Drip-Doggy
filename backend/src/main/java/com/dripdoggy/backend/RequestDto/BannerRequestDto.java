package com.dripdoggy.backend.RequestDto;

import jakarta.validation.constraints.NotBlank;
import org.springframework.web.multipart.MultipartFile;

public class BannerRequestDto {

    @NotBlank(message = "Title is required")
    private String title;
    private String tagline;
    private String description;
    private String redirectTo;
    private Integer displayOrder;
    private Boolean isActive = true;
    private MultipartFile image;

    public BannerRequestDto() {
    }

    public BannerRequestDto(String tagline, String title, String description, String redirectTo, Integer displayOrder, Boolean isActive, MultipartFile image) {
        this.tagline = tagline;
        this.title = title;
        this.description = description;
        this.redirectTo = redirectTo;
        this.displayOrder = displayOrder;
        this.isActive = isActive;
        this.image = image;
    }

    public String getTagline() {
        return tagline;
    }

    public void setTagline(String tagline) {
        this.tagline = tagline;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRedirectTo() {
        return redirectTo;
    }

    public void setRedirectTo(String redirectTo) {
        this.redirectTo = redirectTo;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
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
}
