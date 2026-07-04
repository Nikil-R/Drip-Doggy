package com.dripdoggy.backend.ResponseDto;

import java.util.List;

public class ProductListResponseDto {
    private int status;
    private String message;
    private List<ProductResponseDto> details;

    // Constructors
    public ProductListResponseDto() {
    }

    public ProductListResponseDto(int status, String message, List<ProductResponseDto> details) {
        this.status = status;
        this.message = message;
        this.details = details;
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

    public List<ProductResponseDto> getDetails() {
        return details;
    }

    public void setDetails(List<ProductResponseDto> details) {
        this.details = details;
    }
}
