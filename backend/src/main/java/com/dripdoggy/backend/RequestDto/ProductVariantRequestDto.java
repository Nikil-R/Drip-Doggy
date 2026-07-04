package com.dripdoggy.backend.RequestDto;

import com.dripdoggy.backend.enums.DiscountType;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;
import java.util.List;

public class ProductVariantRequestDto {
    private String variantName;
    private String skuCode;
    private BigDecimal mrp;
    private DiscountType discountType;
    private BigDecimal discountValue;
    private Boolean isActive = true;
    private List<MultipartFile> images; // List of image files uploaded in multipart form
    private List<String> existingImageUrls; // List of S3 URLs to keep (for updates)
    private List<ProductVariantSizeRequestDto> sizes;
    private String primaryImageUrl;

    // Constructors
    public ProductVariantRequestDto() {
    }

    public ProductVariantRequestDto(String variantName, String skuCode, BigDecimal mrp, DiscountType discountType, BigDecimal discountValue, Boolean isActive, List<MultipartFile> images, List<String> existingImageUrls, List<ProductVariantSizeRequestDto> sizes) {
        this.variantName = variantName;
        this.skuCode = skuCode;
        this.mrp = mrp;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.isActive = isActive;
        this.images = images;
        this.existingImageUrls = existingImageUrls;
        this.sizes = sizes;
    }

    // Getters and Setters
    public String getVariantName() {
        return variantName;
    }

    public void setVariantName(String variantName) {
        this.variantName = variantName;
    }

    public String getSkuCode() {
        return skuCode;
    }

    public void setSkuCode(String skuCode) {
        this.skuCode = skuCode;
    }

    public BigDecimal getMrp() {
        return mrp;
    }

    public void setMrp(BigDecimal mrp) {
        this.mrp = mrp;
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

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public List<MultipartFile> getImages() {
        return images;
    }

    public void setImages(List<MultipartFile> images) {
        this.images = images;
    }

    public List<String> getExistingImageUrls() {
        return existingImageUrls;
    }

    public void setExistingImageUrls(List<String> existingImageUrls) {
        this.existingImageUrls = existingImageUrls;
    }

    public List<ProductVariantSizeRequestDto> getSizes() {
        return sizes;
    }

    public void setSizes(List<ProductVariantSizeRequestDto> sizes) {
        this.sizes = sizes;
    }

    public String getPrimaryImageUrl() {
        return primaryImageUrl;
    }

    public void setPrimaryImageUrl(String primaryImageUrl) {
        this.primaryImageUrl = primaryImageUrl;
    }
}
