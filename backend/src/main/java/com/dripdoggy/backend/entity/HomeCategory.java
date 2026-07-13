package com.dripdoggy.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "home_categories")
public class HomeCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(nullable = false)
    private String route;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "coming_soon")
    private Boolean comingSoon = false;

    @Column(name = "coming_season")
    private String comingSeason;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @Column(name = "is_active")
    private Boolean isActive = true;

    public HomeCategory() {
    }

    public HomeCategory(Long id, String title, String description, String route, String imageUrl, Boolean comingSoon, String comingSeason, Integer displayOrder, Boolean isActive) {
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
