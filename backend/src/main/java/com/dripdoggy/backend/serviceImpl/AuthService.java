package com.dripdoggy.backend.serviceImpl;

import com.dripdoggy.backend.Iservice.IAuthService;
import com.dripdoggy.backend.RequestDto.SignupRequest;
import com.dripdoggy.backend.RequestDto.VerifyOtpRequest;
import com.dripdoggy.backend.RequestDto.RegisterRequest;
import com.dripdoggy.backend.RequestDto.CustomerRegisterRequest;
import com.dripdoggy.backend.ResponseDto.AuthResponse;
import com.dripdoggy.backend.ResponseDto.CustomerRegisterResponse;
import com.dripdoggy.backend.ResponseDto.UserDto;
import com.dripdoggy.backend.entity.User;
import com.dripdoggy.backend.entity.Token;
import java.util.List;
import java.util.ArrayList;
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
	
    private OtpService otpService;
    private UserRepository userRepository;
    private TokenRepository tokenRepository;
    private JwtUtil jwtUtil;
    private HttpServletRequest httpServletRequest;
    private EmailService emailService;
    
    @Autowired
    public AuthService(OtpService otpService, UserRepository userRepository, TokenRepository tokenRepository,
			JwtUtil jwtUtil, HttpServletRequest httpServletRequest, EmailService emailService) {
		super();
		this.otpService = otpService;
		this.userRepository = userRepository;
		this.tokenRepository = tokenRepository;
		this.jwtUtil = jwtUtil;
		this.httpServletRequest = httpServletRequest;
		this.emailService = emailService;
	}

	@Override
    public AuthResponse sendOtp(SignupRequest request) {
        String identifier = request.getIdentifier();
        validatePhoneNumberCountryCode(identifier);

        Optional<User> userOpt;
        if (identifier.contains("@")) {
            userOpt = userRepository.findByEmail(identifier);
        } else {
            String alternative = identifier.startsWith("+") ? identifier.substring(1) : "+" + identifier;
            userOpt = userRepository.findByPhoneNo(identifier)
                    .or(() -> userRepository.findByPhoneNo(alternative));
        }

        if (userOpt.isPresent()) {
            User existingUser = userOpt.get();
            if (Boolean.TRUE.equals(existingUser.getIsBlocked())) {
                throw new InvalidCredentialsException("Your account has been blocked by the administrator.");
            }
            if (existingUser.getRole() == UserRole.ADMIN) {
                throw new InvalidCredentialsException("An account with this email already exists. Please sign in or use a different email.");
            }
        }

        boolean exists = userOpt.isPresent();

        if (identifier.contains("@")) {
            otpService.generateAndSendOtp(identifier, OtpType.EMAIL, exists);
            return new AuthResponse(200, "OTP sent to email", null);
        } else {
            otpService.generateAndSendOtp(identifier, OtpType.PHONE, exists);
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
            Optional<User> userOpt;
            if (identifier.contains("@")) {
                userOpt = userRepository.findByEmail(identifier);
            } else {
                String alternative = identifier.startsWith("+") ? identifier.substring(1) : "+" + identifier;
                userOpt = userRepository.findByPhoneNo(identifier)
                        .or(() -> userRepository.findByPhoneNo(alternative));
            }

            if (userOpt.isPresent()) {
                User existingUser = userOpt.get();
                if (Boolean.TRUE.equals(existingUser.getIsBlocked())) {
                    throw new InvalidCredentialsException("Your account has been blocked by the administrator.");
                }
                if (existingUser.getRole() == UserRole.ADMIN) {
                    throw new InvalidCredentialsException("An account with this email already exists. Please sign in or use a different email.");
                }
            }

            User user;
            boolean userExistsFlag;

            if (userOpt.isPresent()) {
                user = userOpt.get();
                userExistsFlag = (user.getFirstName() != null);
            } else {
                user = new User();
                if (identifier.contains("@")) {
                    user.setEmail(identifier);
                    user.setRegistrationMethod("EMAIL");
                } else {
                    user.setPhoneNo(identifier);
                    user.setRegistrationMethod("PHONE");
                }
                user.setRole(UserRole.CUSTOMER);
                user = userRepository.save(user);
                userExistsFlag = false;
            }

            String token = jwtUtil.generateToken(identifier);

            Token tokenEntity = new Token();
            tokenEntity.setUser(user);
            tokenEntity.setAccessToken(token);
            tokenEntity.setCreatedAt(LocalDateTime.now());
            tokenEntity.setExpiresAt(LocalDateTime.now().plusDays(365));
            tokenEntity.setIpAddress(getClientIp());
            tokenRepository.save(tokenEntity);

            Boolean responseUserExists = (user.getRole() == UserRole.ADMIN) ? null : userExistsFlag;
            String message = userExistsFlag ? "OTP Verified Successfully" : "OTP Verified. Redirecting to onboarding";

            AuthResponse authResponse = new AuthResponse(200, message, token, responseUserExists);
            if (userExistsFlag) {
                UserDto userDto = new UserDto();
                userDto.setId(user.getId());
                userDto.setFirstName(user.getFirstName());
                userDto.setLastName(user.getLastName());
                userDto.setEmail(user.getEmail());
                userDto.setPhone(user.getPhoneNo());
                userDto.setGender(user.getGender() != null ? user.getGender().name() : null);
                userDto.setDob(user.getDob() != null ? user.getDob().toString() : null);
                userDto.setRole(user.getRole() != null ? user.getRole().name() : null);
                authResponse.setUser(userDto);
            }
            return authResponse;
        }

        throw new OtpNotFoundException("Invalid or Expired OTP");
    }

    @Override
    public CustomerRegisterResponse registerCustomer(CustomerRegisterRequest request) {
        org.springframework.security.core.Authentication authentication = 
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new InvalidCredentialsException("Access Denied: Customer registration requires a valid authentication token.");
        }
        String principalName = authentication.getName();
        User user = loadUserByIdentifier(principalName);

        // Ensure only CUSTOMER roles can perform onboarding
        if (user.getRole() != UserRole.CUSTOMER) {
            throw new InvalidCredentialsException("Access Denied: Customer registration is only allowed for customer accounts.");
        }

        // Check if they are already registered (i.e. firstName is not null)
        if (user.getFirstName() != null) {
            throw new CustomerAlreadyFoundException("Customer is already registered");
        }

        String phoneNo = request.getPhoneNo();
        if (phoneNo != null && !phoneNo.trim().isEmpty()) {
            validatePhoneNumberCountryCode(phoneNo);

            // Check if another user is already registered with this phone number
            String alternativePhone = phoneNo.startsWith("+") ? phoneNo.substring(1) : "+" + phoneNo;
            Optional<User> existingUserByPhone = userRepository.findByPhoneNo(phoneNo)
                    .or(() -> userRepository.findByPhoneNo(alternativePhone));
            if (existingUserByPhone.isPresent() && !existingUserByPhone.get().getId().equals(user.getId())) {
                throw new CustomerAlreadyFoundException("Phone number is already registered by another user: " + phoneNo);
            }
            user.setPhoneNo(phoneNo);
        }

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(UserRole.CUSTOMER);

        if (request.getDob() != null && !request.getDob().trim().isEmpty()) {
            user.setDob(parseDateOfBirth(request.getDob()));
        }
        if (request.getGender() != null && !request.getGender().trim().isEmpty()) {
            try {
                user.setGender(com.dripdoggy.backend.enums.Gender.valueOf(request.getGender().trim().toUpperCase()));
            } catch (Exception e) {
                // Handle mapping exception safely
            }
        }

        userRepository.save(user);

        // Return CustomerRegisterResponse with only the requested fields:
        CustomerRegisterResponse response = new CustomerRegisterResponse();
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setDob(user.getDob() != null ? user.getDob().toString() : null);
        response.setGender(user.getGender() != null ? user.getGender().name() : null);
        response.setPhoneNo(user.getPhoneNo());

        return response;
    }

    @Override
    public CustomerRegisterResponse register(RegisterRequest request) {
        org.springframework.security.core.Authentication authentication = 
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new InvalidCredentialsException("Access Denied: Admin registration requires a valid authentication token.");
        }
        String principalName = authentication.getName();
        User currentUser = loadUserByIdentifier(principalName);
        if (currentUser.getRole() != UserRole.ADMIN) {
            throw new InvalidCredentialsException("Access Denied: Only an ADMIN can register another ADMIN.");
        }

        String email = request.getEmail();
        String phoneNo = request.getPhoneNo();

        // Validate phone number format
        if (phoneNo != null && !phoneNo.trim().isEmpty()) {
            validatePhoneNumberCountryCode(phoneNo);
        }

        User user;

        // Admin registration path - keep original logic
        // Check if email already exists
        Optional<User> existingUserByEmail = Optional.empty();
        if (email != null && !email.trim().isEmpty()) {
            existingUserByEmail = userRepository.findByEmail(email);
            if (existingUserByEmail.isPresent() && existingUserByEmail.get().getFirstName() != null) {
                throw new CustomerAlreadyFoundException("User is already registered with email: " + email);
            }
        }

        // Check if phone number already exists
        Optional<User> existingUserByPhone = Optional.empty();
        if (phoneNo != null && !phoneNo.trim().isEmpty()) {
            String alternativePhone = phoneNo.startsWith("+") ? phoneNo.substring(1) : "+" + phoneNo;
            existingUserByPhone = userRepository.findByPhoneNo(phoneNo)
                    .or(() -> userRepository.findByPhoneNo(alternativePhone));
            if (existingUserByPhone.isPresent() && existingUserByPhone.get().getFirstName() != null) {
                throw new CustomerAlreadyFoundException("User is already registered with phone number: " + phoneNo);
            }
        }

        if (existingUserByEmail.isPresent()) {
            user = existingUserByEmail.get();
            if (phoneNo != null && !phoneNo.trim().isEmpty()) {
                user.setPhoneNo(phoneNo);
            }
        } else if (existingUserByPhone.isPresent()) {
            user = existingUserByPhone.get();
            if (email != null && !email.trim().isEmpty()) {
                user.setEmail(email);
            }
        } else {
            user = new User();
            user.setEmail(email);
            user.setPhoneNo(phoneNo);
        }

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(request.getRole() != null ? request.getRole() : UserRole.CUSTOMER);

        if (request.getDob() != null && !request.getDob().trim().isEmpty()) {
            user.setDob(parseDateOfBirth(request.getDob()));
        }
        if (request.getGender() != null && !request.getGender().trim().isEmpty()) {
            try {
                user.setGender(com.dripdoggy.backend.enums.Gender.valueOf(request.getGender().trim().toUpperCase()));
            } catch (Exception e) {
                // Handle mapping exception safely
            }
        }

        userRepository.save(user);

        if (user.getRole() == UserRole.ADMIN) {
            if (email != null && !email.trim().isEmpty()) {
                emailService.sendWelcomeAdminEmail(email);
            }
        }

        return new CustomerRegisterResponse();
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

    @Override
    public AuthResponse sendAdminOtp(SignupRequest request) {
        String identifier = request.getIdentifier();
        validatePhoneNumberCountryCode(identifier);

        // Check if user exists in DB and has role ADMIN
        Optional<User> userOpt;
        if (identifier.contains("@")) {
            userOpt = userRepository.findByEmail(identifier);
        } else {
            String alternative = identifier.startsWith("+") ? identifier.substring(1) : "+" + identifier;
            userOpt = userRepository.findByPhoneNo(identifier)
                    .or(() -> userRepository.findByPhoneNo(alternative));
        }

        if (userOpt.isPresent() && userOpt.get().getRole() == UserRole.ADMIN) {
            if (identifier.contains("@")) {
                otpService.generateAndSendOtp(identifier, OtpType.EMAIL, true);
                return new AuthResponse(200, "OTP sent to email", null);
            } else {
                otpService.generateAndSendOtp(identifier, OtpType.PHONE, true);
                return new AuthResponse(200, "OTP sent to phone", null);
            }
        }

        throw new InvalidAdminEmailException("INVALID ADMIN EMAIL");
    }

    @Override
    public AuthResponse verifyAdminOtp(VerifyOtpRequest request) {
        String identifier = request.getIdentifier();
        validatePhoneNumberCountryCode(identifier);

        // Before verifying the OTP, check that the email or phone number is present in the database.
        // If it is not present, or does not have the ADMIN role, throw the custom exception.
        Optional<User> userOpt;
        if (identifier.contains("@")) {
            userOpt = userRepository.findByEmail(identifier);
            if (userOpt.isEmpty()) {
                throw new EmailNotFoundException("Email address is not registered");
            }
            if (userOpt.get().getRole() != UserRole.ADMIN) {
                throw new InvalidAdminEmailException("INVALID ADMIN EMAIL");
            }
        } else {
            String alternative = identifier.startsWith("+") ? identifier.substring(1) : "+" + identifier;
            userOpt = userRepository.findByPhoneNo(identifier)
                    .or(() -> userRepository.findByPhoneNo(alternative));
            if (userOpt.isEmpty()) {
                throw new PhoneNotFoundException("Phone number is not registered");
            }
            if (userOpt.get().getRole() != UserRole.ADMIN) {
                throw new AdminNotFoundException("Admin not found or unauthorized with the provided phone number");
            }
        }

        User user = userOpt.get();

        OtpType otpType = identifier.contains("@") ? OtpType.EMAIL : OtpType.PHONE;
        boolean verified = otpService.verifyOtp(identifier, otpType, request.getOtpCode());

        if (verified) {
            // Generate the token using the admin's email if available, otherwise the identifier.
            String tokenSubject = (user.getEmail() != null && !user.getEmail().trim().isEmpty()) ? user.getEmail() : identifier;
            String token = jwtUtil.generateToken(tokenSubject);

            Token tokenEntity = new Token();
            tokenEntity.setUser(user);
            tokenEntity.setAccessToken(token);
            tokenEntity.setCreatedAt(LocalDateTime.now());
            tokenEntity.setExpiresAt(LocalDateTime.now().plusDays(365));
            tokenEntity.setIpAddress(getClientIp());
            tokenRepository.save(tokenEntity);

            AuthResponse authResponse = new AuthResponse(200, "OTP Verified Successfully", token, null);
            UserDto userDto = new UserDto();
            userDto.setId(user.getId());
            userDto.setFirstName(user.getFirstName());
            userDto.setLastName(user.getLastName());
            userDto.setEmail(user.getEmail());
            userDto.setPhone(user.getPhoneNo());
            userDto.setGender(user.getGender() != null ? user.getGender().name() : null);
            userDto.setDob(user.getDob() != null ? user.getDob().toString() : null);
            userDto.setRole(user.getRole() != null ? user.getRole().name() : null);
            authResponse.setUser(userDto);
            return authResponse;
        }

        throw new OtpNotFoundException("Invalid or Expired OTP");
    }

    private java.time.LocalDate parseDateOfBirth(String dobStr) {
        if (dobStr == null || dobStr.trim().isEmpty()) {
            return null;
        }
        String cleaned = dobStr.trim();
        try {
            java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy");
            return java.time.LocalDate.parse(cleaned, formatter);
        } catch (java.time.format.DateTimeParseException e) {
            try {
                return java.time.LocalDate.parse(cleaned);
            } catch (java.time.format.DateTimeParseException ex) {
                return null;
            }
        }
    }

    @Override
    public List<UserDto> fetchAllAdmins() {
        List<User> admins = userRepository.findByRole(UserRole.ADMIN);
        List<UserDto> adminDtos = new ArrayList<>();
        for (User user : admins) {
            UserDto userDto = new UserDto();
            userDto.setId(user.getId());
            userDto.setFirstName(user.getFirstName());
            userDto.setLastName(user.getLastName());
            userDto.setEmail(user.getEmail());
            userDto.setPhone(user.getPhoneNo());
            userDto.setGender(user.getGender() != null ? user.getGender().name() : null);
            userDto.setDob(user.getDob() != null ? user.getDob().toString() : null);
            userDto.setRole(user.getRole() != null ? user.getRole().name() : null);
            adminDtos.add(userDto);
        }
        return adminDtos;
    }

    @Override
    public UserDto getAdminProfile() {
        org.springframework.security.core.Authentication authentication = 
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new InvalidCredentialsException("Access Denied: Unauthenticated");
        }
        String principalName = authentication.getName();
        User user = loadUserByIdentifier(principalName);

        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setEmail(user.getEmail());
        userDto.setPhone(user.getPhoneNo());
        userDto.setGender(user.getGender() != null ? user.getGender().name() : null);
        userDto.setDob(user.getDob() != null ? user.getDob().toString() : null);
        userDto.setRole(user.getRole() != null ? user.getRole().name() : null);
        return userDto;
    }
}
