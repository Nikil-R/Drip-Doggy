package com.dripdoggy.backend.RequestDto;

import org.springframework.web.multipart.MultipartFile;

public class ComingSoonBannerRequestDto {

    private String taglineBadge;
    private String releaseTitle;
    private String description;
    private String buttonText;
    private String actionLink;
    private Integer displayOrder;
    private Boolean isActive;
    private Long targetCategoryId;
    private Long targetSubCategoryId;
    private Long targetProductId;
    private MultipartFile backgroundImage;
    private String backgroundImageUrl; // Optional if passing URL string directly

    public ComingSoonBannerRequestDto() {
    }

    public String getTaglineBadge() {
        return taglineBadge;
    }

    public void setTaglineBadge(String taglineBadge) {
        this.taglineBadge = taglineBadge;
    }

    public String getReleaseTitle() {
        return releaseTitle;
    }

    public void setReleaseTitle(String releaseTitle) {
        this.releaseTitle = releaseTitle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getButtonText() {
        return buttonText;
    }

    public void setButtonText(String buttonText) {
        this.buttonText = buttonText;
    }

    public String getActionLink() {
        return actionLink;
    }

    public void setActionLink(String actionLink) {
        this.actionLink = actionLink;
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

    public Long getTargetCategoryId() {
        return targetCategoryId;
    }

    public void setTargetCategoryId(Long targetCategoryId) {
        this.targetCategoryId = targetCategoryId;
    }

    public Long getTargetSubCategoryId() {
        return targetSubCategoryId;
    }

    public void setTargetSubCategoryId(Long targetSubCategoryId) {
        this.targetSubCategoryId = targetSubCategoryId;
    }

    public Long getTargetProductId() {
        return targetProductId;
    }

    public void setTargetProductId(Long targetProductId) {
        this.targetProductId = targetProductId;
    }

    public MultipartFile getBackgroundImage() {
        return backgroundImage;
    }

    public void setBackgroundImage(MultipartFile backgroundImage) {
        this.backgroundImage = backgroundImage;
    }

    public String getBackgroundImageUrl() {
        return backgroundImageUrl;
    }

    public void setBackgroundImageUrl(String backgroundImageUrl) {
        this.backgroundImageUrl = backgroundImageUrl;
    }
}
