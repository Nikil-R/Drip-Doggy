package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.dto.AuthResponse;
import com.dripdoggy.backend.dto.SignupRequest;
import com.dripdoggy.backend.dto.VerifyOtpRequest;
import com.dripdoggy.backend.entity.User;
import com.dripdoggy.backend.enums.OtpType;
import com.dripdoggy.backend.enums.UserRole;
import com.dripdoggy.backend.repository.UserRepository;
import com.dripdoggy.backend.entity.Token;
import com.dripdoggy.backend.repository.TokenRepository;
import com.dripdoggy.backend.security.JwtUtil;
import com.dripdoggy.backend.service.OtpService;
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
    public ResponseEntity<AuthResponse> sendOtp(@RequestBody SignupRequest request) {
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
    public ResponseEntity<AuthResponse> verifyOtp(@RequestBody VerifyOtpRequest request) {
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
                user = User.builder()
                        .email(otpType == OtpType.EMAIL ? identifier : null)
                        .phoneNo(otpType == OtpType.PHONE ? identifier : null)
                        .role(UserRole.CUSTOMER) // default role
                        .build();
                userRepository.save(user);
            } else {
                user = userOpt.get();
            }

            String token = jwtUtil.generateToken(identifier);

            Token tokenEntity = Token.builder()
                    .user(user)
                    .accessToken(token)
                    .createdAt(LocalDateTime.now())
                    .expiresAt(LocalDateTime.now().plusDays(365))
                    .build();
            tokenRepository.save(tokenEntity);

            return ResponseEntity.ok(new AuthResponse(200, "OTP Verified Successfully", token));
        }

        return ResponseEntity.status(403).body(new AuthResponse(403, "Invalid or Expired OTP", null));
    }
}
