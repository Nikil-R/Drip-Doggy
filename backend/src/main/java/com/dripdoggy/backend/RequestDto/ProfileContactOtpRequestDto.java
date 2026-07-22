package com.dripdoggy.backend.RequestDto;

import com.dripdoggy.backend.enums.OtpType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ProfileContactOtpRequestDto {

    @NotBlank(message = "New target email or phone number is required")
    private String targetValue;

    @NotNull(message = "OTP type (EMAIL or PHONE) is required")
    private OtpType otpType;

    public ProfileContactOtpRequestDto() {
    }

    public ProfileContactOtpRequestDto(String targetValue, OtpType otpType) {
        this.targetValue = targetValue;
        this.otpType = otpType;
    }

    public String getTargetValue() {
        return targetValue;
    }

    public void setTargetValue(String targetValue) {
        this.targetValue = targetValue;
    }

    public OtpType getOtpType() {
        return otpType;
    }

    public void setOtpType(OtpType otpType) {
        this.otpType = otpType;
    }
}
