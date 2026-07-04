package com.dripdoggy.backend.exception;

public class InvalidImageDimensionException extends RuntimeException {
    public InvalidImageDimensionException(String message) {
        super(message);
    }
}
