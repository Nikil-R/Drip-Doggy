package com.dripdoggy.backend.ResponseDto;

import java.math.BigDecimal;

public class CouponValidationResponseDto {
    private String code;
    private String discountType;
    private BigDecimal discountValue;
    private BigDecimal calculatedDiscount;
    private Boolean isFreeShipping;
    private BigDecimal minOrder;
    private String description;

    // Constructors
    public CouponValidationResponseDto() {
    }

    public CouponValidationResponseDto(String code, String discountType, BigDecimal discountValue, BigDecimal calculatedDiscount, Boolean isFreeShipping, BigDecimal minOrder, String description) {
        this.code = code;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.calculatedDiscount = calculatedDiscount;
        this.isFreeShipping = isFreeShipping;
        this.minOrder = minOrder;
        this.description = description;
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

    public BigDecimal getCalculatedDiscount() {
        return calculatedDiscount;
    }

    public void setCalculatedDiscount(BigDecimal calculatedDiscount) {
        this.calculatedDiscount = calculatedDiscount;
    }

    public Boolean getIsFreeShipping() {
        return isFreeShipping;
    }

    public void setIsFreeShipping(Boolean isFreeShipping) {
        this.isFreeShipping = isFreeShipping;
    }

    public BigDecimal getMinOrder() {
        return minOrder;
    }

    public void setMinOrder(BigDecimal minOrder) {
        this.minOrder = minOrder;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
