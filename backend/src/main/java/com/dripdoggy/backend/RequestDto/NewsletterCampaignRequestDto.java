package com.dripdoggy.backend.RequestDto;

import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.constraints.NotBlank;

public class NewsletterCampaignRequestDto {

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Content is required")
    private String content;

    private MultipartFile image1;
    private MultipartFile image2;

    public NewsletterCampaignRequestDto() {
    }

    public NewsletterCampaignRequestDto(String subject, String content) {
        this.subject = subject;
        this.content = content;
    }

    public NewsletterCampaignRequestDto(String subject, String content, MultipartFile image1, MultipartFile image2) {
        this.subject = subject;
        this.content = content;
        this.image1 = image1;
        this.image2 = image2;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public MultipartFile getImage1() {
        return image1;
    }

    public void setImage1(MultipartFile image1) {
        this.image1 = image1;
    }

    public MultipartFile getImage2() {
        return image2;
    }

    public void setImage2(MultipartFile image2) {
        this.image2 = image2;
    }
}
