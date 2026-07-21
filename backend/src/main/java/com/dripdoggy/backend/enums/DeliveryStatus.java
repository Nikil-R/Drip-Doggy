package com.dripdoggy.backend.enums;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonCreator;

@JsonFormat(with = JsonFormat.Feature.ACCEPT_CASE_INSENSITIVE_VALUES)
public enum DeliveryStatus {
	PLACED,
	PROCESSING,
	PACKED,
	SHIPPED,
	OUT_FOR_DELIVERY,
	DELIVERED,
	CANCELLED,
	
	RETURN_INITIATED,
	RETURN_PICKUPED,
	RETURN_SHIPPED,
	RETURN_OUT_OF_DELIVERY,
	RETURN_DELIVERED,
	
	EXCHANGE_INITIATED,
	EXCHANGE_PICKUPED,
	EXCHANGE_SHIPPED,
	EXCHANGE_PACKED,
	EXCHANGE_DELIVERED,
	
	PENDING;

	@JsonCreator
	public static DeliveryStatus fromString(String value) {
		if (value == null || value.trim().isEmpty()) {
			return null;
		}
		// Convert spaces and hyphens to underscores, and trim/uppercase for standard enum parsing
		String normalized = value.trim().toUpperCase().replace(" ", "_").replace("-", "_");
		try {
			return DeliveryStatus.valueOf(normalized);
		} catch (IllegalArgumentException e) {
			throw new IllegalArgumentException("Unknown delivery status: " + value);
		}
	}
}
