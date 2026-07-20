package com.dripdoggy.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "cart", uniqueConstraints = {
    @UniqueConstraint(name = "uk_user_product_variant_size_bundle", columnNames = {"user_id", "product_variant_size_id", "bundle_id"})
})
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer quantity;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bundle_id")
    @JsonIgnore
    private Bundle bundle;

    // Constructors
    public Cart() {
    }

    public Cart(Long id, Integer quantity, Boolean isActive, User user, ProductVariantSize productVariantSize) {
        this.id = id;
        this.quantity = quantity;
        this.isActive = isActive;
        this.user = user;
        this.productVariantSize = productVariantSize;
    }

    public Cart(Long id, Integer quantity, Boolean isActive, User user, ProductVariantSize productVariantSize, Bundle bundle) {
        this.id = id;
        this.quantity = quantity;
        this.isActive = isActive;
        this.user = user;
        this.productVariantSize = productVariantSize;
        this.bundle = bundle;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
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

    public Bundle getBundle() {
        return bundle;
    }

    public void setBundle(Bundle bundle) {
        this.bundle = bundle;
    }
}
