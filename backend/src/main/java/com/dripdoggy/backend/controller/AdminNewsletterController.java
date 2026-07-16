package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.INewsletterService;
import com.dripdoggy.backend.RequestDto.NewsletterCampaignRequestDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.ResponseDto.NewsletterSubscriberResponseDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/newsletter")
public class AdminNewsletterController {

    private final INewsletterService newsletterService;

    @Autowired
    public AdminNewsletterController(INewsletterService newsletterService) {
        this.newsletterService = newsletterService;
    }

    @PostMapping(value = "/campaign", consumes = {"multipart/form-data"})
    public ResponseEntity<ResponseMsgDto> sendCampaign(@Valid @ModelAttribute NewsletterCampaignRequestDto dto) {
        ResponseMsgDto response = newsletterService.sendCampaign(dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/subscribers")
    public ResponseEntity<List<NewsletterSubscriberResponseDto>> getAllSubscribers() {
        List<NewsletterSubscriberResponseDto> subscribers = newsletterService.getAllSubscribers();
        return ResponseEntity.ok(subscribers);
    }
}
