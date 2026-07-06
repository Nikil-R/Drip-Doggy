package com.dripdoggy.backend.exception;

public class ProductVariantSizeNotFoundException extends RuntimeException {
    public ProductVariantSizeNotFoundException(String message) {
        super(message);
    }
}
