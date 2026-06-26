package com.dripdoggy.backend.repository;

import com.dripdoggy.backend.entity.Otp;
import com.dripdoggy.backend.enums.OtpType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OtpRepository extends JpaRepository<Otp, Long> {
    Optional<Otp> findTopByTargetValueAndOtpTypeOrderByCreatedAtDesc(String targetValue, OtpType otpType);
}
