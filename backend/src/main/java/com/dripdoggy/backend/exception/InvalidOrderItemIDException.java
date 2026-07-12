package com.dripdoggy.backend.exception;

public class InvalidOrderItemIDException extends RuntimeException {
    public InvalidOrderItemIDException(String message) {
        super(message);
    }
}
