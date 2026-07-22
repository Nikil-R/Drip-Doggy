package com.dripdoggy.backend.serviceImpl;

import com.dripdoggy.backend.Iservice.ICustomerProfileService;
import com.dripdoggy.backend.RequestDto.CustomerProfileRequestDto;
import com.dripdoggy.backend.RequestDto.ProfileContactOtpRequestDto;
import com.dripdoggy.backend.RequestDto.ProfileContactOtpVerifyDto;
import com.dripdoggy.backend.ResponseDto.CustomerProfileResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.entity.User;
import com.dripdoggy.backend.enums.Gender;
import com.dripdoggy.backend.enums.OtpType;
import com.dripdoggy.backend.enums.UserRole;
import com.dripdoggy.backend.exception.*;
import com.dripdoggy.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
@Transactional
public class CustomerProfileService implements ICustomerProfileService {

    private final UserRepository userRepository;
    private final OtpService otpService;

    @Autowired
    public CustomerProfileService(UserRepository userRepository, OtpService otpService) {
        this.userRepository = userRepository;
        this.otpService = otpService;
    }

    private User getCurrentCustomer() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new InvalidCredentialsException("Access Denied: User must be authenticated.");
        }
        String principalName = authentication.getName();
        User user = null;
        if (principalName.contains("@")) {
            user = userRepository.findByEmail(principalName)
                    .orElseThrow(() -> new EmailNotFoundException("Email address is not registered: " + principalName));
        } else {
            String alternative = principalName.startsWith("+") ? principalName.substring(1) : "+" + principalName;
            user = userRepository.findByPhoneNo(principalName).or(() -> userRepository.findByPhoneNo(alternative))
                    .orElseThrow(() -> new PhoneNotFoundException("Phone number is not registered: " + principalName));
        }
        if (user.getRole() != UserRole.CUSTOMER) {
            throw new IllegalArgumentException("Access Denied: Only customers can access profile settings.");
        }
        return user;
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerProfileResponseDto getCustomerProfile() {
        User user = getCurrentCustomer();
        return new CustomerProfileResponseDto(200, "Customer profile fetched successfully", mapToData(user));
    }

    @Override
    public CustomerProfileResponseDto updateCustomerProfile(CustomerProfileRequestDto dto) {
        User user = getCurrentCustomer();

        if (dto.getFirstName() != null && !dto.getFirstName().trim().isEmpty()) {
            user.setFirstName(dto.getFirstName().trim());
        }
        if (dto.getLastName() != null && !dto.getLastName().trim().isEmpty()) {
            user.setLastName(dto.getLastName().trim());
        }
        if (dto.getDob() != null && !dto.getDob().trim().isEmpty()) {
            try {
                user.setDob(LocalDate.parse(dto.getDob().trim()));
            } catch (Exception e) {
                throw new IllegalArgumentException("Invalid date of birth format. Use YYYY-MM-DD.");
            }
        }
        if (dto.getGender() != null && !dto.getGender().trim().isEmpty()) {
            try {
                user.setGender(Gender.valueOf(dto.getGender().trim().toUpperCase()));
            } catch (Exception e) {
                throw new IllegalArgumentException("Invalid gender value. Use MALE, FEMALE, or OTHER.");
            }
        }

        User savedUser = userRepository.save(user);
        return new CustomerProfileResponseDto(200, "Profile updated successfully", mapToData(savedUser));
    }

    @Override
    public ResponseMsgDto sendContactUpdateOtp(ProfileContactOtpRequestDto dto) {
        User currentUser = getCurrentCustomer();
        String target = dto.getTargetValue() != null ? dto.getTargetValue().trim() : "";
        if (target.isEmpty()) {
            throw new IllegalArgumentException("New email address or phone number is required.");
        }

        if (dto.getOtpType() == OtpType.EMAIL) {
            if (!target.contains("@")) {
                throw new IllegalArgumentException("Please enter a valid email address.");
            }
            // If email is identical to current email, return early
            if (target.equalsIgnoreCase(currentUser.getEmail())) {
                throw new IllegalArgumentException("The entered email address is already your current email address.");
            }

            Optional<User> existingUser = userRepository.findByEmail(target);
            if (existingUser.isPresent() && !existingUser.get().getId().equals(currentUser.getId())) {
                throw new CustomerAlreadyFoundException("Email address '" + target + "' is already registered by another user.");
            }

            // Generate and send OTP to new target email (User entity remains unchanged)
            otpService.generateAndSendOtp(target, OtpType.EMAIL, false);
            return new ResponseMsgDto(200, "Verification OTP code sent to email: " + target);

        } else if (dto.getOtpType() == OtpType.PHONE) {
            String cleanPhone = target.startsWith("+") ? target.substring(1) : target;
            if (!cleanPhone.matches("^[0-9]{10,15}$")) {
                throw new IllegalArgumentException("Please enter a valid phone number (10-15 digits).");
            }
            // If phone is identical to current phone
            if (currentUser.getPhoneNo() != null && cleanPhone.equals(currentUser.getPhoneNo().replaceAll("[^0-9]", ""))) {
                throw new IllegalArgumentException("The entered phone number is already your current phone number.");
            }

            String alternative = target.startsWith("+") ? target.substring(1) : "+" + target;
            Optional<User> existingUser = userRepository.findByPhoneNo(target).or(() -> userRepository.findByPhoneNo(alternative));
            if (existingUser.isPresent() && !existingUser.get().getId().equals(currentUser.getId())) {
                throw new CustomerAlreadyFoundException("Phone number '" + target + "' is already registered by another user.");
            }

            // Generate and send OTP to new target phone (User entity remains unchanged)
            otpService.generateAndSendOtp(target, OtpType.PHONE, false);
            return new ResponseMsgDto(200, "Verification OTP code sent to phone: " + target);
        } else {
            throw new IllegalArgumentException("Invalid OTP type specified.");
        }
    }

    @Override
    public CustomerProfileResponseDto verifyAndUpdateContact(ProfileContactOtpVerifyDto dto) {
        User currentUser = getCurrentCustomer();
        String target = dto.getTargetValue() != null ? dto.getTargetValue().trim() : "";
        if (target.isEmpty()) {
            throw new IllegalArgumentException("Target value is required.");
        }

        boolean verified = otpService.verifyOtp(target, dto.getOtpType(), dto.getOtpCode());
        if (!verified) {
            throw new InvalidCredentialsException("Invalid or expired OTP code.");
        }

        // Only upon successful OTP verification do we update the user's email/phone in the database
        if (dto.getOtpType() == OtpType.EMAIL) {
            Optional<User> existingUser = userRepository.findByEmail(target);
            if (existingUser.isPresent() && !existingUser.get().getId().equals(currentUser.getId())) {
                throw new CustomerAlreadyFoundException("Email address '" + target + "' is already registered by another user.");
            }
            currentUser.setEmail(target);
        } else if (dto.getOtpType() == OtpType.PHONE) {
            String alternative = target.startsWith("+") ? target.substring(1) : "+" + target;
            Optional<User> existingUser = userRepository.findByPhoneNo(target).or(() -> userRepository.findByPhoneNo(alternative));
            if (existingUser.isPresent() && !existingUser.get().getId().equals(currentUser.getId())) {
                throw new CustomerAlreadyFoundException("Phone number '" + target + "' is already registered by another user.");
            }
            currentUser.setPhoneNo(target);
        }

        User savedUser = userRepository.save(currentUser);
        return new CustomerProfileResponseDto(200, "Contact detail updated and verified successfully.", mapToData(savedUser));
    }

    private CustomerProfileResponseDto.Data mapToData(User user) {
        return new CustomerProfileResponseDto.Data(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhoneNo(),
                user.getGender() != null ? user.getGender().name() : null,
                user.getDob() != null ? user.getDob().toString() : null,
                user.getRegistrationMethod()
        );
    }
}
