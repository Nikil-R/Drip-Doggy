package com.dripdoggy.backend.RequestDto;

import jakarta.validation.constraints.NotBlank;

public class VerifyOtpRequest {
	@NotBlank(message = "Email or phone number is required")
	private String identifier;

	@NotBlank(message = "OTP code is required")
	private String otpCode;

	public String getIdentifier() {
		return identifier;
	}

	public void setIdentifier(String identifier) {
		this.identifier = identifier;
	}

	public String getOtpCode() {
		return otpCode;
	}

	public void setOtpCode(String otpCode) {
		this.otpCode = otpCode;
	}

}
