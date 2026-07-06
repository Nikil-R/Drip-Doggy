package com.dripdoggy.backend.Iservice;

import com.dripdoggy.backend.ResponseDto.CustomerListResponseDto;
import com.dripdoggy.backend.ResponseDto.CustomerDetailResponseDto;
import com.dripdoggy.backend.ResponseDto.CustomerStatsResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;

public interface ICustomerService {
    CustomerListResponseDto getAllCustomers();
    CustomerDetailResponseDto getCustomerDetails(Long customerId);
    CustomerStatsResponseDto getCustomerStats();
    ResponseMsgDto toggleCustomerBlockStatus(Long customerId);
}
