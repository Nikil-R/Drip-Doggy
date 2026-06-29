package com.dripdoggy.backend.exception;

public class DuplicateCategoryFoundException extends RuntimeException {
    public DuplicateCategoryFoundException(String message) {
        super(message);
    }
}
