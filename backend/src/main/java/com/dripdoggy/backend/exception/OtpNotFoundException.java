package com.dripdoggy.backend.exception;

public class OtpNotFoundException extends RuntimeException {
    public OtpNotFoundException(String message) {
        super(message);
    }
}
