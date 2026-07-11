package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.IAdminOrderService;
import com.dripdoggy.backend.RequestDto.StatusUpdateRequest;
import com.dripdoggy.backend.RequestDto.TrackingUpdateRequest;
import com.dripdoggy.backend.ResponseDto.AdminOrderResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    private final IAdminOrderService adminOrderService;

    @Autowired
    public AdminOrderController(IAdminOrderService adminOrderService) {
        this.adminOrderService = adminOrderService;
    }

    @GetMapping
    public ResponseEntity<List<AdminOrderResponseDto>> getAllOrders() {
        List<AdminOrderResponseDto> orders = adminOrderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminOrderResponseDto> getOrderDetails(@PathVariable Long id) {
        AdminOrderResponseDto order = adminOrderService.getOrderDetails(id);
        return ResponseEntity.ok(order);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ResponseMsgDto> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request) {
        ResponseMsgDto response = adminOrderService.updateOrderStatus(id, request.getStatus());
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/tracking")
    public ResponseEntity<ResponseMsgDto> updateOrderTracking(
            @PathVariable Long id,
            @RequestBody TrackingUpdateRequest request) {
        ResponseMsgDto response = adminOrderService.updateOrderTracking(id, request.getTrackingNumber());
        return ResponseEntity.ok(response);
    }
}
