package com.dripdoggy.backend.RequestDto;

import com.dripdoggy.backend.enums.DeliveryStatus;

public class StatusUpdateRequest {
    private DeliveryStatus status;

    public StatusUpdateRequest() {
    }

    public StatusUpdateRequest(DeliveryStatus status) {
        this.status = status;
    }

    public DeliveryStatus getStatus() {
        return status;
    }

    public void setStatus(DeliveryStatus status) {
        this.status = status;
    }
}
