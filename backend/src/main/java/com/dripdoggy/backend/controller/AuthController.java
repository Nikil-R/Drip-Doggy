package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.IAuthService;
import com.dripdoggy.backend.RequestDto.SignupRequest;
import com.dripdoggy.backend.RequestDto.VerifyOtpRequest;
import com.dripdoggy.backend.RequestDto.RegisterRequest;
import com.dripdoggy.backend.ResponseDto.AuthResponse;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dripdoggy.backend.enums.UserRole;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private IAuthService authService;

    @PostMapping("/send-otp")
    public ResponseEntity<AuthResponse> sendOtp(@Valid @RequestBody SignupRequest request) {
        AuthResponse response = authService.sendOtp(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        AuthResponse response = authService.verifyOtp(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        request.setRole(UserRole.CUSTOMER);
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(201).body(response);
    }

    @PostMapping("/admin/register")
    public ResponseEntity<ResponseMsgDto> registerAdmin(@Valid @RequestBody RegisterRequest request) {
        request.setRole(UserRole.ADMIN);
        authService.register(request);
        ResponseMsgDto response = new ResponseMsgDto(201, "Admin registered successfully.");
        return ResponseEntity.status(201).body(response);
    }

    @PostMapping("/admin/send-otp")
    public ResponseEntity<AuthResponse> sendAdminOtp(@Valid @RequestBody SignupRequest request) {
        AuthResponse response = authService.sendAdminOtp(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/admin/verify-otp")
    public ResponseEntity<AuthResponse> verifyAdminOtp(@Valid @RequestBody VerifyOtpRequest request) {
        AuthResponse response = authService.verifyAdminOtp(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout() {
        AuthResponse response = authService.logout();
        return ResponseEntity.ok(response);
    }
}
