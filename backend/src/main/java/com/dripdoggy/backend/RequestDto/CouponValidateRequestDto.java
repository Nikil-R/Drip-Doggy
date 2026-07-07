package com.dripdoggy.backend.RequestDto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class CouponValidateRequestDto {

    @NotBlank(message = "Coupon code is required")
    private String code;

    @NotNull(message = "Order amount is required")
    @DecimalMin(value = "0.0", message = "Order amount must be at least 0")
    private BigDecimal orderAmount;

    // Constructors
    public CouponValidateRequestDto() {
    }

    public CouponValidateRequestDto(String code, BigDecimal orderAmount) {
        this.code = code;
        this.orderAmount = orderAmount;
    }

    // Getters and Setters
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public BigDecimal getOrderAmount() {
        return orderAmount;
    }

    public void setOrderAmount(BigDecimal orderAmount) {
        this.orderAmount = orderAmount;
    }
}
