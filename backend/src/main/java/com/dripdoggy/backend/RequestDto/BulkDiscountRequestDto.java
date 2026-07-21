package com.dripdoggy.backend.RequestDto;

import java.math.BigDecimal;

public class BulkDiscountRequestDto {

    private String category;
    private BigDecimal discountRate;
    private Integer durationDays;

    public BulkDiscountRequestDto() {
    }

    public BulkDiscountRequestDto(String category, BigDecimal discountRate, Integer durationDays) {
        this.category = category;
        this.discountRate = discountRate;
        this.durationDays = durationDays;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getDiscountRate() {
        return discountRate;
    }

    public void setDiscountRate(BigDecimal discountRate) {
        this.discountRate = discountRate;
    }

    public Integer getDurationDays() {
        return durationDays;
    }

    public void setDurationDays(Integer durationDays) {
        this.durationDays = durationDays;
    }
}
