package com.dripdoggy.backend.RequestDto;

import jakarta.validation.constraints.NotBlank;

public class SignupRequest {
	@NotBlank(message = "Email or phone number is required")
	private String identifier;

	public String getIdentifier() {
		return identifier;
	}

	public void setIdentifier(String identifier) {
		this.identifier = identifier;
	}

}
