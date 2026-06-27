package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.RequestDto.SignupRequest;
import com.dripdoggy.backend.RequestDto.VerifyOtpRequest;
import com.dripdoggy.backend.ResponseDto.AuthResponse;
import com.dripdoggy.backend.entity.User;
import com.dripdoggy.backend.enums.OtpType;
import com.dripdoggy.backend.enums.UserRole;
import com.dripdoggy.backend.repository.UserRepository;
import com.dripdoggy.backend.entity.Token;
import com.dripdoggy.backend.repository.TokenRepository;
import com.dripdoggy.backend.security.JwtUtil;
import com.dripdoggy.backend.serviceImpl.OtpService;
import jakarta.validation.Valid;
import com.dripdoggy.backend.exception.InvalidCredentialsException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private OtpService otpService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/send-otp")
    public ResponseEntity<AuthResponse> sendOtp(@Valid @RequestBody SignupRequest request) {
        String identifier = request.getIdentifier();
        if (identifier == null || identifier.isEmpty()) {
            return ResponseEntity.badRequest().body(new AuthResponse(400, "Provide a valid email or phone number", null));
        }

        if (identifier.contains("@")) {
            otpService.generateAndSendOtp(identifier, OtpType.EMAIL);
            return ResponseEntity.ok(new AuthResponse(200, "OTP sent to email", null));
        } else {
            otpService.generateAndSendOtp(identifier, OtpType.PHONE);
            return ResponseEntity.ok(new AuthResponse(200, "OTP sent to phone", null));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        String identifier = request.getIdentifier();
        if (identifier == null || identifier.isEmpty() || request.getOtpCode() == null) {
            return ResponseEntity.badRequest().body(new AuthResponse(400, "Provide identifier and OTP code", null));
        }

        OtpType otpType = identifier.contains("@") ? OtpType.EMAIL : OtpType.PHONE;
        boolean verified = otpService.verifyOtp(identifier, otpType, request.getOtpCode());

        if (verified) {
            // Find or create user
            Optional<User> userOpt = otpType == OtpType.EMAIL ? 
                    userRepository.findByEmail(identifier) : 
                    userRepository.findByPhoneNo(identifier);
            
            User user;
            if (userOpt.isEmpty()) {
                user = new User();
                user.setEmail(otpType == OtpType.EMAIL ? identifier : null);
                user.setPhoneNo(otpType == OtpType.PHONE ? identifier : null);
                user.setRole(UserRole.CUSTOMER); // default role
                userRepository.save(user);
            } else {
                user = userOpt.get();
            }

            String token = jwtUtil.generateToken(identifier);

            Token tokenEntity = new Token();
            tokenEntity.setUser(user);
            tokenEntity.setAccessToken(token);
            tokenEntity.setCreatedAt(LocalDateTime.now());
            tokenEntity.setExpiresAt(LocalDateTime.now().plusDays(365));
            tokenRepository.save(tokenEntity);

            return ResponseEntity.ok(new AuthResponse(200, "OTP Verified Successfully", token));
        }

        throw new InvalidCredentialsException("Invalid or Expired OTP");
    }

    @PostMapping("/admin/send-otp")
    public ResponseEntity<AuthResponse> sendAdminOtp(@Valid @RequestBody SignupRequest request) {
        String identifier = request.getIdentifier();
        if (identifier == null || identifier.isEmpty()) {
            return ResponseEntity.badRequest().body(new AuthResponse(400, "Provide a valid email or phone number", null));
        }

        if (identifier.contains("@")) {
            otpService.generateAndSendOtp(identifier, OtpType.EMAIL);
            return ResponseEntity.ok(new AuthResponse(200, "Admin OTP sent to email", null));
        } else {
            otpService.generateAndSendOtp(identifier, OtpType.PHONE);
            return ResponseEntity.ok(new AuthResponse(200, "Admin OTP sent to phone", null));
        }
    }

    @PostMapping("/admin/verify-otp")
    public ResponseEntity<AuthResponse> verifyAdminOtp(@Valid @RequestBody VerifyOtpRequest request) {
        String identifier = request.getIdentifier();
        if (identifier == null || identifier.isEmpty() || request.getOtpCode() == null) {
            return ResponseEntity.badRequest().body(new AuthResponse(400, "Provide identifier and OTP code", null));
        }

        OtpType otpType = identifier.contains("@") ? OtpType.EMAIL : OtpType.PHONE;
        boolean verified = otpService.verifyOtp(identifier, otpType, request.getOtpCode());

        if (verified) {
            // Find or create admin user
            Optional<User> userOpt = otpType == OtpType.EMAIL ? 
                    userRepository.findByEmail(identifier) : 
                    userRepository.findByPhoneNo(identifier);
            
            User user;
            if (userOpt.isEmpty()) {
                user = new User();
                user.setEmail(otpType == OtpType.EMAIL ? identifier : null);
                user.setPhoneNo(otpType == OtpType.PHONE ? identifier : null);
                user.setRole(UserRole.ADMIN); // Force ADMIN role
                userRepository.save(user);
            } else {
                user = userOpt.get();
                if (user.getRole() != UserRole.ADMIN) {
                    user.setRole(UserRole.ADMIN); // Force/Upgrade to ADMIN role for admin portal sign-in
                    userRepository.save(user);
                }
            }

            String token = jwtUtil.generateToken(identifier);

            Token tokenEntity = new Token();
            tokenEntity.setUser(user);
            tokenEntity.setAccessToken(token);
            tokenEntity.setCreatedAt(LocalDateTime.now());
            tokenEntity.setExpiresAt(LocalDateTime.now().plusDays(365));
            tokenRepository.save(tokenEntity);

            return ResponseEntity.ok(new AuthResponse(200, "Admin OTP Verified Successfully", token));
        }

        throw new InvalidCredentialsException("Invalid or Expired OTP");
    }
}
