package com.dripdoggy.backend.ResponseDto;

public class CategoryDetailsResponseDto {
    private String message;
    private Integer status;
    private CategoryResponseDto details;

    public CategoryDetailsResponseDto() {
    }

    public CategoryDetailsResponseDto(Integer status, String message, CategoryResponseDto details) {
        this.status = status;
        this.message = message;
        this.details = details;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public CategoryResponseDto getDetails() {
        return details;
    }

    public void setDetails(CategoryResponseDto details) {
        this.details = details;
    }
}
