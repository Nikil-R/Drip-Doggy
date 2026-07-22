package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.ICustomerProfileService;
import com.dripdoggy.backend.RequestDto.CustomerProfileRequestDto;
import com.dripdoggy.backend.RequestDto.ProfileContactOtpRequestDto;
import com.dripdoggy.backend.RequestDto.ProfileContactOtpVerifyDto;
import com.dripdoggy.backend.ResponseDto.CustomerProfileResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer/profile")
public class CustomerProfileController {

    private final ICustomerProfileService customerProfileService;

    @Autowired
    public CustomerProfileController(ICustomerProfileService customerProfileService) {
        this.customerProfileService = customerProfileService;
    }

    @GetMapping
    public ResponseEntity<CustomerProfileResponseDto> getCustomerProfile() {
        CustomerProfileResponseDto response = customerProfileService.getCustomerProfile();
        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<CustomerProfileResponseDto> updateCustomerProfile(@Valid @RequestBody CustomerProfileRequestDto dto) {
        CustomerProfileResponseDto response = customerProfileService.updateCustomerProfile(dto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/send-otp")
    public ResponseEntity<ResponseMsgDto> sendContactUpdateOtp(@Valid @RequestBody ProfileContactOtpRequestDto dto) {
        ResponseMsgDto response = customerProfileService.sendContactUpdateOtp(dto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<CustomerProfileResponseDto> verifyAndUpdateContact(@Valid @RequestBody ProfileContactOtpVerifyDto dto) {
        CustomerProfileResponseDto response = customerProfileService.verifyAndUpdateContact(dto);
        return ResponseEntity.ok(response);
    }
}
