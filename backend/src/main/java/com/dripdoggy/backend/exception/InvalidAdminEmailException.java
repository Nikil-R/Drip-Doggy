package com.dripdoggy.backend.exception;

public class InvalidAdminEmailException extends RuntimeException {
    public InvalidAdminEmailException(String message) {
        super(message);
    }
}
