package com.dripdoggy.backend.ResponseDto;

import java.time.LocalDateTime;

public class ComingSoonBannerResponseDto {

    private Long id;
    private String taglineBadge;
    private String releaseTitle;
    private String description;
    private String backgroundImageUrl;
    private String buttonText;
    private String actionLink;
    private Integer displayOrder;
    private Boolean isActive;
    private Long targetCategoryId;
    private Long targetSubCategoryId;
    private Long targetProductId;
    private LocalDateTime createdAt;

    public ComingSoonBannerResponseDto() {
    }

    public ComingSoonBannerResponseDto(Long id, String taglineBadge, String releaseTitle, String description, String backgroundImageUrl, String buttonText, String actionLink, Integer displayOrder, Boolean isActive, Long targetCategoryId, Long targetSubCategoryId, Long targetProductId, LocalDateTime createdAt) {
        this.id = id;
        this.taglineBadge = taglineBadge;
        this.releaseTitle = releaseTitle;
        this.description = description;
        this.backgroundImageUrl = backgroundImageUrl;
        this.buttonText = buttonText;
        this.actionLink = actionLink;
        this.displayOrder = displayOrder;
        this.isActive = isActive;
        this.targetCategoryId = targetCategoryId;
        this.targetSubCategoryId = targetSubCategoryId;
        this.targetProductId = targetProductId;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getBackgroundImageUrl() {
        return backgroundImageUrl;
    }

    public void setBackgroundImageUrl(String backgroundImageUrl) {
        this.backgroundImageUrl = backgroundImageUrl;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
