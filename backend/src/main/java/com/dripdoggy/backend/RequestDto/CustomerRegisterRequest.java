package com.dripdoggy.backend.RequestDto;

import jakarta.validation.constraints.NotBlank;

public class CustomerRegisterRequest {

    @NotBlank(message = "FirstName is required")
    private String firstName;
    
    @NotBlank(message = "LastName is required")
    private String lastName;
    
    @NotBlank(message = "DOB is required")
    private String dob;
    
    @NotBlank(message = "Gender is required")
    private String gender;

    public CustomerRegisterRequest() {
    }

    public CustomerRegisterRequest(String firstName, String lastName, String dob, String gender) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
        this.gender = gender;
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
