package com.dripdoggy.backend.RequestDto;

import com.dripdoggy.backend.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class RegisterRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Provide a valid email address")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Provide a valid phone number")
    private String phoneNo;

    @NotBlank(message = "FirstName is required")
    private String firstName;
    
    @NotBlank(message = "LastName is required")
    private String lastName;
    
    private UserRole role;

    public RegisterRequest() {
    }

    public RegisterRequest(String email, String phoneNo, String firstName, String lastName, UserRole role) {
        this.email = email;
        this.phoneNo = phoneNo;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNo() {
        return phoneNo;
    }

    public void setPhoneNo(String phoneNo) {
        this.phoneNo = phoneNo;
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

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}
