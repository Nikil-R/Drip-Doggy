package com.dripdoggy.backend.exception;

public class ReviewImageLimitExceededException extends RuntimeException {
    public ReviewImageLimitExceededException(String message) {
        super(message);
    }
}
