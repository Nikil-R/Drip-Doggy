package com.dripdoggy.backend.ResponseDto;

import java.util.List;

public class CustomerListResponseDto {
    private int status;
    private String message;
    private List<CustomerListItemDto> data;

    public CustomerListResponseDto() {
    }

    public CustomerListResponseDto(int status, String message, List<CustomerListItemDto> data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    // Getters and Setters
    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<CustomerListItemDto> getData() {
        return data;
    }

    public void setData(List<CustomerListItemDto> data) {
        this.data = data;
    }
}
