package com.dripdoggy.backend.Iservice;

import com.dripdoggy.backend.RequestDto.OrderCancelRequestDto;
import com.dripdoggy.backend.RequestDto.ReturnSubmitRequestDto;
import com.dripdoggy.backend.RequestDto.ExchangeSubmitRequestDto;
import com.dripdoggy.backend.ResponseDto.AdminReturnResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IOrderReturnService {
    ResponseMsgDto createReturnRequest(Long orderId, ReturnSubmitRequestDto dto);
    ResponseMsgDto createExchangeRequest(Long orderId, ExchangeSubmitRequestDto dto);
    ResponseMsgDto cancelOrder(Long orderId, OrderCancelRequestDto dto, String cancelledBy);
    List<AdminReturnResponseDto> getAllReturnRequests();
    AdminReturnResponseDto getReturnRequestById(Long returnId);
    ResponseMsgDto updateReturnStatus(Long returnId, String status);
    ResponseMsgDto resolveReturnRequest(Long returnId, String action, String trackingNumber, String transactionId);
    ResponseMsgDto handleUnavailabilityChoice(Long returnId, String choice);
}
