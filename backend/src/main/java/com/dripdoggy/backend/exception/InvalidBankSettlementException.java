package com.dripdoggy.backend.exception;

public class InvalidBankSettlementException extends RuntimeException {

    public InvalidBankSettlementException(String message) {
        super(message);
    }
}
