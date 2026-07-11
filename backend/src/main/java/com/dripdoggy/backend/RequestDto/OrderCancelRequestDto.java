package com.dripdoggy.backend.RequestDto;

import jakarta.validation.constraints.NotBlank;

public class OrderCancelRequestDto {
    @NotBlank(message = "Cancellation reason is required")
    private String reason;

    public OrderCancelRequestDto() {
    }

    public OrderCancelRequestDto(String reason) {
        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
