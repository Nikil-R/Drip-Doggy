package com.dripdoggy.backend.entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "product_name")
    private String productName;

    @Column(name = "base_title")
    private String baseTitle;

    @Column(name = "product_description")
    private String productDescription;

    @Column(name = "is_active")
    private Boolean isActive;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductVariant> productVariants;

    @OneToOne(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private ProductSpecification productSpecification;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductFeature> productFeatures;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Image> images;

    // Constructors
    public Product() {
    }

    public Product(Long id, String imageUrl, String productName, String baseTitle, String productDescription, Boolean isActive, List<ProductVariant> productVariants, ProductSpecification productSpecification, List<ProductFeature> productFeatures, List<Image> images) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.productName = productName;
        this.baseTitle = baseTitle;
        this.productDescription = productDescription;
        this.isActive = isActive;
        this.productVariants = productVariants;
        this.productSpecification = productSpecification;
        this.productFeatures = productFeatures;
        this.images = images;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getBaseTitle() {
        return baseTitle;
    }

    public void setBaseTitle(String baseTitle) {
        this.baseTitle = baseTitle;
    }

    public String getProductDescription() {
        return productDescription;
    }

    public void setProductDescription(String productDescription) {
        this.productDescription = productDescription;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public List<ProductVariant> getProductVariants() {
        return productVariants;
    }

    public void setProductVariants(List<ProductVariant> productVariants) {
        this.productVariants = productVariants;
    }

    public ProductSpecification getProductSpecification() {
        return productSpecification;
    }

    public void setProductSpecification(ProductSpecification productSpecification) {
        this.productSpecification = productSpecification;
    }

    public List<ProductFeature> getProductFeatures() {
        return productFeatures;
    }

    public void setProductFeatures(List<ProductFeature> productFeatures) {
        this.productFeatures = productFeatures;
    }

    public List<Image> getImages() {
        return images;
    }

    public void setImages(List<Image> images) {
        this.images = images;
    }
}
