package com.dripdoggy.backend.service;

import com.dripdoggy.backend.entity.Otp;
import com.dripdoggy.backend.enums.OtpType;
import com.dripdoggy.backend.repository.OtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private SmsService smsService;

    public void generateAndSendOtp(String targetValue, OtpType otpType) {
        String otpCode = String.format("%06d", new Random().nextInt(999999));
        
        Otp otp = Otp.builder()
                .otpType(otpType)
                .targetValue(targetValue)
                .otpCode(otpCode)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .isVerified(false)
                .attempt(0)
                .build();
        
        otpRepository.save(otp);

        if (otpType == OtpType.EMAIL) {
            emailService.sendOtpEmail(targetValue, otpCode);
        } else if (otpType == OtpType.PHONE) {
            smsService.sendOtpSms(targetValue, otpCode);
        }
    }

    public boolean verifyOtp(String targetValue, OtpType otpType, String otpCode) {
        Optional<Otp> otpOptional = otpRepository.findTopByTargetValueAndOtpTypeOrderByCreatedAtDesc(targetValue, otpType);
        
        if (otpOptional.isPresent()) {
            Otp otp = otpOptional.get();
            if (otp.getIsVerified()) return false;
            if (otp.getExpiresAt().isBefore(LocalDateTime.now())) return false;
            if (otp.getOtpCode().equals(otpCode)) {
                otp.setIsVerified(true);
                otpRepository.save(otp);
                return true;
            }
            // Increment attempts
            otp.setAttempt(otp.getAttempt() + 1);
            otpRepository.save(otp);
        }
        return false;
    }
}
