package com.dripdoggy.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "coming_soon_banners")
public class ComingSoonBanner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tagline_badge")
    private String taglineBadge = "UPCOMING RELEASE";

    @Column(name = "release_title", nullable = false)
    private String releaseTitle;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "background_image_url", nullable = false)
    private String backgroundImageUrl;

    @Column(name = "button_text")
    private String buttonText = "NOTIFY ME";

    @Column(name = "action_link")
    private String actionLink = "#notify";

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @Column(name = "target_category_id")
    private Long targetCategoryId;

    @Column(name = "target_subcategory_id")
    private Long targetSubCategoryId;

    @Column(name = "target_product_id")
    private Long targetProductId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.taglineBadge == null || this.taglineBadge.trim().isEmpty()) {
            this.taglineBadge = "UPCOMING RELEASE";
        }
        if (this.buttonText == null || this.buttonText.trim().isEmpty()) {
            this.buttonText = "NOTIFY ME";
        }
        if (this.actionLink == null || this.actionLink.trim().isEmpty()) {
            this.actionLink = "#notify";
        }
        if (this.displayOrder == null) {
            this.displayOrder = 0;
        }
        if (this.isActive == null) {
            this.isActive = true;
        }
        if (this.isDeleted == null) {
            this.isDeleted = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public ComingSoonBanner() {
    }

    public ComingSoonBanner(Long id, String taglineBadge, String releaseTitle, String description, String backgroundImageUrl, String buttonText, String actionLink, Integer displayOrder, Boolean isActive, Boolean isDeleted, Long targetCategoryId, Long targetSubCategoryId, Long targetProductId) {
        this.id = id;
        this.taglineBadge = taglineBadge;
        this.releaseTitle = releaseTitle;
        this.description = description;
        this.backgroundImageUrl = backgroundImageUrl;
        this.buttonText = buttonText;
        this.actionLink = actionLink;
        this.displayOrder = displayOrder;
        this.isActive = isActive;
        this.isDeleted = isDeleted;
        this.targetCategoryId = targetCategoryId;
        this.targetSubCategoryId = targetSubCategoryId;
        this.targetProductId = targetProductId;
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

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
