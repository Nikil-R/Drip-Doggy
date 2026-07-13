package com.dripdoggy.backend.exception;

public class OrderAlreadyPackedException extends RuntimeException {
    public OrderAlreadyPackedException(String message) {
        super(message);
    }
}
