package com.dripdoggy.backend.exception;

public class FailedToUploadImageException extends RuntimeException {

	public FailedToUploadImageException(String message) {
		super(message);
	}

}
