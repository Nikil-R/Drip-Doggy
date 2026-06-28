package com.dripdoggy.backend.serviceImpl;

import com.dripdoggy.backend.Iservice.IAuthService;
import com.dripdoggy.backend.RequestDto.SignupRequest;
import com.dripdoggy.backend.RequestDto.VerifyOtpRequest;
import com.dripdoggy.backend.RequestDto.RegisterRequest;
import com.dripdoggy.backend.ResponseDto.AuthResponse;
import com.dripdoggy.backend.entity.User;
import com.dripdoggy.backend.entity.Token;
import com.dripdoggy.backend.enums.OtpType;
import com.dripdoggy.backend.enums.UserRole;
import com.dripdoggy.backend.exception.*;
import com.dripdoggy.backend.repository.UserRepository;
import com.dripdoggy.backend.repository.TokenRepository;
import com.dripdoggy.backend.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthService implements IAuthService {

    @Autowired
    private OtpService otpService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private HttpServletRequest httpServletRequest;

    @Override
    public AuthResponse sendOtp(SignupRequest request) {
        String identifier = request.getIdentifier();
        validatePhoneNumberCountryCode(identifier);
        loadUserByIdentifier(identifier);

        if (identifier.contains("@")) {
            otpService.generateAndSendOtp(identifier, OtpType.EMAIL);
            return new AuthResponse(200, "OTP sent to email", null);
        } else {
            otpService.generateAndSendOtp(identifier, OtpType.PHONE);
            return new AuthResponse(200, "OTP sent to phone", null);
        }
    }

    @Override
    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        String identifier = request.getIdentifier();
        validatePhoneNumberCountryCode(identifier);

        OtpType otpType = identifier.contains("@") ? OtpType.EMAIL : OtpType.PHONE;
        boolean verified = otpService.verifyOtp(identifier, otpType, request.getOtpCode());

        if (verified) {
            User user = loadUserByIdentifier(identifier);
            String token = jwtUtil.generateToken(identifier);

            Token tokenEntity = new Token();
            tokenEntity.setUser(user);
            tokenEntity.setAccessToken(token);
            tokenEntity.setCreatedAt(LocalDateTime.now());
            tokenEntity.setExpiresAt(LocalDateTime.now().plusDays(365));
            tokenEntity.setIpAddress(getClientIp()); // Capture device IP address dynamically
            tokenRepository.save(tokenEntity);

            return new AuthResponse(200, "OTP Verified Successfully", token);
        }

        throw new InvalidCredentialsException("Invalid or Expired OTP");
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail();
        String phoneNo = request.getPhoneNo();

        // Validate phone number format
        validatePhoneNumberCountryCode(phoneNo);

        // Check if email already exists
        if (userRepository.findByEmail(email).isPresent()) {
            throw new UserAlreadyExistsException("User is already registered with email: " + email);
        }

        // Check if phone number already exists
        String alternativePhone = phoneNo.startsWith("+") ? phoneNo.substring(1) : "+" + phoneNo;
        if (userRepository.findByPhoneNo(phoneNo).isPresent() || 
            userRepository.findByPhoneNo(alternativePhone).isPresent()) {
            throw new UserAlreadyExistsException("User is already registered with phone number: " + phoneNo);
        }

        User user = new User();
        user.setEmail(email);
        user.setPhoneNo(phoneNo);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(request.getRole() != null ? request.getRole() : UserRole.CUSTOMER);

        userRepository.save(user);

        // Generate and send verification OTP automatically to email
        otpService.generateAndSendOtp(email, OtpType.EMAIL);

        return new AuthResponse(201, "User registered successfully. Please verify the OTP sent to your email.", null);
    }

    @Override
    public AuthResponse logout() {
        String authHeader = httpServletRequest.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            Optional<Token> tokenOpt = tokenRepository.findByAccessToken(token);
            if (tokenOpt.isPresent()) {
                Token tokenEntity = tokenOpt.get();
                if (tokenEntity.getLoggedOut() == null) {
                    tokenEntity.setLoggedOut(LocalDateTime.now());
                    tokenEntity.setIpAddress(getClientIp()); // Update IP dynamically for the logout action
                    tokenRepository.save(tokenEntity);
                    return new AuthResponse(200, "Logged out successfully", null);
                } else {
                    return new AuthResponse(200, "Already logged out", null);
                }
            }
        }
        throw new InvalidCredentialsException("No active session found or invalid token.");
    }

    private String getClientIp() {
        String ip = httpServletRequest.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = httpServletRequest.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = httpServletRequest.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = httpServletRequest.getRemoteAddr();
        }
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }

    private void validatePhoneNumberCountryCode(String identifier) {
        if (identifier != null && !identifier.contains("@")) {
            com.google.i18n.phonenumbers.PhoneNumberUtil phoneUtil = com.google.i18n.phonenumbers.PhoneNumberUtil.getInstance();
            try {
                String numberToParse = identifier;
                if (!numberToParse.startsWith("+")) {
                    numberToParse = "+" + numberToParse;
                }
                com.google.i18n.phonenumbers.Phonenumber.PhoneNumber phoneNumber = phoneUtil.parse(numberToParse, null);
                if (!phoneUtil.isValidNumber(phoneNumber)) {
                    throw new InvalidCountryCodeException("Invalid phone number or country code: " + identifier);
                }
            } catch (com.google.i18n.phonenumbers.NumberParseException e) {
                throw new InvalidCountryCodeException("Invalid phone number or country code format: " + e.getMessage());
            }
        }
    }

    private User loadUserByIdentifier(String identifier) {
        if (identifier.contains("@")) {
            return userRepository.findByEmail(identifier)
                    .orElseThrow(() -> new EmailNotFoundException("Email address is not registered: " + identifier));
        } else {
            String alternative = identifier.startsWith("+") ? identifier.substring(1) : "+" + identifier;
            return userRepository.findByPhoneNo(identifier)
                    .or(() -> userRepository.findByPhoneNo(alternative))
                    .orElseThrow(() -> new PhoneNotFoundException("Phone number is not registered: " + identifier));
        }
    }
}
