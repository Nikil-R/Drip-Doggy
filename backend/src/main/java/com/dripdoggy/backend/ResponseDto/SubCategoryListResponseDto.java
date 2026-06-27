package com.dripdoggy.backend.ResponseDto;

import java.util.List;

public class SubCategoryListResponseDto {
    private Integer status;
    private String message;
    private List<SubCategoryResponseDto> details;

    public SubCategoryListResponseDto() {
    }

    public SubCategoryListResponseDto(Integer status, String message, List<SubCategoryResponseDto> details) {
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

    public List<SubCategoryResponseDto> getDetails() {
        return details;
    }

    public void setDetails(List<SubCategoryResponseDto> details) {
        this.details = details;
    }
}
