package com.dripdoggy.backend.serviceImpl;

import com.dripdoggy.backend.Iservice.IAddressService;
import com.dripdoggy.backend.RequestDto.AddressRequestDto;
import com.dripdoggy.backend.ResponseDto.AddressListResponseDto;
import com.dripdoggy.backend.ResponseDto.AddressResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.entity.Address;
import com.dripdoggy.backend.entity.User;
import com.dripdoggy.backend.exception.*;
import com.dripdoggy.backend.repository.AddressRepository;
import com.dripdoggy.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AddressService implements IAddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    @Autowired
    public AddressService(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        org.springframework.security.core.Authentication authentication = 
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new InvalidCredentialsException("Access Denied: User must be authenticated.");
        }
        String principalName = authentication.getName();
        if (principalName.contains("@")) {
            return userRepository.findByEmail(principalName)
                    .orElseThrow(() -> new EmailNotFoundException("Email address is not registered: " + principalName));
        } else {
            String alternative = principalName.startsWith("+") ? principalName.substring(1) : "+" + principalName;
            return userRepository.findByPhoneNo(principalName)
                    .or(() -> userRepository.findByPhoneNo(alternative))
                    .orElseThrow(() -> new PhoneNotFoundException("Phone number is not registered: " + principalName));
        }
    }

    private void validateRegisteredUser(User user) {
        if (user.getFirstName() == null || user.getFirstName().trim().isEmpty()) {
            throw new UserNotRegisteredException("Register through the OTP, then you can.");
        }
    }

    @Override
    public AddressListResponseDto getUserAddresses() {
        User user = getCurrentUser();
        validateRegisteredUser(user);

        List<Address> addresses = addressRepository.findByUserAndIsActiveTrue(user);
        List<AddressResponseDto> dtoList = new ArrayList<>();

        for (Address addr : addresses) {
            AddressResponseDto dto = new AddressResponseDto();
            dto.setId(addr.getId());
            dto.setType(addr.getAddressType());
            dto.setFirstName(addr.getFirstName());
            dto.setLastName(addr.getLastName());
            dto.setBuildingNo(addr.getBuildingNo());
            dto.setBuildingName(addr.getBuildingName());
            dto.setStreet(addr.getStreetName());
            dto.setArea(addr.getArea());
            dto.setCity(addr.getCity());
            dto.setState(addr.getState());
            dto.setPostalCode(addr.getPincode());
            dto.setPhone(addr.getPhoneNo());
            dto.setIsDefault(addr.getIsDefault());
            dtoList.add(dto);
        }

        return new AddressListResponseDto(200, "Addresses fetched successfully", dtoList);
    }

    @Override
    public ResponseMsgDto createUserAddress(AddressRequestDto request) {
        User user = getCurrentUser();
        validateRegisteredUser(user);

        // Fetch existing active addresses to determine if this is the first address
        List<Address> activeAddresses = addressRepository.findByUserAndIsActiveTrue(user);
        boolean isFirstAddress = activeAddresses.isEmpty();

        // If this address is requested to be default, or if it's the first address, set all other active addresses to non-default
        boolean shouldBeDefault = isFirstAddress || Boolean.TRUE.equals(request.getIsDefault());
        if (shouldBeDefault) {
            for (Address addr : activeAddresses) {
                if (Boolean.TRUE.equals(addr.getIsDefault())) {
                    addr.setIsDefault(false);
                    addressRepository.save(addr);
                }
            }
        }

        Address address = new Address();
        address.setUser(user);
        address.setFirstName(request.getFirstName());
        address.setLastName(request.getLastName());
        address.setPhoneNo(request.getPhone());
        address.setBuildingNo(request.getBuildingNo());
        address.setBuildingName(request.getBuildingName());
        address.setStreetName(request.getStreet());
        address.setArea(request.getArea());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPostalCode());
        address.setCountry("India"); // Default country
        address.setAddressType(request.getType());
        address.setIsDefault(shouldBeDefault);
        address.setIsActive(true);

        addressRepository.save(address);

        return new ResponseMsgDto(201, "Address created successfully");
    }

    @Override
    public ResponseMsgDto updateUserAddress(Long addressId, AddressRequestDto request) {
        User user = getCurrentUser();
        validateRegisteredUser(user);

        Address address = addressRepository.findByIdAndUserAndIsActiveTrue(addressId, user)
                .orElseThrow(() -> new AddressNotFoundException("Address not found"));

        List<Address> activeAddresses = addressRepository.findByUserAndIsActiveTrue(user);

        // Handle default address transition
        boolean shouldBeDefault = Boolean.TRUE.equals(request.getIsDefault());
        if (shouldBeDefault && !Boolean.TRUE.equals(address.getIsDefault())) {
            for (Address addr : activeAddresses) {
                if (!addr.getId().equals(addressId) && Boolean.TRUE.equals(addr.getIsDefault())) {
                    addr.setIsDefault(false);
                    addressRepository.save(addr);
                }
            }
            address.setIsDefault(true);
        } else if (!shouldBeDefault && Boolean.TRUE.equals(address.getIsDefault())) {
            // Cannot unset default if it's the only address
            if (activeAddresses.size() > 1) {
                address.setIsDefault(false);
                // Assign default to another address
                Address another = activeAddresses.stream()
                        .filter(a -> !a.getId().equals(addressId))
                        .findFirst()
                        .orElse(null);
                if (another != null) {
                    another.setIsDefault(true);
                    addressRepository.save(another);
                }
            } else {
                // If it is the only address, it must remain default
                address.setIsDefault(true);
            }
        }

        address.setFirstName(request.getFirstName());
        address.setLastName(request.getLastName());
        address.setPhoneNo(request.getPhone());
        address.setBuildingNo(request.getBuildingNo());
        address.setBuildingName(request.getBuildingName());
        address.setStreetName(request.getStreet());
        address.setArea(request.getArea());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPostalCode());
        address.setAddressType(request.getType());

        addressRepository.save(address);

        return new ResponseMsgDto(200, "Address updated successfully");
    }

    @Override
    public ResponseMsgDto deleteUserAddress(Long addressId) {
        User user = getCurrentUser();
        validateRegisteredUser(user);

        Address address = addressRepository.findByIdAndUserAndIsActiveTrue(addressId, user)
                .orElseThrow(() -> new AddressNotFoundException("Address not found"));

        boolean wasDefault = Boolean.TRUE.equals(address.getIsDefault());

        address.setIsActive(false);
        address.setIsDefault(false);
        addressRepository.save(address);

        // If the deleted address was default, set another remaining active address to default
        if (wasDefault) {
            List<Address> remaining = addressRepository.findByUserAndIsActiveTrue(user);
            if (!remaining.isEmpty()) {
                Address firstRemaining = remaining.get(0);
                firstRemaining.setIsDefault(true);
                addressRepository.save(firstRemaining);
            }
        }

        return new ResponseMsgDto(200, "Address deleted successfully");
    }

    @Override
    public ResponseMsgDto setDefaultAddress(Long addressId) {
        User user = getCurrentUser();
        validateRegisteredUser(user);

        Address address = addressRepository.findByIdAndUserAndIsActiveTrue(addressId, user)
                .orElseThrow(() -> new AddressNotFoundException("Address not found"));

        if (!Boolean.TRUE.equals(address.getIsDefault())) {
            List<Address> activeAddresses = addressRepository.findByUserAndIsActiveTrue(user);
            for (Address addr : activeAddresses) {
                if (!addr.getId().equals(addressId) && Boolean.TRUE.equals(addr.getIsDefault())) {
                    addr.setIsDefault(false);
                    addressRepository.save(addr);
                }
            }
            address.setIsDefault(true);
            addressRepository.save(address);
        }

        return new ResponseMsgDto(200, "Address set as default successfully");
    }
}
