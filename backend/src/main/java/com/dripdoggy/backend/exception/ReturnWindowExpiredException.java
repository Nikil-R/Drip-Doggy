package com.dripdoggy.backend.exception;

public class ReturnWindowExpiredException extends RuntimeException {
    public ReturnWindowExpiredException(String message) {
        super(message);
    }
}
