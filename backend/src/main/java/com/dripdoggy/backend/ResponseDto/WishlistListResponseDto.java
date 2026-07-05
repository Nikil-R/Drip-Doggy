package com.dripdoggy.backend.ResponseDto;

import java.util.List;

public class WishlistListResponseDto {
    private int status;
    private String message;
    private List<WishlistResponseDto> data;

    public WishlistListResponseDto() {
    }

    public WishlistListResponseDto(int status, String message, List<WishlistResponseDto> data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

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

    public List<WishlistResponseDto> getData() {
        return data;
    }

    public void setData(List<WishlistResponseDto> data) {
        this.data = data;
    }
}
