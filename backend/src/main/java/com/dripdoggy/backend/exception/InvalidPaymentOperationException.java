package com.dripdoggy.backend.exception;

public class InvalidPaymentOperationException extends RuntimeException {

    public InvalidPaymentOperationException(String message) {
        super(message);
    }
}
