package com.dripdoggy.backend.exception;

public class MissingTrackingNumberException extends RuntimeException {
    public MissingTrackingNumberException(String message) {
        super(message);
    }
}
