package com.dripdoggy.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "banners")
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tagline;
    private String title;
    private String description;

    @Column(name = "redirect_to")
    private String redirectTo;

    @Column(name = "button_text")
    private String buttonText;

    @Column(name = "display_order")
    private Integer displayOrder;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "is_deleted")
    private Boolean isDeleted = false;

    @OneToOne(mappedBy = "banner", cascade = CascadeType.ALL, orphanRemoval = true)
    private Image image;

    // Constructors
    public Banner() {
    }

    public Banner(Long id, String tagline, String title, String description, String redirectTo, String buttonText, Integer displayOrder, Boolean isActive, Boolean isDeleted, Image image) {
        this.id = id;
        this.tagline = tagline;
        this.title = title;
        this.description = description;
        this.redirectTo = redirectTo;
        this.buttonText = buttonText;
        this.displayOrder = displayOrder;
        this.isActive = isActive;
        this.isDeleted = isDeleted;
        this.image = image;
    }

    // Getters and Setters
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

    public Image getImage() {
        return image;
    }

    public void setImage(Image image) {
        this.image = image;
    }

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }
}
