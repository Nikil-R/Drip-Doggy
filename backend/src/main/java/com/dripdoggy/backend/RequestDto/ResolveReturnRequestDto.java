package com.dripdoggy.backend.RequestDto;

import jakarta.validation.constraints.NotBlank;

public class ResolveReturnRequestDto {
    @NotBlank(message = "Action is required")
    private String action;
    private String trackingNumber;
    private String transactionId;

    public ResolveReturnRequestDto() {
    }

    public ResolveReturnRequestDto(String action, String trackingNumber, String transactionId) {
        this.action = action;
        this.trackingNumber = trackingNumber;
        this.transactionId = transactionId;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getTrackingNumber() {
        return trackingNumber;
    }

    public void setTrackingNumber(String trackingNumber) {
        this.trackingNumber = trackingNumber;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }
}
