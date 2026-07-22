package com.dripdoggy.backend.Iservice;

import com.dripdoggy.backend.RequestDto.CustomerProfileRequestDto;
import com.dripdoggy.backend.RequestDto.ProfileContactOtpRequestDto;
import com.dripdoggy.backend.RequestDto.ProfileContactOtpVerifyDto;
import com.dripdoggy.backend.ResponseDto.CustomerProfileResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;

public interface ICustomerProfileService {
    CustomerProfileResponseDto getCustomerProfile();
    CustomerProfileResponseDto updateCustomerProfile(CustomerProfileRequestDto dto);
    ResponseMsgDto sendContactUpdateOtp(ProfileContactOtpRequestDto dto);
    CustomerProfileResponseDto verifyAndUpdateContact(ProfileContactOtpVerifyDto dto);
}
