package com.dripdoggy.backend.Iservice;

import com.dripdoggy.backend.RequestDto.OrderRequestDto;
import com.dripdoggy.backend.RequestDto.OrderPreviewRequestDto;
import com.dripdoggy.backend.RequestDto.CheckoutOtpRequest;
import com.dripdoggy.backend.RequestDto.CheckoutOtpVerifyRequest;
import com.dripdoggy.backend.ResponseDto.OrderResponseDto;
import com.dripdoggy.backend.ResponseDto.OrderPreviewResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;

public interface IOrderService {
    ResponseMsgDto sendCheckoutOtp(CheckoutOtpRequest request);
    ResponseMsgDto verifyCheckoutOtp(CheckoutOtpVerifyRequest request);
    OrderResponseDto placeOrder(OrderRequestDto request);
    OrderPreviewResponseDto previewOrder(OrderPreviewRequestDto request);
}
