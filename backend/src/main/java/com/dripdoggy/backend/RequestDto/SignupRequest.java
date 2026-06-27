package com.dripdoggy.backend.RequestDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class SignupRequest {

    @NotBlank(message = "Email or phone number is required")
    @Pattern(regexp = "^([a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6})|([0-9]{10,15})$", message = "Provide a valid email or phone number")
    private String identifier;

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }
}
