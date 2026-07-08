package com.dripdoggy.backend.Iservice;

import com.dripdoggy.backend.RequestDto.CouponRequestDto;
import com.dripdoggy.backend.ResponseDto.CouponResponseDto;
import com.dripdoggy.backend.ResponseDto.CustomerCouponResponseDto;
import com.dripdoggy.backend.ResponseDto.CouponValidationResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;

import java.math.BigDecimal;
import java.util.List;

public interface ICouponService {
    ResponseMsgDto createCoupon(CouponRequestDto couponDto);
    List<CouponResponseDto> fetchAllCoupons();
    CouponResponseDto fetchCouponById(Long id);
    ResponseMsgDto updateCoupon(Long id, CouponRequestDto couponDto);
    ResponseMsgDto deleteCoupon(Long id);
    ResponseMsgDto toggleCouponIsActive(Long id);
    CouponValidationResponseDto validateAndCalculateDiscount(String code, BigDecimal orderAmount);
    void incrementUsageCount(String code);
    List<CustomerCouponResponseDto> fetchAvailableCoupons();
}
