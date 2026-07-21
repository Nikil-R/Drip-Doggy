package com.dripdoggy.backend.ResponseDto;

import java.util.List;

public class PaymentLedgerFullResponseDto {

    private PaymentSummaryDto summary;
    private List<PaymentItemDto> payments;

    public PaymentLedgerFullResponseDto() {
    }

    public PaymentLedgerFullResponseDto(PaymentSummaryDto summary, List<PaymentItemDto> payments) {
        this.summary = summary;
        this.payments = payments;
    }

    public PaymentSummaryDto getSummary() {
        return summary;
    }

    public void setSummary(PaymentSummaryDto summary) {
        this.summary = summary;
    }

    public List<PaymentItemDto> getPayments() {
        return payments;
    }

    public void setPayments(List<PaymentItemDto> payments) {
        this.payments = payments;
    }
}
