package com.dripdoggy.backend.ResponseDto;

import java.util.List;

public class CategoryListResponseDto {
    private String message;
    private Integer status;
    private List<CategoryResponseDto> details;

    public CategoryListResponseDto() {
    }

    public CategoryListResponseDto(Integer status, String message, List<CategoryResponseDto> details) {
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

    public List<CategoryResponseDto> getDetails() {
        return details;
    }

    public void setDetails(List<CategoryResponseDto> details) {
        this.details = details;
    }
}
