package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.IAuthService;
import com.dripdoggy.backend.RequestDto.SignupRequest;
import com.dripdoggy.backend.RequestDto.VerifyOtpRequest;
import com.dripdoggy.backend.RequestDto.RegisterRequest;
import com.dripdoggy.backend.RequestDto.CustomerRegisterRequest;
import com.dripdoggy.backend.ResponseDto.AuthResponse;
import com.dripdoggy.backend.ResponseDto.CustomerRegisterResponse;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.ResponseDto.UserDto;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dripdoggy.backend.enums.UserRole;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private IAuthService authService;

    //Generic for ALL
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
    public ResponseEntity<CustomerRegisterResponse> register(@Valid @RequestBody CustomerRegisterRequest request) {
        CustomerRegisterResponse response = authService.registerCustomer(request);
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

    @GetMapping("/admin/list")
    public ResponseEntity<List<UserDto>> fetchAllAdmins() {
        List<UserDto> response = authService.fetchAllAdmins();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/me")
    public ResponseEntity<UserDto> getAdminProfile() {
        UserDto response = authService.getAdminProfile();
        return ResponseEntity.ok(response);
    }
}
