package com.dripdoggy.backend.serviceImpl;

import com.dripdoggy.backend.Iservice.IShippingFeeService;
import com.dripdoggy.backend.dto.ShippingRulesDto;
import com.dripdoggy.backend.dto.StateConfig;
import com.dripdoggy.backend.dto.ZoneConfig;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.math.BigDecimal;

@Service
public class ShippingFeeService implements IShippingFeeService {

    private static final Logger logger = LoggerFactory.getLogger(ShippingFeeService.class);
    private static final String DEFAULT_FALLBACK_ZONE = "WEST_CENTRAL_INDIA";
    private static final BigDecimal DEFAULT_FALLBACK_PRICE = new BigDecimal("160.00");

    private ShippingRulesDto shippingRules;

    @PostConstruct
    public void init() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            ClassPathResource resource = new ClassPathResource("delivery_charges.json");
            try (InputStream inputStream = resource.getInputStream()) {
                this.shippingRules = mapper.readValue(inputStream, ShippingRulesDto.class);
            }
            logger.info("Successfully parsed delivery_charges.json rules into memory.");
        } catch (Exception e) {
            logger.error("Failed to load delivery_charges.json: {}", e.getMessage(), e);
        }
    }

    @Override
    public BigDecimal calculateShippingFee(String stateInput, String cityInput) {
        return calculateShippingFee(stateInput, cityInput, null);
    }

    @Override
    public BigDecimal calculateShippingFee(String stateInput, String cityInput, String deliveryMethod) {
        if (shippingRules == null || shippingRules.getZones() == null || shippingRules.getStates() == null) {
            return DEFAULT_FALLBACK_PRICE;
        }

        if (stateInput == null || stateInput.trim().isEmpty()) {
            return getFallbackPrice();
        }

        // 1. Normalize inputs
        String state = stateInput.trim().toLowerCase();
        String city = cityInput != null ? cityInput.trim().toLowerCase() : "";

        // 2. Fetch state rule
        StateConfig stateConfig = shippingRules.getStates().get(state);
        if (stateConfig == null) {
            return getFallbackPrice();
        }

        // 3. Resolve target zone (check for city override)
        String targetZone = stateConfig.getDefaultZone();
        if (stateConfig.getCityOverrides() != null && !city.isEmpty() && stateConfig.getCityOverrides().containsKey(city)) {
            targetZone = stateConfig.getCityOverrides().get(city);
        }

        // 4. Get default price of resolved zone
        ZoneConfig zoneConfig = shippingRules.getZones().get(targetZone);
        if (zoneConfig == null || zoneConfig.getDefaultPrice() == null) {
            return getFallbackPrice();
        }

        return BigDecimal.valueOf(zoneConfig.getDefaultPrice());
    }

    private BigDecimal getFallbackPrice() {
        if (shippingRules != null && shippingRules.getZones() != null) {
            ZoneConfig fallbackZone = shippingRules.getZones().get(DEFAULT_FALLBACK_ZONE);
            if (fallbackZone != null && fallbackZone.getDefaultPrice() != null) {
                return BigDecimal.valueOf(fallbackZone.getDefaultPrice());
            }
        }
        return DEFAULT_FALLBACK_PRICE;
    }
}
