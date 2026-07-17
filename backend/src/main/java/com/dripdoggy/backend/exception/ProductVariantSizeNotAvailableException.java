package com.dripdoggy.backend.exception;

public class ProductVariantSizeNotAvailableException extends RuntimeException {
    public ProductVariantSizeNotAvailableException(String message) {
        super(message);
    }
}
