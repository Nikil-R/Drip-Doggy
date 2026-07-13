package com.dripdoggy.backend.ResponseDto;

public class HomeCategoryResponseDto {
    private Long id;
    private String title;
    private String description;
    private String route;
    private String imageUrl;
    private Boolean comingSoon;
    private String comingSeason;
    private Integer displayOrder;
    private Boolean isActive;

    public HomeCategoryResponseDto() {
    }

    public HomeCategoryResponseDto(Long id, String title, String description, String route, String imageUrl, Boolean comingSoon, String comingSeason, Integer displayOrder, Boolean isActive) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.route = route;
        this.imageUrl = imageUrl;
        this.comingSoon = comingSoon;
        this.comingSeason = comingSeason;
        this.displayOrder = displayOrder;
        this.isActive = isActive;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
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
