package com.dripdoggy.backend.ResponseDto;

import java.util.List;

public class CartListResponseDto {
    private Integer status;
    private String message;
    private List<CartResponseDto> cartItems;

    public CartListResponseDto() {
    }

    public CartListResponseDto(Integer status, String message, List<CartResponseDto> cartItems) {
        this.status = status;
        this.message = message;
        this.cartItems = cartItems;
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

    public List<CartResponseDto> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<CartResponseDto> cartItems) {
        this.cartItems = cartItems;
    }
}
