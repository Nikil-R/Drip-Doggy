package com.dripdoggy.backend.exception;

public class DuplicateProductSkuException extends RuntimeException {
    public DuplicateProductSkuException(String message) {
        super(message);
    }
}
