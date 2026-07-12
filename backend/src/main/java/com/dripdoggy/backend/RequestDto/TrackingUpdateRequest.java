package com.dripdoggy.backend.RequestDto;

public class TrackingUpdateRequest {
    private String trackingNumber;

    public TrackingUpdateRequest() {
    }

    public TrackingUpdateRequest(String trackingNumber) {
        this.trackingNumber = trackingNumber;
    }

    public String getTrackingNumber() {
        return trackingNumber;
    }

    public void setTrackingNumber(String trackingNumber) {
        this.trackingNumber = trackingNumber;
    }
}
