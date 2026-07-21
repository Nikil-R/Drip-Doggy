package com.dripdoggy.backend.ResponseDto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentItemDto {

    private String orderNumber;
    private String customerName;
    private String paymentType;
    private BigDecimal amount;
    private LocalDateTime orderDate;
    private String paymentStatus;
    private String bankSettlementStatus;

    public PaymentItemDto() {
    }

    public PaymentItemDto(String orderNumber, String customerName, String paymentType, BigDecimal amount, LocalDateTime orderDate, String paymentStatus, String bankSettlementStatus) {
        this.orderNumber = orderNumber;
        this.customerName = customerName;
        this.paymentType = paymentType;
        this.amount = amount;
        this.orderDate = orderDate;
        this.paymentStatus = paymentStatus;
        this.bankSettlementStatus = bankSettlementStatus;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getPaymentType() {
        return paymentType;
    }

    public void setPaymentType(String paymentType) {
        this.paymentType = paymentType;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getBankSettlementStatus() {
        return bankSettlementStatus;
    }

    public void setBankSettlementStatus(String bankSettlementStatus) {
        this.bankSettlementStatus = bankSettlementStatus;
    }
}
