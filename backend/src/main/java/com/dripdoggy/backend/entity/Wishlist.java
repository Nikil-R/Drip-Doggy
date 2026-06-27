package com.dripdoggy.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "wishlist")
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "is_active")
    private Boolean isActive;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_variant_size_id")
    @JsonIgnore
    private ProductVariantSize productVariantSize;

    // Constructors
    public Wishlist() {
    }

    public Wishlist(Long id, Boolean isActive, User user, ProductVariantSize productVariantSize) {
        this.id = id;
        this.isActive = isActive;
        this.user = user;
        this.productVariantSize = productVariantSize;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ProductVariantSize getProductVariantSize() {
        return productVariantSize;
    }

    public void setProductVariantSize(ProductVariantSize productVariantSize) {
        this.productVariantSize = productVariantSize;
    }
}
