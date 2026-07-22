package com.dripdoggy.backend.ResponseDto;

public class CustomerProfileResponseDto {

    private int statusCode;
    private String message;
    private Data data;

    public CustomerProfileResponseDto() {
    }

    public CustomerProfileResponseDto(int statusCode, String message, Data data) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Data getData() {
        return data;
    }

    public void setData(Data data) {
        this.data = data;
    }

    public static class Data {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private String phoneNo;
        private String gender;
        private String dob;
        private String registrationMethod;

        public Data() {
        }

        public Data(Long id, String firstName, String lastName, String email, String phoneNo, String gender, String dob, String registrationMethod) {
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.phoneNo = phoneNo;
            this.gender = gender;
            this.dob = dob;
            this.registrationMethod = registrationMethod;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
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

        public String getPhoneNo() {
            return phoneNo;
        }

        public void setPhoneNo(String phoneNo) {
            this.phoneNo = phoneNo;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

        public String getDob() {
            return dob;
        }

        public void setDob(String dob) {
            this.dob = dob;
        }

        public String getRegistrationMethod() {
            return registrationMethod;
        }

        public void setRegistrationMethod(String registrationMethod) {
            this.registrationMethod = registrationMethod;
        }
    }
}
