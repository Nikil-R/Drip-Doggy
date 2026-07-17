package com.dripdoggy.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer quantity;
    private BigDecimal price;

    @Column(name = "sub_total")
    private BigDecimal subTotal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @JsonIgnore
    private Orders order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_variant_size_id")
    @JsonIgnore
    private ProductVariantSize productVariantSize;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bundle_id")
    @JsonIgnore
    private Bundle bundle;

    // Constructors
    public OrderItem() {
    }

    public OrderItem(Long id, Integer quantity, BigDecimal price, BigDecimal subTotal, Orders order, ProductVariantSize productVariantSize) {
        this.id = id;
        this.quantity = quantity;
        this.price = price;
        this.subTotal = subTotal;
        this.order = order;
        this.productVariantSize = productVariantSize;
    }

    public OrderItem(Long id, Integer quantity, BigDecimal price, BigDecimal subTotal, Orders order, ProductVariantSize productVariantSize, Bundle bundle) {
        this.id = id;
        this.quantity = quantity;
        this.price = price;
        this.subTotal = subTotal;
        this.order = order;
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

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getSubTotal() {
        return subTotal;
    }

    public void setSubTotal(BigDecimal subTotal) {
        this.subTotal = subTotal;
    }

    public Orders getOrder() {
        return order;
    }

    public void setOrder(Orders order) {
        this.order = order;
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
