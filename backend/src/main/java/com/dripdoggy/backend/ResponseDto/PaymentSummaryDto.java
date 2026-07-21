package com.dripdoggy.backend.ResponseDto;

import java.math.BigDecimal;

public class PaymentSummaryDto {

    private BigDecimal totalActiveCashFlow;
    private BigDecimal todayRevenue;
    private long cancelledOrdersCount;
    private BigDecimal lostMoney;

    public PaymentSummaryDto() {
    }

    public PaymentSummaryDto(BigDecimal totalActiveCashFlow, BigDecimal todayRevenue, long cancelledOrdersCount, BigDecimal lostMoney) {
        this.totalActiveCashFlow = totalActiveCashFlow != null ? totalActiveCashFlow : BigDecimal.ZERO;
        this.todayRevenue = todayRevenue != null ? todayRevenue : BigDecimal.ZERO;
        this.cancelledOrdersCount = cancelledOrdersCount;
        this.lostMoney = lostMoney != null ? lostMoney : BigDecimal.ZERO;
    }

    public BigDecimal getTotalActiveCashFlow() {
        return totalActiveCashFlow;
    }

    public void setTotalActiveCashFlow(BigDecimal totalActiveCashFlow) {
        this.totalActiveCashFlow = totalActiveCashFlow;
    }

    public BigDecimal getTodayRevenue() {
        return todayRevenue;
    }

    public void setTodayRevenue(BigDecimal todayRevenue) {
        this.todayRevenue = todayRevenue;
    }

    public long getCancelledOrdersCount() {
        return cancelledOrdersCount;
    }

    public void setCancelledOrdersCount(long cancelledOrdersCount) {
        this.cancelledOrdersCount = cancelledOrdersCount;
    }

    public BigDecimal getLostMoney() {
        return lostMoney;
    }

    public void setLostMoney(BigDecimal lostMoney) {
        this.lostMoney = lostMoney;
    }
}
