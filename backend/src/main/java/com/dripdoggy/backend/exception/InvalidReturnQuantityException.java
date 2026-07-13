package com.dripdoggy.backend.exception;

public class InvalidReturnQuantityException extends RuntimeException {
    public InvalidReturnQuantityException(int purchased, int requested, int alreadyReturned) {
        super(String.format(
            "Invalid quantity requested. You purchased only %d item(s). " +
            "You have already returned/exchanged %d. You can only return/exchange up to %d remaining item(s).",
            purchased, alreadyReturned, (purchased - alreadyReturned)
        ));
    }
}
