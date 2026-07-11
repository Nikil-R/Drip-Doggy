package com.dripdoggy.backend.exception;

public class MissingRefundProofException extends RuntimeException {
    public MissingRefundProofException(String message) {
        super(message);
    }
}
