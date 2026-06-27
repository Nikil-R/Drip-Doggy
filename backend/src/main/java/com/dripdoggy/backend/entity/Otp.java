package com.dripdoggy.backend.entity;

import com.dripdoggy.backend.enums.OtpType;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "otp")
public class Otp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "otp_type")
    private OtpType otpType;

    private Integer attempt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "otp_code")
    private String otpCode;

    @Column(name = "is_verified")
    private Boolean isVerified;

    @Column(name = "target_value")
    private String targetValue;

    // Constructors
    public Otp() {
    }

    public Otp(Long id, OtpType otpType, Integer attempt, LocalDateTime createdAt, LocalDateTime expiresAt, String otpCode, Boolean isVerified, String targetValue) {
        this.id = id;
        this.otpType = otpType;
        this.attempt = attempt;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
        this.otpCode = otpCode;
        this.isVerified = isVerified;
        this.targetValue = targetValue;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public OtpType getOtpType() {
        return otpType;
    }

    public void setOtpType(OtpType otpType) {
        this.otpType = otpType;
    }

    public Integer getAttempt() {
        return attempt;
    }

    public void setAttempt(Integer attempt) {
        this.attempt = attempt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public String getOtpCode() {
        return otpCode;
    }

    public void setOtpCode(String otpCode) {
        this.otpCode = otpCode;
    }

    public Boolean getIsVerified() {
        return isVerified;
    }

    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }

    public String getTargetValue() {
        return targetValue;
    }

    public void setTargetValue(String targetValue) {
        this.targetValue = targetValue;
    }
}
