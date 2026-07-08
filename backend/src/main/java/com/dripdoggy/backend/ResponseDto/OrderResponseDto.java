package com.dripdoggy.backend.ResponseDto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class OrderResponseDto {
    private String orderNumber;
    private LocalDateTime orderTimestamp;
    private BigDecimal totalAmount;
    private BigDecimal discount;
    private BigDecimal tax;
    private BigDecimal platformFee;
    private BigDecimal shippingFee;
    private String deliveryMethod;
    private String deliveryStatus;
    private String paymentStatus;
    private String phoneNumber;
    private String customerEmail;
    private String customerName;
    private String destinationAddress;

    // Constructors
    public OrderResponseDto() {
    }

    public OrderResponseDto(String orderNumber, LocalDateTime orderTimestamp, BigDecimal totalAmount, BigDecimal discount, BigDecimal tax, BigDecimal platformFee, BigDecimal shippingFee, String deliveryMethod, String deliveryStatus, String paymentStatus, String phoneNumber, String customerEmail, String customerName, String destinationAddress) {
        this.orderNumber = orderNumber;
        this.orderTimestamp = orderTimestamp;
        this.totalAmount = totalAmount;
        this.discount = discount;
        this.tax = tax;
        this.platformFee = platformFee;
        this.shippingFee = shippingFee;
        this.deliveryMethod = deliveryMethod;
        this.deliveryStatus = deliveryStatus;
        this.paymentStatus = paymentStatus;
        this.phoneNumber = phoneNumber;
        this.customerEmail = customerEmail;
        this.customerName = customerName;
        this.destinationAddress = destinationAddress;
    }

    // Getters and Setters
    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public LocalDateTime getOrderTimestamp() {
        return orderTimestamp;
    }

    public void setOrderTimestamp(LocalDateTime orderTimestamp) {
        this.orderTimestamp = orderTimestamp;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
    }

    public BigDecimal getTax() {
        return tax;
    }

    public void setTax(BigDecimal tax) {
        this.tax = tax;
    }

    public BigDecimal getPlatformFee() {
        return platformFee;
    }

    public void setPlatformFee(BigDecimal platformFee) {
        this.platformFee = platformFee;
    }

    public BigDecimal getShippingFee() {
        return shippingFee;
    }

    public void setShippingFee(BigDecimal shippingFee) {
        this.shippingFee = shippingFee;
    }

    public String getDeliveryMethod() {
        return deliveryMethod;
    }

    public void setDeliveryMethod(String deliveryMethod) {
        this.deliveryMethod = deliveryMethod;
    }

    public String getDeliveryStatus() {
        return deliveryStatus;
    }

    public void setDeliveryStatus(String deliveryStatus) {
        this.deliveryStatus = deliveryStatus;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getDestinationAddress() {
        return destinationAddress;
    }

    public void setDestinationAddress(String destinationAddress) {
        this.destinationAddress = destinationAddress;
    }
}
