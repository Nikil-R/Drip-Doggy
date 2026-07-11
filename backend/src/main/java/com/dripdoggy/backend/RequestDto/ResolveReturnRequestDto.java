package com.dripdoggy.backend.RequestDto;

import jakarta.validation.constraints.NotBlank;
import org.springframework.web.multipart.MultipartFile;

public class ResolveReturnRequestDto {
    @NotBlank(message = "Action is required")
    private String action;
    private String trackingNumber;
    private MultipartFile proofImage;

    public ResolveReturnRequestDto() {
    }

    public ResolveReturnRequestDto(String action, String trackingNumber, MultipartFile proofImage) {
        this.action = action;
        this.trackingNumber = trackingNumber;
        this.proofImage = proofImage;
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

    public MultipartFile getProofImage() {
        return proofImage;
    }

    public void setProofImage(MultipartFile proofImage) {
        this.proofImage = proofImage;
    }
}
