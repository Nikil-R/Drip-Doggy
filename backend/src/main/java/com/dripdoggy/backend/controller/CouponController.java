package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.ICouponService;
import com.dripdoggy.backend.RequestDto.CouponRequestDto;
import com.dripdoggy.backend.RequestDto.CouponValidateRequestDto;
import com.dripdoggy.backend.ResponseDto.CouponResponseDto;
import com.dripdoggy.backend.ResponseDto.CouponValidationResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CouponController {

    private final ICouponService couponService;

    @Autowired
    public CouponController(ICouponService couponService) {
        this.couponService = couponService;
    }

    // ─── ADMIN ENDPOINTS ───

    @PostMapping("/api/admin/coupons")
    public ResponseEntity<ResponseMsgDto> createCoupon(@Valid @RequestBody CouponRequestDto couponDto) {
        ResponseMsgDto response = couponService.createCoupon(couponDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/api/admin/coupons")
    public ResponseEntity<List<CouponResponseDto>> fetchAllCoupons() {
        List<CouponResponseDto> response = couponService.fetchAllCoupons();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/api/admin/coupons/{id}")
    public ResponseEntity<CouponResponseDto> fetchCouponById(@PathVariable Long id) {
        CouponResponseDto response = couponService.fetchCouponById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/api/admin/coupons/{id}")
    public ResponseEntity<ResponseMsgDto> updateCoupon(
            @PathVariable Long id,
            @Valid @RequestBody CouponRequestDto couponDto) {
        ResponseMsgDto response = couponService.updateCoupon(id, couponDto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/api/admin/coupons/{id}")
    public ResponseEntity<ResponseMsgDto> deleteCoupon(@PathVariable Long id) {
        ResponseMsgDto response = couponService.deleteCoupon(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/api/admin/coupons/{id}")
    public ResponseEntity<ResponseMsgDto> toggleCouponStatus(@PathVariable Long id) {
        ResponseMsgDto response = couponService.toggleCouponIsActive(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // ─── PUBLIC ENDPOINTS ───

    @PostMapping("/api/public/coupons/validate")
    public ResponseEntity<CouponValidationResponseDto> validateCoupon(
            @Valid @RequestBody CouponValidateRequestDto request) {
        CouponValidationResponseDto response = couponService.validateAndCalculateDiscount(
                request.getCode(),
                request.getOrderAmount()
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
