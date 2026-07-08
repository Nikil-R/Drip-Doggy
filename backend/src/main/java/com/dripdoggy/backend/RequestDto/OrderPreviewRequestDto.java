package com.dripdoggy.backend.RequestDto;

import jakarta.validation.constraints.NotBlank;

public class OrderPreviewRequestDto {

    @NotBlank(message = "Delivery method is required")
    private String deliveryMethod; // "STANDARD" or "EXPRESS"

    private String couponCode; // Optional

    // Getters and Setters
    public String getDeliveryMethod() {
        return deliveryMethod;
    }

    public void setDeliveryMethod(String deliveryMethod) {
        this.deliveryMethod = deliveryMethod;
    }

    public String getCouponCode() {
        return couponCode;
    }

    public void setCouponCode(String couponCode) {
        this.couponCode = couponCode;
    }
}
