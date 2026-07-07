package com.dripdoggy.backend.entity;

import com.dripdoggy.backend.enums.DiscountType;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "coupons")
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type")
    private DiscountType discountType;

    @Column(name = "discount_value")
    private BigDecimal discountValue;

    @Column(name = "min_order")
    private BigDecimal minOrder;

    @Column(name = "starting_date")
    private LocalDate startingDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "usage_limit")
    private Integer limit;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "description")
    private String description;

    @Column(name = "used_count", nullable = false)
    private Integer usedCount = 0;

    @Column(name = "first_order_only", nullable = false)
    private Boolean firstOrderOnly = false;

    @OneToMany(mappedBy = "coupon", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CouponFilter> couponFilters;

    // Constructors
    public Coupon() {
    }

    public Coupon(Long id, String code, DiscountType discountType, BigDecimal discountValue, BigDecimal minOrder, LocalDate startingDate, LocalDate expiryDate, Integer limit, Boolean isActive, List<CouponFilter> couponFilters) {
        this.id = id;
        this.code = code;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.minOrder = minOrder;
        this.startingDate = startingDate;
        this.expiryDate = expiryDate;
        this.limit = limit;
        this.isActive = isActive;
        this.couponFilters = couponFilters;
        this.usedCount = 0;
        this.firstOrderOnly = false;
    }

    public Coupon(Long id, String code, DiscountType discountType, BigDecimal discountValue, BigDecimal minOrder, LocalDate startingDate, LocalDate expiryDate, Integer limit, Boolean isActive, List<CouponFilter> couponFilters, String description, Integer usedCount, Boolean firstOrderOnly) {
        this.id = id;
        this.code = code;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.minOrder = minOrder;
        this.startingDate = startingDate;
        this.expiryDate = expiryDate;
        this.limit = limit;
        this.isActive = isActive;
        this.couponFilters = couponFilters;
        this.description = description;
        this.usedCount = usedCount != null ? usedCount : 0;
        this.firstOrderOnly = firstOrderOnly != null ? firstOrderOnly : false;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public DiscountType getDiscountType() {
        return discountType;
    }

    public void setDiscountType(DiscountType discountType) {
        this.discountType = discountType;
    }

    public BigDecimal getDiscountValue() {
        return discountValue;
    }

    public void setDiscountValue(BigDecimal discountValue) {
        this.discountValue = discountValue;
    }

    public BigDecimal getMinOrder() {
        return minOrder;
    }

    public void setMinOrder(BigDecimal minOrder) {
        this.minOrder = minOrder;
    }

    public LocalDate getStartingDate() {
        return startingDate;
    }

    public void setStartingDate(LocalDate startingDate) {
        this.startingDate = startingDate;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public Integer getLimit() {
        return limit;
    }

    public void setLimit(Integer limit) {
        this.limit = limit;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public List<CouponFilter> getCouponFilters() {
        return couponFilters;
    }

    public void setCouponFilters(List<CouponFilter> couponFilters) {
        this.couponFilters = couponFilters;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getUsedCount() {
        return usedCount;
    }

    public void setUsedCount(Integer usedCount) {
        this.usedCount = usedCount;
    }

    public Boolean getFirstOrderOnly() {
        return firstOrderOnly;
    }

    public void setFirstOrderOnly(Boolean firstOrderOnly) {
        this.firstOrderOnly = firstOrderOnly;
    }
}
