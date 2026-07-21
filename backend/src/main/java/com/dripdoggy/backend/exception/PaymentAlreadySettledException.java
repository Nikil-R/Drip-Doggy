package com.dripdoggy.backend.exception;

public class PaymentAlreadySettledException extends RuntimeException {

    public PaymentAlreadySettledException(String message) {
        super(message);
    }
}
