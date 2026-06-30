package com.dripdoggy.backend.Iservice;

import com.dripdoggy.backend.RequestDto.SignupRequest;
import com.dripdoggy.backend.RequestDto.VerifyOtpRequest;
import com.dripdoggy.backend.ResponseDto.AuthResponse;
import com.dripdoggy.backend.ResponseDto.CustomerRegisterResponse;
import com.dripdoggy.backend.RequestDto.RegisterRequest;
import com.dripdoggy.backend.RequestDto.CustomerRegisterRequest;

public interface IAuthService {
    AuthResponse sendOtp(SignupRequest request);
    AuthResponse verifyOtp(VerifyOtpRequest request);
    CustomerRegisterResponse register(RegisterRequest request); // i this not requried
    CustomerRegisterResponse registerCustomer(CustomerRegisterRequest request);
    AuthResponse logout();
    AuthResponse sendAdminOtp(SignupRequest request);
    AuthResponse verifyAdminOtp(VerifyOtpRequest request);
}
