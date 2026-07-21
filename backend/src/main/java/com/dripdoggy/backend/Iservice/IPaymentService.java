package com.dripdoggy.backend.Iservice;

import com.dripdoggy.backend.RequestDto.BankSettlementRequestDto;
import com.dripdoggy.backend.ResponseDto.PaymentLedgerFullResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.entity.Orders;
import com.dripdoggy.backend.entity.Payment;
import com.dripdoggy.backend.enums.DeliveryStatus;

public interface IPaymentService {

    PaymentLedgerFullResponseDto getPaymentLedger(String status, String dateRange, String search);

    ResponseMsgDto updateBankSettlement(String orderNumber, BankSettlementRequestDto request);

    Payment createPaymentRecordForOrder(Orders order);

    void syncPaymentOnOrderStatusChange(Orders order, DeliveryStatus newDeliveryStatus);
}
