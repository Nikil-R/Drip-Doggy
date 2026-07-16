package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.INewsletterService;
import com.dripdoggy.backend.RequestDto.NewsletterSubscribeRequestDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/newsletter")
public class PublicNewsletterController {

    private final INewsletterService newsletterService;

    @Autowired
    public PublicNewsletterController(INewsletterService newsletterService) {
        this.newsletterService = newsletterService;
    }

    @PostMapping("/subscribe")
    public ResponseEntity<ResponseMsgDto> subscribe(@Valid @RequestBody NewsletterSubscribeRequestDto dto) {
        ResponseMsgDto response = newsletterService.subscribe(dto);
        return ResponseEntity.ok(response);
    }
}
