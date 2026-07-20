package com.dripdoggy.backend.dto;

import java.util.Map;

public class ShippingRulesDto {
    private Map<String, ZoneConfig> zones;
    private Map<String, StateConfig> states;

    public ShippingRulesDto() {}

    public ShippingRulesDto(Map<String, ZoneConfig> zones, Map<String, StateConfig> states) {
        this.zones = zones;
        this.states = states;
    }

    public Map<String, ZoneConfig> getZones() {
        return zones;
    }

    public void setZones(Map<String, ZoneConfig> zones) {
        this.zones = zones;
    }

    public Map<String, StateConfig> getStates() {
        return states;
    }

    public void setStates(Map<String, StateConfig> states) {
        this.states = states;
    }
}
