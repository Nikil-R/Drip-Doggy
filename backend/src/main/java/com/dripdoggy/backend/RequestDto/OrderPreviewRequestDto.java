package com.dripdoggy.backend.RequestDto;

import jakarta.validation.constraints.NotBlank;

public class OrderPreviewRequestDto {

    private String deliveryMethod = "STANDARD"; // Optional (defaults to STANDARD)

    private String couponCode; // Optional

    private Long addressId; // Optional
    private String state; // Optional
    private String city; // Optional

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

    public Long getAddressId() {
        return addressId;
    }

    public void setAddressId(Long addressId) {
        this.addressId = addressId;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }
}
