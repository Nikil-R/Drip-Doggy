package com.dripdoggy.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "product_specifications")
public class ProductSpecification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fabric;
    private String fit;
    private String waterproofing;
    private String hardware;

    @Column(name = "pocket_design")
    private String pocketDesign;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @JsonIgnore
    private Product product;

    // Constructors
    public ProductSpecification() {
    }

    public ProductSpecification(Long id, String fabric, String fit, String waterproofing, String hardware, String pocketDesign, Product product) {
        this.id = id;
        this.fabric = fabric;
        this.fit = fit;
        this.waterproofing = waterproofing;
        this.hardware = hardware;
        this.pocketDesign = pocketDesign;
        this.product = product;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFabric() {
        return fabric;
    }

    public void setFabric(String fabric) {
        this.fabric = fabric;
    }

    public String getFit() {
        return fit;
    }

    public void setFit(String fit) {
        this.fit = fit;
    }

    public String getWaterproofing() {
        return waterproofing;
    }

    public void setWaterproofing(String waterproofing) {
        this.waterproofing = waterproofing;
    }

    public String getHardware() {
        return hardware;
    }

    public void setHardware(String hardware) {
        this.hardware = hardware;
    }

    public String getPocketDesign() {
        return pocketDesign;
    }

    public void setPocketDesign(String pocketDesign) {
        this.pocketDesign = pocketDesign;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
}
