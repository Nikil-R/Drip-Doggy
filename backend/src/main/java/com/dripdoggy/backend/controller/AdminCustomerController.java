package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.ICustomerService;
import com.dripdoggy.backend.ResponseDto.CustomerListResponseDto;
import com.dripdoggy.backend.ResponseDto.CustomerDetailResponseDto;
import com.dripdoggy.backend.ResponseDto.CustomerStatsResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/customers")
public class AdminCustomerController {

    private final ICustomerService customerService;

    @Autowired
    public AdminCustomerController(ICustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public ResponseEntity<CustomerListResponseDto> getAllCustomers() {
        CustomerListResponseDto response = customerService.getAllCustomers();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/stats")
    public ResponseEntity<CustomerStatsResponseDto> getCustomerStats() {
        CustomerStatsResponseDto response = customerService.getCustomerStats();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDetailResponseDto> getCustomerDetails(@PathVariable Long id) {
        CustomerDetailResponseDto response = customerService.getCustomerDetails(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/{id}/toggle-block")
    public ResponseEntity<ResponseMsgDto> toggleCustomerBlockStatus(@PathVariable Long id) {
        ResponseMsgDto response = customerService.toggleCustomerBlockStatus(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
