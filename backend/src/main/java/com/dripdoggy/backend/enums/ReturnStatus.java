package com.dripdoggy.backend.enums;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(with = JsonFormat.Feature.ACCEPT_CASE_INSENSITIVE_VALUES)
public enum ReturnStatus {
    PENDING,
    APPROVED,
    REJECTED,
    RECEIVED,
    REFUND_COMPLETED,
    EXCHANGE_COMPLETED,
    REPLACEMENT_UNAVAILABLE,
    CLOSED_UNAVAILABLE_NO_REFUND
}
