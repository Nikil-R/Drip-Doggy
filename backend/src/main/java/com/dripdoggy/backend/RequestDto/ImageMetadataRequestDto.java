package com.dripdoggy.backend.RequestDto;

public class ImageMetadataRequestDto {
    private String fileName;
    private Boolean isPrimary = false;
    private Boolean isBanner = false;
    private Boolean isInside = false;
    private Integer priority;

    public ImageMetadataRequestDto() {
    }

    public ImageMetadataRequestDto(String fileName, Boolean isPrimary, Boolean isBanner, Boolean isInside, Integer priority) {
        this.fileName = fileName;
        this.isPrimary = isPrimary;
        this.isBanner = isBanner;
        this.isInside = isInside;
        this.priority = priority;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public Boolean getIsPrimary() {
        return isPrimary;
    }

    public void setIsPrimary(Boolean isPrimary) {
        this.isPrimary = isPrimary;
    }

    public Boolean getIsBanner() {
        return isBanner;
    }

    public void setIsBanner(Boolean isBanner) {
        this.isBanner = isBanner;
    }

    public Boolean getIsInside() {
        return isInside;
    }

    public void setIsInside(Boolean isInside) {
        this.isInside = isInside;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }
}
