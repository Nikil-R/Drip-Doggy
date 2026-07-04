package com.dripdoggy.backend.ResponseDto;

public class ProductDetailsResponseDto {
    private int status;
    private String message;
    private ProductResponseDto details;

    // Constructors
    public ProductDetailsResponseDto() {
    }

    public ProductDetailsResponseDto(int status, String message, ProductResponseDto details) {
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

    public ProductResponseDto getDetails() {
        return details;
    }

    public void setDetails(ProductResponseDto details) {
        this.details = details;
    }
}
