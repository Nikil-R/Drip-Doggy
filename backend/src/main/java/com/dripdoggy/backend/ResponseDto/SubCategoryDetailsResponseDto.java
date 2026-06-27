package com.dripdoggy.backend.ResponseDto;

public class SubCategoryDetailsResponseDto {
    private Integer status;
    private String message;
    private SubCategoryResponseDto details;

    public SubCategoryDetailsResponseDto() {
    }

    public SubCategoryDetailsResponseDto(Integer status, String message, SubCategoryResponseDto details) {
        this.status = status;
        this.message = message;
        this.details = details;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public SubCategoryResponseDto getDetails() {
        return details;
    }

    public void setDetails(SubCategoryResponseDto details) {
        this.details = details;
    }
}
