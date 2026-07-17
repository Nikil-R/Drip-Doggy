package com.dripdoggy.backend.ResponseDto;

import java.math.BigDecimal;
import java.util.List;

public class ProductVariantDetailsResponseDto {
    private Long variantId;
    private String variantName;
    private Long productId;
    private String productName;
    private String productDescription;
    private BigDecimal price;
    private BigDecimal mrp;
    private List<String> imageUrls;
    private List<ProductVariantSizeResponseDto> sizes;

    public ProductVariantDetailsResponseDto() {
    }

    public ProductVariantDetailsResponseDto(Long variantId, String variantName, Long productId, String productName, String productDescription, BigDecimal price, BigDecimal mrp, List<String> imageUrls, List<ProductVariantSizeResponseDto> sizes) {
        this.variantId = variantId;
        this.variantName = variantName;
        this.productId = productId;
        this.productName = productName;
        this.productDescription = productDescription;
        this.price = price;
        this.mrp = mrp;
        this.imageUrls = imageUrls;
        this.sizes = sizes;
    }

    public Long getVariantId() {
        return variantId;
    }

    public void setVariantId(Long variantId) {
        this.variantId = variantId;
    }

    public String getVariantName() {
        return variantName;
    }

    public void setVariantName(String variantName) {
        this.variantName = variantName;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductDescription() {
        return productDescription;
    }

    public void setProductDescription(String productDescription) {
        this.productDescription = productDescription;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getMrp() {
        return mrp;
    }

    public void setMrp(BigDecimal mrp) {
        this.mrp = mrp;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public List<ProductVariantSizeResponseDto> getSizes() {
        return sizes;
    }

    public void setSizes(List<ProductVariantSizeResponseDto> sizes) {
        this.sizes = sizes;
    }
}
