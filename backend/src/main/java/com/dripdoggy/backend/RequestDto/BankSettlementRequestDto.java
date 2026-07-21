package com.dripdoggy.backend.RequestDto;

import com.dripdoggy.backend.enums.BankSettlementStatus;

public class BankSettlementRequestDto {

    private BankSettlementStatus bankSettlementStatus;

    public BankSettlementRequestDto() {
    }

    public BankSettlementRequestDto(BankSettlementStatus bankSettlementStatus) {
        this.bankSettlementStatus = bankSettlementStatus;
    }

    public BankSettlementStatus getBankSettlementStatus() {
        return bankSettlementStatus;
    }

    public void setBankSettlementStatus(BankSettlementStatus bankSettlementStatus) {
        this.bankSettlementStatus = bankSettlementStatus;
    }
}
