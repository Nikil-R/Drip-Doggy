package com.dripdoggy.backend.exception;

public class ReturnRequestAlreadyResolvedException extends RuntimeException {
    public ReturnRequestAlreadyResolvedException(String message) {
        super(message);
    }
}
