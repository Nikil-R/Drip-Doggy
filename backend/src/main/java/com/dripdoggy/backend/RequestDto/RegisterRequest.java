package com.dripdoggy.backend.RequestDto;

import com.dripdoggy.backend.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class RegisterRequest {

    private String email;

    private String phoneNo;

    @NotBlank(message = "FirstName is required")
    private String firstName;
    
    @NotBlank(message = "LastName is required")
    private String lastName;
    
    private UserRole role;

    @NotBlank(message = "DOB is required")
    private String dob;
    
    @NotBlank(message = "Gender is required")
    private String gender;

    public RegisterRequest() {
    }

    public RegisterRequest(String email, String phoneNo, String firstName, String lastName, UserRole role) {
        this.email = email;
        this.phoneNo = phoneNo;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }

    public RegisterRequest(String email, String phoneNo, String firstName, String lastName, UserRole role, String dob, String gender) {
        this.email = email;
        this.phoneNo = phoneNo;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.dob = dob;
        this.gender = gender;
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

    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }
}
