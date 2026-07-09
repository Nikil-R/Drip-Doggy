package com.dripdoggy.backend.repository;

import com.dripdoggy.backend.entity.Coupon;
import com.dripdoggy.backend.entity.CouponUsage;
import com.dripdoggy.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CouponUsageRepository extends JpaRepository<CouponUsage, Long> {
    boolean existsByUserAndCoupon(User user, Coupon coupon);
}
