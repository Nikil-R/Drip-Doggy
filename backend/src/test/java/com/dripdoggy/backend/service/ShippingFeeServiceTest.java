package com.dripdoggy.backend.service;

import com.dripdoggy.backend.serviceImpl.ShippingFeeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class ShippingFeeServiceTest {

    private ShippingFeeService shippingFeeService;

    @BeforeEach
    public void setUp() {
        shippingFeeService = new ShippingFeeService();
        shippingFeeService.init();
    }

    @Test
    public void testBangaloreCityOverride() {
        // Bangalore override (same city -> BANGALORE zone: 95)
        BigDecimal bangaloreFee1 = shippingFeeService.calculateShippingFee("Karnataka", "Bangalore");
        assertEquals(new BigDecimal("95.0"), bangaloreFee1);

        BigDecimal bangaloreFee2 = shippingFeeService.calculateShippingFee("karnataka", "bengaluru");
        assertEquals(new BigDecimal("95.0"), bangaloreFee2);
    }

    @Test
    public void testKarnatakaOtherDistricts() {
        // Karnataka other district -> KARNATAKA_DISTRICTS zone: 115
        BigDecimal mysoreFee = shippingFeeService.calculateShippingFee("Karnataka", "Mysore");
        assertEquals(new BigDecimal("115.0"), mysoreFee);

        BigDecimal mangaloreFee = shippingFeeService.calculateShippingFee("KARNATAKA", "mangalore");
        assertEquals(new BigDecimal("115.0"), mangaloreFee);
    }

    @Test
    public void testSouthIndiaState() {
        // Tamil Nadu -> SOUTH_INDIA zone: 140
        BigDecimal chennaiFee = shippingFeeService.calculateShippingFee("Tamil Nadu", "Chennai");
        assertEquals(new BigDecimal("140.0"), chennaiFee);
    }

    @Test
    public void testWestCentralIndiaState() {
        // Maharashtra -> WEST_CENTRAL_INDIA zone: 160
        BigDecimal mumbaiFee = shippingFeeService.calculateShippingFee("Maharashtra", "Mumbai");
        assertEquals(new BigDecimal("160.0"), mumbaiFee);
    }

    @Test
    public void testNorthEastIndiaState() {
        // Delhi -> NORTH_EAST_INDIA zone: 185
        BigDecimal delhiFee = shippingFeeService.calculateShippingFee("Delhi", "New Delhi");
        assertEquals(new BigDecimal("185.0"), delhiFee);
    }

    @Test
    public void testRemoteOdaState() {
        // J&K -> REMOTE_ODA zone: 270
        BigDecimal jkFee = shippingFeeService.calculateShippingFee("Jammu and Kashmir", "Srinagar");
        assertEquals(new BigDecimal("270.0"), jkFee);
    }

    @Test
    public void testUnknownStateFallback() {
        // Unknown or null state -> Fallback (WEST_CENTRAL_INDIA zone: 160)
        BigDecimal unknownFee = shippingFeeService.calculateShippingFee("Unknown State", "Unknown City");
        assertEquals(new BigDecimal("160.0"), unknownFee);

        BigDecimal nullFee = shippingFeeService.calculateShippingFee(null, null);
        assertEquals(new BigDecimal("160.0"), nullFee);
    }
}
