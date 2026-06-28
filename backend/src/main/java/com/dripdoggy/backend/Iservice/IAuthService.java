package com.dripdoggy.backend.Iservice;

import com.dripdoggy.backend.RequestDto.SignupRequest;
import com.dripdoggy.backend.RequestDto.VerifyOtpRequest;
import com.dripdoggy.backend.ResponseDto.AuthResponse;

import com.dripdoggy.backend.RequestDto.RegisterRequest;

public interface IAuthService {
    AuthResponse sendOtp(SignupRequest request);
    AuthResponse verifyOtp(VerifyOtpRequest request);
    AuthResponse register(RegisterRequest request);
    AuthResponse logout();
}
