package com.dripdoggy.backend.RequestDto;

import com.dripdoggy.backend.enums.OtpType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class ProfileContactOtpVerifyDto {

    @NotBlank(message = "New target email or phone number is required")
    private String targetValue;

    @NotNull(message = "OTP type (EMAIL or PHONE) is required")
    private OtpType otpType;

    @NotBlank(message = "OTP code is required")
    @Pattern(regexp = "^\\d{6}$", message = "OTP code must be exactly 6 digits")
    private String otpCode;

    public ProfileContactOtpVerifyDto() {
    }

    public ProfileContactOtpVerifyDto(String targetValue, OtpType otpType, String otpCode) {
        this.targetValue = targetValue;
        this.otpType = otpType;
        this.otpCode = otpCode;
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

    public String getOtpCode() {
        return otpCode;
    }

    public void setOtpCode(String otpCode) {
        this.otpCode = otpCode;
    }
}
