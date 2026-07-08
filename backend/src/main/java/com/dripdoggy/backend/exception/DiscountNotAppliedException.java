package com.dripdoggy.backend.exception;

public class DiscountNotAppliedException extends RuntimeException {
    public DiscountNotAppliedException(String message) {
        super(message);
    }
}
