package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.IPaymentService;
import com.dripdoggy.backend.RequestDto.BankSettlementRequestDto;
import com.dripdoggy.backend.ResponseDto.PaymentLedgerFullResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/payments")
@PreAuthorize("hasRole('ADMIN')")
public class PaymentController {

    private final IPaymentService paymentService;

    @Autowired
    public PaymentController(IPaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public ResponseEntity<PaymentLedgerFullResponseDto> getPaymentLedger(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String dateRange,
            @RequestParam(required = false) String search) {
        PaymentLedgerFullResponseDto ledger = paymentService.getPaymentLedger(status, dateRange, search);
        return ResponseEntity.ok(ledger);
    }

    @PatchMapping("/{orderNumber}/bank-settlement")
    public ResponseEntity<ResponseMsgDto> updateBankSettlement(
            @PathVariable String orderNumber,
            @RequestBody BankSettlementRequestDto request) {
        ResponseMsgDto response = paymentService.updateBankSettlement(orderNumber, request);
        return ResponseEntity.ok(response);
    }
}
