package com.dripdoggy.backend.exception;

public class CannotDeleteBundleException extends RuntimeException {
    public CannotDeleteBundleException(String message) {
        super(message);
    }
}
