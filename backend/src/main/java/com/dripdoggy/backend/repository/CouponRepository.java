package com.dripdoggy.backend.repository;

import com.dripdoggy.backend.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {
    Optional<Coupon> findByCode(String code);

    @Query("SELECT c FROM Coupon c WHERE c.isDeleted = false OR c.isDeleted IS NULL")
    List<Coupon> findAllActiveCoupons();

    @Query("SELECT c FROM Coupon c WHERE (c.isDeleted = false OR c.isDeleted IS NULL) " +
           "AND c.isActive = true " +
           "AND (c.startingDate IS NULL OR c.startingDate <= :today) " +
           "AND (c.expiryDate IS NULL OR c.expiryDate >= :today) " +
           "AND (c.limit IS NULL OR c.usedCount < c.limit)")
    List<Coupon> findAvailableCoupons(@Param("today") LocalDate today);
}
