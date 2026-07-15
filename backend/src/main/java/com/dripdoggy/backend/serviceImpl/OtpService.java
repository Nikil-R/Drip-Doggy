package com.dripdoggy.backend.serviceImpl;

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
        generateAndSendOtp(targetValue, otpType, false);
    }

    public void generateAndSendOtp(String targetValue, OtpType otpType, boolean isLogin) {
        String otpCode = String.format("%06d", new Random().nextInt(999999));
        
        Otp otp = new Otp();
        otp.setOtpType(otpType);
        otp.setTargetValue(targetValue);
        otp.setOtpCode(otpCode);
        otp.setCreatedAt(LocalDateTime.now());
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        otp.setIsVerified(false);
        otp.setAttempt(0);
        
        otpRepository.save(otp);

        if (otpType == OtpType.EMAIL) {
            emailService.sendOtpEmail(targetValue, otpCode, isLogin);
        } else if (otpType == OtpType.PHONE) {
            smsService.sendOtpSms(targetValue, otpCode);
        }
    }

    public boolean verifyOtp(String targetValue, OtpType otpType, String otpCode) {
        Optional<Otp> otpOptional = otpRepository.findTopByTargetValueAndOtpTypeOrderByCreatedAtDesc(targetValue, otpType);
        
        if (otpOptional.isPresent()) {
            Otp otp = otpOptional.get();
            if (otp.getIsVerified()) return false;
            
            // Increment attempts for any verification try
            otp.setAttempt(otp.getAttempt() + 1);
            
            if (otp.getExpiresAt().isAfter(LocalDateTime.now()) && otp.getOtpCode().equals(otpCode)) {
                otp.setIsVerified(true);
                otpRepository.save(otp);
                return true;
            }
            otpRepository.save(otp);
        }
        return false;
    }
}
