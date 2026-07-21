package com.dripdoggy.backend.RequestDto;

import com.dripdoggy.backend.enums.DeliveryStatus;
import com.dripdoggy.backend.enums.PaymentStatus;

public class PaymentSettlementRequestDto {

    private PaymentStatus paymentStatus;
    private DeliveryStatus deliveryStatus;
    private String notes; // Defaults to "Cash collected" if null or empty

    public PaymentSettlementRequestDto() {
    }

    public PaymentSettlementRequestDto(PaymentStatus paymentStatus, DeliveryStatus deliveryStatus, String notes) {
        this.paymentStatus = paymentStatus;
        this.deliveryStatus = deliveryStatus;
        this.notes = notes;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public DeliveryStatus getDeliveryStatus() {
        return deliveryStatus;
    }

    public void setDeliveryStatus(DeliveryStatus deliveryStatus) {
        this.deliveryStatus = deliveryStatus;
    }

    public String getNotes() {
        if (notes == null || notes.trim().isEmpty()) {
            return "Cash collected";
        }
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
