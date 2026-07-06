package com.dripdoggy.backend.ResponseDto;

import java.util.List;

public class AddressListResponseDto {

    private int status;
    private String message;
    private List<AddressResponseDto> data;

    public AddressListResponseDto() {
    }

    public AddressListResponseDto(int status, String message, List<AddressResponseDto> data) {
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

    public List<AddressResponseDto> getData() {
        return data;
    }

    public void setData(List<AddressResponseDto> data) {
        this.data = data;
    }
}
