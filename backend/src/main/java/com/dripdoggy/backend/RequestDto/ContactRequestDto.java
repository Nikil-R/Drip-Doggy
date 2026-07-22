package com.dripdoggy.backend.RequestDto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class ContactRequestDto {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String orderId;

    @NotBlank(message = "Message content is required")
    private String message;

    public ContactRequestDto() {}

    public ContactRequestDto(String firstName, String lastName, String email, String orderId, String message) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.orderId = orderId;
        this.message = message;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
