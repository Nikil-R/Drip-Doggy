package com.dripdoggy.backend.ResponseDto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CustomerCouponResponseDto {
    private String code;
    private String discountType;
    private BigDecimal discountValue;
    private BigDecimal minOrder;
    private LocalDate expiryDate;
    private String description;
    private Boolean firstOrderOnly;

    // Constructors
    public CustomerCouponResponseDto() {
    }

    public CustomerCouponResponseDto(String code, String discountType, BigDecimal discountValue, BigDecimal minOrder, LocalDate expiryDate, String description, Boolean firstOrderOnly) {
        this.code = code;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.minOrder = minOrder;
        this.expiryDate = expiryDate;
        this.description = description;
        this.firstOrderOnly = firstOrderOnly;
    }

    // Getters and Setters
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDiscountType() {
        return discountType;
    }

    public void setDiscountType(String discountType) {
        this.discountType = discountType;
    }

    public BigDecimal getDiscountValue() {
        return discountValue;
    }

    public void setDiscountValue(BigDecimal discountValue) {
        this.discountValue = discountValue;
    }

    public BigDecimal getMinOrder() {
        return minOrder;
    }

    public void setMinOrder(BigDecimal minOrder) {
        this.minOrder = minOrder;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getFirstOrderOnly() {
        return firstOrderOnly;
    }

    public void setFirstOrderOnly(Boolean firstOrderOnly) {
        this.firstOrderOnly = firstOrderOnly;
    }
}
