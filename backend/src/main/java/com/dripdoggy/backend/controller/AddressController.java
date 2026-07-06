package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.IAddressService;
import com.dripdoggy.backend.RequestDto.AddressRequestDto;
import com.dripdoggy.backend.ResponseDto.AddressListResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/address")
public class AddressController {

    private final IAddressService addressService;

    @Autowired
    public AddressController(IAddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping
    public ResponseEntity<AddressListResponseDto> getUserAddresses() {
        AddressListResponseDto response = addressService.getUserAddresses();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ResponseMsgDto> createUserAddress(@Valid @RequestBody AddressRequestDto request) {
        ResponseMsgDto response = addressService.createUserAddress(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{addressId}")
    public ResponseEntity<ResponseMsgDto> updateUserAddress(
            @PathVariable Long addressId,
            @Valid @RequestBody AddressRequestDto request) {
        ResponseMsgDto response = addressService.updateUserAddress(addressId, request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{addressId}")
    public ResponseEntity<ResponseMsgDto> deleteUserAddress(@PathVariable Long addressId) {
        ResponseMsgDto response = addressService.deleteUserAddress(addressId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/{addressId}/default")
    public ResponseEntity<ResponseMsgDto> setDefaultAddress(@PathVariable Long addressId) {
        ResponseMsgDto response = addressService.setDefaultAddress(addressId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
