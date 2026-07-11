package com.dripdoggy.backend.enums;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(with = JsonFormat.Feature.ACCEPT_CASE_INSENSITIVE_VALUES)
public enum ReturnRequestType {
    RETURN, EXCHANGE
}
