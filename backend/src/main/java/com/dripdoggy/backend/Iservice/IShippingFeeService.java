package com.dripdoggy.backend.Iservice;

import java.math.BigDecimal;

public interface IShippingFeeService {
    BigDecimal calculateShippingFee(String stateInput, String cityInput);
    BigDecimal calculateShippingFee(String stateInput, String cityInput, String deliveryMethod);
}
