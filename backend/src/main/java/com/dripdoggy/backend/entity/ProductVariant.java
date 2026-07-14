package com.dripdoggy.backend.entity;

import com.dripdoggy.backend.enums.DiscountType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "product_variants")
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "variant_name")
    private String variantName;

    private BigDecimal mrp;

    private BigDecimal price;

    @Column(name = "sku_code")
    private String skuCode;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "is_deleted")
    private Boolean isDeleted = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type")
    private DiscountType discountType;

    @Column(name = "discount_value")
    private BigDecimal discountValue;

    @Column(name = "primary_image_url")
    private String primaryImageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @JsonIgnore
    private Product product;

    @OneToMany(mappedBy = "productVariant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductVariantSize> productVariantSizes;

    @OneToMany(mappedBy = "productVariant")
    private List<Image> images;

    @OneToMany(mappedBy = "productVariant")
    private List<Review> reviews;

    // Constructors
    public ProductVariant() {
    }

    public ProductVariant(Long id, String variantName, BigDecimal mrp, BigDecimal price, String skuCode, Boolean isActive, DiscountType discountType, BigDecimal discountValue, Product product, List<ProductVariantSize> productVariantSizes, List<Image> images, List<Review> reviews) {
        this.id = id;
        this.variantName = variantName;
        this.mrp = mrp;
        this.price = price;
        this.skuCode = skuCode;
        this.isActive = isActive;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.product = product;
        this.productVariantSizes = productVariantSizes;
        this.images = images;
        this.reviews = reviews;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVariantName() {
        return variantName;
    }

    public void setVariantName(String variantName) {
        this.variantName = variantName;
    }

    public BigDecimal getMrp() {
        return mrp;
    }

    public void setMrp(BigDecimal mrp) {
        this.mrp = mrp;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getSkuCode() {
        return skuCode;
    }

    public void setSkuCode(String skuCode) {
        this.skuCode = skuCode;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public DiscountType getDiscountType() {
        return discountType;
    }

    public void setDiscountType(DiscountType discountType) {
        this.discountType = discountType;
    }

    public BigDecimal getDiscountValue() {
        return discountValue;
    }

    public void setDiscountValue(BigDecimal discountValue) {
        this.discountValue = discountValue;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public List<ProductVariantSize> getProductVariantSizes() {
        return productVariantSizes;
    }

    public void setProductVariantSizes(List<ProductVariantSize> productVariantSizes) {
        this.productVariantSizes = productVariantSizes;
    }

    public List<Image> getImages() {
        return images;
    }

    public void setImages(List<Image> images) {
        this.images = images;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    public String getPrimaryImageUrl() {
        return primaryImageUrl;
    }

    public void setPrimaryImageUrl(String primaryImageUrl) {
        this.primaryImageUrl = primaryImageUrl;
    }

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }
}
