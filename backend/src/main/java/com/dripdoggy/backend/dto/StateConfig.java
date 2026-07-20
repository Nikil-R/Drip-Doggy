package com.dripdoggy.backend.dto;

import java.util.Map;

public class StateConfig {
    private String defaultZone;
    private Map<String, String> cityOverrides;

    public StateConfig() {}

    public StateConfig(String defaultZone, Map<String, String> cityOverrides) {
        this.defaultZone = defaultZone;
        this.cityOverrides = cityOverrides;
    }

    public String getDefaultZone() {
        return defaultZone;
    }

    public void setDefaultZone(String defaultZone) {
        this.defaultZone = defaultZone;
    }

    public Map<String, String> getCityOverrides() {
        return cityOverrides;
    }

    public void setCityOverrides(Map<String, String> cityOverrides) {
        this.cityOverrides = cityOverrides;
    }
}
