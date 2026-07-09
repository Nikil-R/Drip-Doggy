package com.dripdoggy.backend.ResponseDto;

import java.math.BigDecimal;

public class OrderPreviewResponseDto {
    private BigDecimal subTotal;
    private BigDecimal discount;
    private BigDecimal tax;
    private BigDecimal shippingFee;
    private BigDecimal grandTotal;

    // Constructors
    public OrderPreviewResponseDto() {
    }

    public OrderPreviewResponseDto(BigDecimal subTotal, BigDecimal discount, BigDecimal tax, BigDecimal shippingFee, BigDecimal grandTotal) {
        this.subTotal = subTotal;
        this.discount = discount;
        this.tax = tax;
        this.shippingFee = shippingFee;
        this.grandTotal = grandTotal;
    }

    // Getters and Setters
    public BigDecimal getSubTotal() {
        return subTotal;
    }

    public void setSubTotal(BigDecimal subTotal) {
        this.subTotal = subTotal;
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

    public BigDecimal getShippingFee() {
        return shippingFee;
    }

    public void setShippingFee(BigDecimal shippingFee) {
        this.shippingFee = shippingFee;
    }

    public BigDecimal getGrandTotal() {
        return grandTotal;
    }

    public void setGrandTotal(BigDecimal grandTotal) {
        this.grandTotal = grandTotal;
    }
}
