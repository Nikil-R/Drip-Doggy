package com.dripdoggy.backend.serviceImpl;

import com.dripdoggy.backend.Iservice.ICouponService;
import com.dripdoggy.backend.RequestDto.CouponRequestDto;
import com.dripdoggy.backend.ResponseDto.CouponResponseDto;
import com.dripdoggy.backend.ResponseDto.CouponValidationResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.entity.Coupon;
import com.dripdoggy.backend.entity.User;
import com.dripdoggy.backend.enums.DiscountType;
import com.dripdoggy.backend.exception.CouponExpiredException;
import com.dripdoggy.backend.exception.CouponFirstOrderOnlyException;
import com.dripdoggy.backend.exception.CouponNotFoundException;
import com.dripdoggy.backend.exception.DiscountNotAppliedException;
import com.dripdoggy.backend.exception.InvalidCredentialsException;
import com.dripdoggy.backend.entity.CouponUsage;
import com.dripdoggy.backend.repository.CouponRepository;
import com.dripdoggy.backend.repository.UserRepository;
import com.dripdoggy.backend.repository.CouponUsageRepository;
import java.time.LocalDateTime;
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
    private final UserRepository userRepository;
    private final CouponUsageRepository couponUsageRepository;

    @Autowired
    public CouponService(CouponRepository couponRepository, UserRepository userRepository, CouponUsageRepository couponUsageRepository) {
        this.couponRepository = couponRepository;
        this.userRepository = userRepository;
        this.couponUsageRepository = couponUsageRepository;
    }

    @Override
    public ResponseMsgDto createCoupon(CouponRequestDto couponDto) {
        if (couponRepository.findByCode(couponDto.getCode().toUpperCase().trim()).isPresent()) {
            throw new CouponNotFoundException("Coupon code already exists: " + couponDto.getCode());
        }

        Coupon coupon = new Coupon();
        coupon.setCode(couponDto.getCode().toUpperCase().trim());
        DiscountType mappedType = mapToDiscountType(couponDto.getDiscountType());
        coupon.setDiscountType(mappedType);
        
        // Enforce 0 value for free shipping
        if (mappedType == DiscountType.FREE_SHIPPING) {
            coupon.setDiscountValue(BigDecimal.ZERO);
        } else {
            coupon.setDiscountValue(couponDto.getDiscountValue());
        }

        coupon.setMinOrder(couponDto.getMinOrder());
        coupon.setStartingDate(couponDto.getStartingDate());
        coupon.setExpiryDate(couponDto.getExpiryDate());
        coupon.setLimit(couponDto.getLimit());
        coupon.setIsActive(couponDto.getIsActive() != null ? couponDto.getIsActive() : true);
        coupon.setDescription(couponDto.getDescription());
        coupon.setUsedCount(0);
        coupon.setFirstOrderOnly(couponDto.getFirstOrderOnly() != null ? couponDto.getFirstOrderOnly() : false);
        coupon.setIsDeleted(false);

        couponRepository.save(coupon);

        if (coupon.getExpiryDate() == null) {
            return new ResponseMsgDto(201, "This coupon is set for unlimited days.");
        } else {
            return new ResponseMsgDto(201, "This coupon is valid till " + coupon.getExpiryDate());
        }
    }

    @Override
    public List<CouponResponseDto> fetchAllCoupons() {
        return couponRepository.findAllActiveCoupons().stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public CouponResponseDto fetchCouponById(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new CouponNotFoundException("Coupon not found"));
        if (Boolean.TRUE.equals(coupon.getIsDeleted())) {
            throw new CouponNotFoundException("Coupon not found");
        }
        return convertToResponseDto(coupon);
    }

    @Override
    public ResponseMsgDto updateCoupon(Long id, CouponRequestDto couponDto) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new CouponNotFoundException("Coupon not found"));
        if (Boolean.TRUE.equals(coupon.getIsDeleted())) {
            throw new CouponNotFoundException("Coupon not found");
        }

        String newCode = couponDto.getCode().toUpperCase().trim();
        if (!coupon.getCode().equals(newCode) && couponRepository.findByCode(newCode).isPresent()) {
            throw new IllegalArgumentException("Coupon code already exists: " + newCode);
        }

        coupon.setCode(newCode);
        DiscountType mappedType = mapToDiscountType(couponDto.getDiscountType());
        coupon.setDiscountType(mappedType);
        
        // Enforce 0 value for free shipping
        if (mappedType == DiscountType.FREE_SHIPPING) {
            coupon.setDiscountValue(BigDecimal.ZERO);
        } else {
            coupon.setDiscountValue(couponDto.getDiscountValue());
        }

        coupon.setMinOrder(couponDto.getMinOrder());
        coupon.setStartingDate(couponDto.getStartingDate());
        coupon.setExpiryDate(couponDto.getExpiryDate());
        coupon.setLimit(couponDto.getLimit());
        coupon.setIsActive(couponDto.getIsActive() != null ? couponDto.getIsActive() : true);
        coupon.setDescription(couponDto.getDescription());
        coupon.setFirstOrderOnly(couponDto.getFirstOrderOnly() != null ? couponDto.getFirstOrderOnly() : false);

        couponRepository.save(coupon);

        if (coupon.getExpiryDate() == null) {
            return new ResponseMsgDto(200, "This coupon is set for unlimited days.");
        } else {
            return new ResponseMsgDto(200, "This coupon is valid till " + coupon.getExpiryDate());
        }
    }

    @Override
    public ResponseMsgDto deleteCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new CouponNotFoundException("Coupon not found"));
        if (Boolean.TRUE.equals(coupon.getIsDeleted())) {
            throw new CouponNotFoundException("Coupon not found");
        }
        
        coupon.setIsDeleted(true);
        coupon.setIsActive(false);
        coupon.setCode(coupon.getCode() + "_DELETED_" + System.currentTimeMillis());
        couponRepository.save(coupon);
        
        return new ResponseMsgDto(200, "Coupon deleted successfully.");
    }

    @Override
    public ResponseMsgDto toggleCouponIsActive(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new CouponNotFoundException("Coupon not found"));
        if (Boolean.TRUE.equals(coupon.getIsDeleted())) {
            throw new CouponNotFoundException("Coupon not found");
        }
        coupon.setIsActive(!Boolean.TRUE.equals(coupon.getIsActive()));
        couponRepository.save(coupon);
        return new ResponseMsgDto(200, "Coupon status updated to " + (coupon.getIsActive() ? "Active" : "Inactive") + " successfully.");
    }

    @Override
    @Transactional(readOnly = true)
    public CouponValidationResponseDto validateAndCalculateDiscount(String code, BigDecimal orderAmount) {
        Coupon coupon = couponRepository.findByCode(code.toUpperCase().trim())
                .orElseThrow(() -> new CouponNotFoundException("Coupon not found"));
        if (Boolean.TRUE.equals(coupon.getIsDeleted())) {
            throw new CouponNotFoundException("Coupon not found");
        }

        // 0. Retrieve current authenticated user and enforce registration
        User user = getOptionalCurrentUser();
        if (user == null) {
            throw new InvalidCredentialsException("Access Denied: User must be authenticated to apply coupons.");
        }

        // Check if this coupon has already been used by the customer
        if (couponUsageRepository.existsByUserAndCoupon(user, coupon)) {
            throw new DiscountNotAppliedException("This coupon has already been used by you.");
        }

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

        // 5. Check First Order Only
        if (Boolean.TRUE.equals(coupon.getFirstOrderOnly())) {
            if (user.getOrders() != null && !user.getOrders().isEmpty()) {
                throw new CouponFirstOrderOnlyException("This coupon is valid for first order only.");
            }
        }

        // 6. Check Minimum Order Amount
        if (coupon.getMinOrder() != null && orderAmount.compareTo(coupon.getMinOrder()) < 0) {
            throw new DiscountNotAppliedException("Minimum spend of ₹" + coupon.getMinOrder() + " is required to apply this coupon.");
        }

        // 7. Calculate Discount Amount
        BigDecimal calculatedDiscount = BigDecimal.ZERO;
        boolean isFreeShipping = false;

        DiscountType type = coupon.getDiscountType();
        if (type == DiscountType.PERCENTAGE) {
            BigDecimal percent = coupon.getDiscountValue();
            calculatedDiscount = orderAmount.multiply(percent).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        } else if (type == DiscountType.FLAT) {
            BigDecimal flatAmount = coupon.getDiscountValue();
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
                .orElseThrow(() -> new CouponNotFoundException("Coupon not found"));
        if (Boolean.TRUE.equals(coupon.getIsDeleted())) {
            throw new CouponNotFoundException("Coupon not found");
        }
        
        // Save coupon usage details
        User user = getOptionalCurrentUser();
        if (user != null) {
            CouponUsage usage = new CouponUsage(user, coupon, LocalDateTime.now());
            couponUsageRepository.save(usage);
        }

        coupon.setUsedCount(coupon.getUsedCount() + 1);
        if (coupon.getLimit() != null && coupon.getUsedCount() >= coupon.getLimit()) {
            coupon.setIsActive(false);
        }
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
                coupon.getDescription(),
                coupon.getFirstOrderOnly()
        );
    }

    private User getOptionalCurrentUser() {
        try {
            org.springframework.security.core.Authentication authentication =
                    org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && !authentication.getName().equals("anonymousUser")) {
                String principalName = authentication.getName();
                if (principalName.contains("@")) {
                    return userRepository.findByEmail(principalName).orElse(null);
                } else {
                    String alternative = principalName.startsWith("+") ? principalName.substring(1) : "+" + principalName;
                    return userRepository.findByPhoneNo(principalName)
                            .or(() -> userRepository.findByPhoneNo(alternative))
                            .orElse(null);
                }
            }
        } catch (Exception e) {
            // ignore
        }
        return null;
    }
}
