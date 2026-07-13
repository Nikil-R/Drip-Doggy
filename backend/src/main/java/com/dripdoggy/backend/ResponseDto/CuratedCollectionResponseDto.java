package com.dripdoggy.backend.ResponseDto;

import java.util.List;

public class CuratedCollectionResponseDto {
    private String sectionKey;
    private String title;
    private String subtitle;
    private Boolean isActive;
    private List<ProductResponseDto> products;

    public CuratedCollectionResponseDto() {
    }

    public CuratedCollectionResponseDto(String sectionKey, String title, String subtitle, Boolean isActive, List<ProductResponseDto> products) {
        this.sectionKey = sectionKey;
        this.title = title;
        this.subtitle = subtitle;
        this.isActive = isActive;
        this.products = products;
    }

    public String getSectionKey() {
        return sectionKey;
    }

    public void setSectionKey(String sectionKey) {
        this.sectionKey = sectionKey;
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

    public List<ProductResponseDto> getProducts() {
        return products;
    }

    public void setProducts(List<ProductResponseDto> products) {
        this.products = products;
    }
}
