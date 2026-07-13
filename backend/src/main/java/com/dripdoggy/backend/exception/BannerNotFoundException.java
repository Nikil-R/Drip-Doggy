package com.dripdoggy.backend.exception;

public class BannerNotFoundException extends RuntimeException {
    public BannerNotFoundException(String message) {
        super(message);
    }
}
