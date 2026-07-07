package com.dripdoggy.backend.exception;

public class CouponFirstOrderOnlyException extends RuntimeException {

    public CouponFirstOrderOnlyException(String message) {
        super(message);
    }
}
