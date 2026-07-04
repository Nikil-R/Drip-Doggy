package com.dripdoggy.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "product_variant_sizes")
public class ProductVariantSize {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "size_name")
    private String sizeName;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "stock_quantity")
    private Integer stockQuantity = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_variant_id")
    @JsonIgnore
    private ProductVariant productVariant;

    @OneToMany(mappedBy = "productVariantSize")
    private List<OrderItem> orderItems;

    @OneToMany(mappedBy = "productVariantSize")
    private List<Wishlist> wishlistItems;

    @OneToMany(mappedBy = "productVariantSize")
    private List<Cart> cartItems;

    // Constructors
    public ProductVariantSize() {
    }

    public ProductVariantSize(Long id, String sizeName, Boolean isActive, Integer stockQuantity, ProductVariant productVariant, List<OrderItem> orderItems, List<Wishlist> wishlistItems, List<Cart> cartItems) {
        this.id = id;
        this.sizeName = sizeName;
        this.isActive = isActive;
        this.stockQuantity = stockQuantity;
        this.productVariant = productVariant;
        this.orderItems = orderItems;
        this.wishlistItems = wishlistItems;
        this.cartItems = cartItems;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSizeName() {
        return sizeName;
    }

    public void setSizeName(String sizeName) {
        this.sizeName = sizeName;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public ProductVariant getProductVariant() {
        return productVariant;
    }

    public void setProductVariant(ProductVariant productVariant) {
        this.productVariant = productVariant;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public List<Wishlist> getWishlistItems() {
        return wishlistItems;
    }

    public void setWishlistItems(List<Wishlist> wishlistItems) {
        this.wishlistItems = wishlistItems;
    }

    public List<Cart> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<Cart> cartItems) {
        this.cartItems = cartItems;
    }
}
