package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.IOrderService;
import com.dripdoggy.backend.RequestDto.OrderRequestDto;
import com.dripdoggy.backend.RequestDto.OrderPreviewRequestDto;
import com.dripdoggy.backend.RequestDto.CheckoutOtpRequest;
import com.dripdoggy.backend.RequestDto.CheckoutOtpVerifyRequest;
import com.dripdoggy.backend.ResponseDto.OrderResponseDto;
import com.dripdoggy.backend.ResponseDto.OrderPreviewResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer/orders")
public class OrderController {

    private final IOrderService orderService;

    @Autowired
    public OrderController(IOrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/send-otp")
    public ResponseEntity<ResponseMsgDto> sendCheckoutOtp(@Valid @RequestBody CheckoutOtpRequest request) {
        ResponseMsgDto response = orderService.sendCheckoutOtp(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ResponseMsgDto> verifyCheckoutOtp(@Valid @RequestBody CheckoutOtpVerifyRequest request) {
        ResponseMsgDto response = orderService.verifyCheckoutOtp(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<OrderResponseDto> placeOrder(@Valid @RequestBody OrderRequestDto request) {
        OrderResponseDto response = orderService.placeOrder(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/preview")
    public ResponseEntity<OrderPreviewResponseDto> previewOrder(@Valid @RequestBody OrderPreviewRequestDto request) {
        OrderPreviewResponseDto response = orderService.previewOrder(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<OrderResponseDto>> getCustomerOrders() {
        List<OrderResponseDto> response = orderService.getCustomerOrders();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDto> getCustomerOrderById(@PathVariable Long id) {
        OrderResponseDto response = orderService.getCustomerOrderById(id);
        return ResponseEntity.ok(response);
    }
}
