package com.dripdoggy.backend.Iservice;

import com.dripdoggy.backend.ResponseDto.AdminOrderResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.enums.DeliveryStatus;

import java.util.List;

public interface IAdminOrderService {
    List<AdminOrderResponseDto> getAllOrders();
    AdminOrderResponseDto getOrderDetails(Long id);
    ResponseMsgDto updateOrderStatus(Long id, DeliveryStatus status);
    ResponseMsgDto updateOrderTracking(Long id, String trackingNumber);
}
