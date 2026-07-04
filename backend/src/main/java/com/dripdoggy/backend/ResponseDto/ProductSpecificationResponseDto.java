package com.dripdoggy.backend.ResponseDto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductSpecificationResponseDto {
    private Long id;
    private String fabric;
    private String fit;
    private String waterproofing;
    private String hardware;
    private String pocketDesign;
    private String pattern;
    private String neckCollarType;
    private String sleeveType;
    private String pockets;
    private String washCare;
    private Map<String, String> customSpecs; // Deserialized custom key-value pairs

    // Constructors
    public ProductSpecificationResponseDto() {
    }

    public ProductSpecificationResponseDto(Long id, String fabric, String fit, String waterproofing, String hardware, String pocketDesign, String pattern, String neckCollarType, String sleeveType, String pockets, String washCare, Map<String, String> customSpecs) {
        this.id = id;
        this.fabric = fabric;
        this.fit = fit;
        this.waterproofing = waterproofing;
        this.hardware = hardware;
        this.pocketDesign = pocketDesign;
        this.pattern = pattern;
        this.neckCollarType = neckCollarType;
        this.sleeveType = sleeveType;
        this.pockets = pockets;
        this.washCare = washCare;
        this.customSpecs = customSpecs;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFabric() {
        return fabric;
    }

    public void setFabric(String fabric) {
        this.fabric = fabric;
    }

    public String getFit() {
        return fit;
    }

    public void setFit(String fit) {
        this.fit = fit;
    }

    public String getWaterproofing() {
        return waterproofing;
    }

    public void setWaterproofing(String waterproofing) {
        this.waterproofing = waterproofing;
    }

    public String getHardware() {
        return hardware;
    }

    public void setHardware(String hardware) {
        this.hardware = hardware;
    }

    public String getPocketDesign() {
        return pocketDesign;
    }

    public void setPocketDesign(String pocketDesign) {
        this.pocketDesign = pocketDesign;
    }

    public String getPattern() {
        return pattern;
    }

    public void setPattern(String pattern) {
        this.pattern = pattern;
    }

    public String getNeckCollarType() {
        return neckCollarType;
    }

    public void setNeckCollarType(String neckCollarType) {
        this.neckCollarType = neckCollarType;
    }

    public String getSleeveType() {
        return sleeveType;
    }

    public void setSleeveType(String sleeveType) {
        this.sleeveType = sleeveType;
    }

    public String getPockets() {
        return pockets;
    }

    public void setPockets(String pockets) {
        this.pockets = pockets;
    }

    public String getWashCare() {
        return washCare;
    }

    public void setWashCare(String washCare) {
        this.washCare = washCare;
    }

    public Map<String, String> getCustomSpecs() {
        return customSpecs;
    }

    public void setCustomSpecs(Map<String, String> customSpecs) {
        this.customSpecs = customSpecs;
    }
}
