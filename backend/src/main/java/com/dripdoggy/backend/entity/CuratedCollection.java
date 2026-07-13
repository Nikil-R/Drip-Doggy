package com.dripdoggy.backend.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "curated_collections")
public class CuratedCollection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "section_key", unique = true, nullable = false)
    private String sectionKey;

    private String title;
    private String subtitle;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "curated_collection_products",
        joinColumns = @JoinColumn(name = "curated_collection_id"),
        inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    @OrderColumn(name = "display_order")
    private List<Product> products = new ArrayList<>();

    public CuratedCollection() {
    }

    public CuratedCollection(Long id, String sectionKey, String title, String subtitle, Boolean isActive, List<Product> products) {
        this.id = id;
        this.sectionKey = sectionKey;
        this.title = title;
        this.subtitle = subtitle;
        this.isActive = isActive;
        this.products = products;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSectionKey() {
        return sectionKey;
    }

    public void setSectionKey(String sectionKey) {
        this.sectionKey = sectionKey;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }
}
