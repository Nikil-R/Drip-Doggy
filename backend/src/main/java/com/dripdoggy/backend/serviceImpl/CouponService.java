package com.dripdoggy.backend.serviceImpl;

import com.dripdoggy.backend.Iservice.ICouponService;
import com.dripdoggy.backend.RequestDto.CouponRequestDto;
import com.dripdoggy.backend.ResponseDto.CouponResponseDto;
import com.dripdoggy.backend.ResponseDto.CouponValidationResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.entity.Coupon;
import com.dripdoggy.backend.enums.DiscountType;
import com.dripdoggy.backend.exception.CouponExpiredException;
import com.dripdoggy.backend.exception.CouponNotFoundException;
import com.dripdoggy.backend.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CouponService implements ICouponService {

    private final CouponRepository couponRepository;

    @Autowired
    public CouponService(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    @Override
    public ResponseMsgDto createCoupon(CouponRequestDto couponDto) {
        if (couponRepository.findByCode(couponDto.getCode().toUpperCase().trim()).isPresent()) {
            throw new IllegalArgumentException("Coupon code already exists: " + couponDto.getCode());
        }

        Coupon coupon = new Coupon();
        coupon.setCode(couponDto.getCode().toUpperCase().trim());
        coupon.setDiscountType(mapToDiscountType(couponDto.getDiscountType()));
        coupon.setDiscountValue(couponDto.getDiscountValue());
        coupon.setMinOrder(couponDto.getMinOrder());
        coupon.setStartingDate(couponDto.getStartingDate());
        coupon.setExpiryDate(couponDto.getExpiryDate());
        coupon.setLimit(couponDto.getLimit());
        coupon.setIsActive(couponDto.getIsActive() != null ? couponDto.getIsActive() : true);
        coupon.setDescription(couponDto.getDescription());
        coupon.setUsedCount(0);

        couponRepository.save(coupon);
        return new ResponseMsgDto(201, "Coupon created successfully.");
    }

    @Override
    public List<CouponResponseDto> fetchAllCoupons() {
        return couponRepository.findAll().stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public CouponResponseDto fetchCouponById(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new CouponNotFoundException("Coupon not found with ID: " + id));
        return convertToResponseDto(coupon);
    }

    @Override
    public ResponseMsgDto updateCoupon(Long id, CouponRequestDto couponDto) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new CouponNotFoundException("Coupon not found with ID: " + id));

        // Check if new code conflicts with another coupon
        String newCode = couponDto.getCode().toUpperCase().trim();
        if (!coupon.getCode().equals(newCode) && couponRepository.findByCode(newCode).isPresent()) {
            throw new IllegalArgumentException("Coupon code already exists: " + newCode);
        }

        coupon.setCode(newCode);
        coupon.setDiscountType(mapToDiscountType(couponDto.getDiscountType()));
        coupon.setDiscountValue(couponDto.getDiscountValue());
        coupon.setMinOrder(couponDto.getMinOrder());
        coupon.setStartingDate(couponDto.getStartingDate());
        coupon.setExpiryDate(couponDto.getExpiryDate());
        coupon.setLimit(couponDto.getLimit());
        coupon.setIsActive(couponDto.getIsActive() != null ? couponDto.getIsActive() : true);
        coupon.setDescription(couponDto.getDescription());

        couponRepository.save(coupon);
        return new ResponseMsgDto(200, "Coupon updated successfully.");
    }

    @Override
    public ResponseMsgDto deleteCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new CouponNotFoundException("Coupon not found with ID: " + id));
        couponRepository.delete(coupon);
        return new ResponseMsgDto(200, "Coupon deleted successfully.");
    }

    @Override
    public ResponseMsgDto toggleCouponIsActive(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new CouponNotFoundException("Coupon not found with ID: " + id));
        coupon.setIsActive(!Boolean.TRUE.equals(coupon.getIsActive()));
        couponRepository.save(coupon);
        return new ResponseMsgDto(200, "Coupon status updated to " + (coupon.getIsActive() ? "Active" : "Inactive") + " successfully.");
    }

    @Override
    @Transactional(readOnly = true)
    public CouponValidationResponseDto validateAndCalculateDiscount(String code, BigDecimal orderAmount) {
        Coupon coupon = couponRepository.findByCode(code.toUpperCase().trim())
                .orElseThrow(() -> new CouponNotFoundException("Coupon not found with code: " + code));

        // 1. Check if Coupon is Active
        if (!Boolean.TRUE.equals(coupon.getIsActive())) {
            throw new CouponExpiredException("This coupon is expired.");
        }

        // 2. Check Expiry Date
        LocalDate today = LocalDate.now();
        if (coupon.getExpiryDate() != null && today.isAfter(coupon.getExpiryDate())) {
            throw new CouponExpiredException("This coupon is expired.");
        }

        // 3. Check Starting Date
        if (coupon.getStartingDate() != null && today.isBefore(coupon.getStartingDate())) {
            throw new CouponExpiredException("This coupon is expired.");
        }

        // 4. Check Usage Limit
        if (coupon.getLimit() != null && coupon.getUsedCount() >= coupon.getLimit()) {
            throw new CouponExpiredException("This coupon is expired.");
        }

        // 5. Check Minimum Order Amount
        if (coupon.getMinOrder() != null && orderAmount.compareTo(coupon.getMinOrder()) < 0) {
            throw new IllegalArgumentException("Minimum spend of ₹" + coupon.getMinOrder() + " is required to apply this coupon.");
        }

        // 6. Calculate Discount Amount
        BigDecimal calculatedDiscount = BigDecimal.ZERO;
        boolean isFreeShipping = false;

        DiscountType type = coupon.getDiscountType();
        if (type == DiscountType.PERCENTAGE) {
            BigDecimal percent = coupon.getDiscountValue();
            calculatedDiscount = orderAmount.multiply(percent).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        } else if (type == DiscountType.FLAT) {
            BigDecimal flatAmount = coupon.getDiscountValue();
            // Cap the discount so it doesn't exceed the order amount
            calculatedDiscount = flatAmount.min(orderAmount);
        } else if (type == DiscountType.FREE_SHIPPING) {
            isFreeShipping = true;
        }

        return new CouponValidationResponseDto(
                coupon.getCode(),
                mapToString(coupon.getDiscountType()),
                coupon.getDiscountValue(),
                calculatedDiscount,
                isFreeShipping,
                coupon.getMinOrder(),
                coupon.getDescription()
        );
    }

    @Override
    public void incrementUsageCount(String code) {
        Coupon coupon = couponRepository.findByCode(code.toUpperCase().trim())
                .orElseThrow(() -> new CouponNotFoundException("Coupon not found with code: " + code));
        coupon.setUsedCount(coupon.getUsedCount() + 1);
        couponRepository.save(coupon);
    }

    // Mapping Helpers
    private DiscountType mapToDiscountType(String typeStr) {
        if (typeStr == null) {
            throw new IllegalArgumentException("Discount type cannot be null");
        }
        String normalized = typeStr.trim().toLowerCase();
        if (normalized.equals("percentage") || normalized.equals("percent")) {
            return DiscountType.PERCENTAGE;
        } else if (normalized.equals("flat") || normalized.equals("fixed") || normalized.equals("fixed_amount")) {
            return DiscountType.FLAT;
        } else if (normalized.equals("freeship") || normalized.equals("free_shipping") || normalized.equals("freeshipping")) {
            return DiscountType.FREE_SHIPPING;
        } else {
            try {
                return DiscountType.valueOf(typeStr.toUpperCase().trim());
            } catch (Exception e) {
                throw new IllegalArgumentException("Invalid discount type: " + typeStr);
            }
        }
    }

    private String mapToString(DiscountType discountType) {
        if (discountType == null) return null;
        switch (discountType) {
            case PERCENTAGE:
                return "percentage";
            case FLAT:
                return "flat";
            case FREE_SHIPPING:
                return "freeship";
            default:
                return discountType.name().toLowerCase();
        }
    }

    private CouponResponseDto convertToResponseDto(Coupon coupon) {
        return new CouponResponseDto(
                coupon.getId(),
                coupon.getCode(),
                mapToString(coupon.getDiscountType()),
                coupon.getDiscountValue(),
                coupon.getMinOrder(),
                coupon.getStartingDate(),
                coupon.getExpiryDate(),
                coupon.getLimit(),
                coupon.getUsedCount(),
                coupon.getIsActive(),
                coupon.getDescription()
        );
    }
}
