package com.dripdoggy.backend.ResponseDto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthResponse {
	private Integer statusCode;
	private String message;
	private String token;
	private Boolean userExists;
	private UserDto user;

	public Integer getStatusCode() {
		return statusCode;
	}

	public void setStatusCode(Integer statusCode) {
		this.statusCode = statusCode;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public Boolean getUserExists() {
		return userExists;
	}

	public void setUserExists(Boolean userExists) {
		this.userExists = userExists;
	}

	public AuthResponse(Integer statusCode, String message, String token) {
		super();
		this.statusCode = statusCode;
		this.message = message;
		this.token = token;
	}

	public AuthResponse(Integer statusCode, String message, String token, Boolean userExists) {
		super();
		this.statusCode = statusCode;
		this.message = message;
		this.token = token;
		this.userExists = userExists;
	}

	public AuthResponse() {
		super();
		// TODO Auto-generated constructor stub
	}

	public UserDto getUser() {
		return user;
	}

	public void setUser(UserDto user) {
		this.user = user;
	}
}
