package com.dripdoggy.backend.dto;

public class ZoneConfig {
    private String name;
    private Double minPrice;
    private Double maxPrice;
    private Double defaultPrice;

    public ZoneConfig() {}

    public ZoneConfig(String name, Double minPrice, Double maxPrice, Double defaultPrice) {
        this.name = name;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.defaultPrice = defaultPrice;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(Double minPrice) {
        this.minPrice = minPrice;
    }

    public Double getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(Double maxPrice) {
        this.maxPrice = maxPrice;
    }

    public Double getDefaultPrice() {
        return defaultPrice;
    }

    public void setDefaultPrice(Double defaultPrice) {
        this.defaultPrice = defaultPrice;
    }
}
