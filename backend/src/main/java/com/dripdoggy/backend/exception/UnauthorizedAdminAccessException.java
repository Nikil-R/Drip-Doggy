package com.dripdoggy.backend.exception;

public class UnauthorizedAdminAccessException extends RuntimeException {

    public UnauthorizedAdminAccessException(String message) {
        super(message);
    }
}
