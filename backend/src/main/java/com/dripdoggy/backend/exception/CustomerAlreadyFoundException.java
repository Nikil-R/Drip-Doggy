package com.dripdoggy.backend.exception;

public class CustomerAlreadyFoundException extends RuntimeException {
    public CustomerAlreadyFoundException(String message) {
        super(message);
    }
}
