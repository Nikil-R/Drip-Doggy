package com.dripdoggy.backend.ResponseDto;

public class BannerResponseDto {
    private Long id;
    private String tagline;
    private String title;
    private String description;
    private String redirectTo;
    private String buttonText;
    private Integer displayOrder;
    private Boolean isActive;
    private String imageUrl;

    public BannerResponseDto() {
    }

    public BannerResponseDto(Long id, String tagline, String title, String description, String redirectTo, String buttonText, Integer displayOrder, Boolean isActive, String imageUrl) {
        this.id = id;
        this.tagline = tagline;
        this.title = title;
        this.description = description;
        this.redirectTo = redirectTo;
        this.buttonText = buttonText;
        this.displayOrder = displayOrder;
        this.isActive = isActive;
        this.imageUrl = imageUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getButtonText() {
        return buttonText;
    }

    public void setButtonText(String buttonText) {
        this.buttonText = buttonText;
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
