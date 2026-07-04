package com.dripdoggy.backend.ResponseDto;

public class ProductFeatureResponseDto {
    private Long id;
    private String featureName;
    private Boolean isActive;

    // Constructors
    public ProductFeatureResponseDto() {
    }

    public ProductFeatureResponseDto(Long id, String featureName, Boolean isActive) {
        this.id = id;
        this.featureName = featureName;
        this.isActive = isActive;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFeatureName() {
        return featureName;
    }

    public void setFeatureName(String featureName) {
        this.featureName = featureName;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}
