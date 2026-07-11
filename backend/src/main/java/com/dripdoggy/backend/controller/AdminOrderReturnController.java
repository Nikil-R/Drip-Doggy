package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.IOrderReturnService;
import com.dripdoggy.backend.RequestDto.OrderCancelRequestDto;
import com.dripdoggy.backend.RequestDto.ResolveReturnRequestDto;
import com.dripdoggy.backend.ResponseDto.AdminReturnResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderReturnController {

	private final IOrderReturnService orderReturnService;

	@Autowired
	public AdminOrderReturnController(IOrderReturnService orderReturnService) {
		this.orderReturnService = orderReturnService;
	}

	@GetMapping("/returns")
	public ResponseEntity<List<AdminReturnResponseDto>> getAllReturnRequests() {
		List<AdminReturnResponseDto> responses = orderReturnService.getAllReturnRequests();
		return ResponseEntity.ok(responses);
	}

	@GetMapping("/returns/{returnId}")
	public ResponseEntity<AdminReturnResponseDto> getReturnRequestById(@PathVariable Long returnId) {
		AdminReturnResponseDto response = orderReturnService.getReturnRequestById(returnId);
		return ResponseEntity.ok(response);
	}

	@PatchMapping("/returns/{returnId}/status/{status}")
	public ResponseEntity<ResponseMsgDto> updateReturnStatus(@PathVariable Long returnId, @PathVariable String status) {
		ResponseMsgDto response = orderReturnService.updateReturnStatus(returnId, status);
		return ResponseEntity.ok(response);
	}

	@PatchMapping("/returns/{returnId}/resolve")
	public ResponseEntity<ResponseMsgDto> resolveReturnRequest (@PathVariable Long returnId,
			@Valid @ModelAttribute ResolveReturnRequestDto dto) {
		ResponseMsgDto response = orderReturnService.resolveReturnRequest(returnId, dto.getAction(),
				dto.getTrackingNumber(), dto.getProofImage());
		return ResponseEntity.ok(response);
	}

    @PatchMapping("/returns/{returnId}/payment-request")
    public ResponseEntity<ResponseMsgDto> sendPaymentRequest(
            @PathVariable Long returnId,
            @RequestParam("qrCode") org.springframework.web.multipart.MultipartFile qrCode) {
        ResponseMsgDto response = orderReturnService.sendExchangePaymentRequest(returnId, qrCode);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{orderId}/cancel")
    public ResponseEntity<ResponseMsgDto> adminCancelOrder(@PathVariable Long orderId,
            @Valid @RequestBody OrderCancelRequestDto dto) {
        ResponseMsgDto response = orderReturnService.cancelOrder(orderId, dto, "ADMIN");
        return ResponseEntity.ok(response);
    }
}
