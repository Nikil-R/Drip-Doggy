package com.dripdoggy.backend.RequestDto;

import org.springframework.web.multipart.MultipartFile;

public class HomeCategoryRequestDto {
    private String title;
    private String description;
    private String route;
    private MultipartFile image;
    private Boolean comingSoon;
    private String comingSeason;
    private Integer displayOrder;
    private Boolean isActive;

    public HomeCategoryRequestDto() {
    }

    public HomeCategoryRequestDto(String title, String description, String route, MultipartFile image, Boolean comingSoon, String comingSeason, Integer displayOrder, Boolean isActive) {
        this.title = title;
        this.description = description;
        this.route = route;
        this.image = image;
        this.comingSoon = comingSoon;
        this.comingSeason = comingSeason;
        this.displayOrder = displayOrder;
        this.isActive = isActive;
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

    public String getRoute() {
        return route;
    }

    public void setRoute(String route) {
        this.route = route;
    }

    public MultipartFile getImage() {
        return image;
    }

    public void setImage(MultipartFile image) {
        this.image = image;
    }

    public Boolean getComingSoon() {
        return comingSoon;
    }

    public void setComingSoon(Boolean comingSoon) {
        this.comingSoon = comingSoon;
    }

    public String getComingSeason() {
        return comingSeason;
    }

    public void setComingSeason(String comingSeason) {
        this.comingSeason = comingSeason;
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
}
