package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.IOrderReturnService;
import com.dripdoggy.backend.RequestDto.OrderCancelRequestDto;
import com.dripdoggy.backend.RequestDto.ReturnSubmitRequestDto;
import com.dripdoggy.backend.RequestDto.ExchangeSubmitRequestDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer/orders")
public class CustomerOrderReturnController {

    private final IOrderReturnService orderReturnService;

    @Autowired
    public CustomerOrderReturnController(IOrderReturnService orderReturnService) {
        this.orderReturnService = orderReturnService;
    }

    @PostMapping("/{orderId}/returns")
    public ResponseEntity<ResponseMsgDto> requestReturn(
            @PathVariable Long orderId,
            @Valid @ModelAttribute ReturnSubmitRequestDto dto) {
        ResponseMsgDto response = orderReturnService.createReturnRequest(orderId, dto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{orderId}/exchanges")
    public ResponseEntity<ResponseMsgDto> requestExchange(
            @PathVariable Long orderId,
            @Valid @ModelAttribute ExchangeSubmitRequestDto dto) {
        ResponseMsgDto response = orderReturnService.createExchangeRequest(orderId, dto);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{orderId}/cancel")
    public ResponseEntity<ResponseMsgDto> cancelOrder(
            @PathVariable Long orderId,
            @Valid @RequestBody OrderCancelRequestDto dto) {
        ResponseMsgDto response = orderReturnService.cancelOrder(orderId, dto, "USER");
        return ResponseEntity.ok(response);
    }
}
