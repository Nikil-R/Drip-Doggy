package com.dripdoggy.backend.Iservice;

import com.dripdoggy.backend.RequestDto.AddressRequestDto;
import com.dripdoggy.backend.ResponseDto.AddressListResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;

public interface IAddressService {
    AddressListResponseDto getUserAddresses();
    
    ResponseMsgDto createUserAddress(AddressRequestDto request);
    
    ResponseMsgDto updateUserAddress(Long addressId, AddressRequestDto request);
    
    ResponseMsgDto deleteUserAddress(Long addressId);
    
    ResponseMsgDto setDefaultAddress(Long addressId);
}
