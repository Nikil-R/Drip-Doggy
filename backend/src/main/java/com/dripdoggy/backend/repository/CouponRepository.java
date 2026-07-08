package com.dripdoggy.backend.repository;

import com.dripdoggy.backend.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {
    Optional<Coupon> findByCode(String code);

    @Query("SELECT c FROM Coupon c WHERE c.isDeleted = false OR c.isDeleted IS NULL")
    List<Coupon> findAllActiveCoupons();
}
