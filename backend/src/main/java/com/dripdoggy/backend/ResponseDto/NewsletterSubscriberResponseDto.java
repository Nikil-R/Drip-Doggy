package com.dripdoggy.backend.ResponseDto;

import java.time.LocalDateTime;

public class NewsletterSubscriberResponseDto {
    private String email;
    private LocalDateTime subscribedAt;

    public NewsletterSubscriberResponseDto() {
    }

    public NewsletterSubscriberResponseDto(String email, LocalDateTime subscribedAt) {
        this.email = email;
        this.subscribedAt = subscribedAt;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getSubscribedAt() {
        return subscribedAt;
    }

    public void setSubscribedAt(LocalDateTime subscribedAt) {
        this.subscribedAt = subscribedAt;
    }
}
