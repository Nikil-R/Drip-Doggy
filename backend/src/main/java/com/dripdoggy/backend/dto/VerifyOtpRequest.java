package com.dripdoggy.backend.dto;

import lombok.Data;

@Data
public class VerifyOtpRequest {
    private String identifier;
    private String otpCode;
}
