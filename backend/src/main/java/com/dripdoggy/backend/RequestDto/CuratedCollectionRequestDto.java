package com.dripdoggy.backend.RequestDto;

import java.util.List;

public class CuratedCollectionRequestDto {
    private String title;
    private String subtitle;
    private Boolean isActive;
    private List<Long> productIds;

    public CuratedCollectionRequestDto() {
    }

    public CuratedCollectionRequestDto(String title, String subtitle, Boolean isActive, List<Long> productIds) {
        this.title = title;
        this.subtitle = subtitle;
        this.isActive = isActive;
        this.productIds = productIds;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public List<Long> getProductIds() {
        return productIds;
    }

    public void setProductIds(List<Long> productIds) {
        this.productIds = productIds;
    }
}
