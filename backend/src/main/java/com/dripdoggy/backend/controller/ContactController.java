package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.RequestDto.ContactRequestDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.serviceImpl.EmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final EmailService emailService;

    @Autowired
    public ContactController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping
    public ResponseEntity<ResponseMsgDto> submitContactMessage(@Valid @RequestBody ContactRequestDto requestDto) {
        // 1. Dispatch support inquiry details to support.dripdoggy@gmail.com
        emailService.sendContactSupportEmail(
                requestDto.getEmail(),
                requestDto.getFirstName(),
                requestDto.getLastName(),
                requestDto.getOrderId(),
                requestDto.getMessage()
        );

        return ResponseEntity.ok(new ResponseMsgDto(200, "Your support request has been submitted successfully!"));
    }
}
