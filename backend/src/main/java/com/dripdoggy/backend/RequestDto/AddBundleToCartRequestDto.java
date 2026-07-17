package com.dripdoggy.backend.RequestDto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class AddBundleToCartRequestDto {

    @NotNull(message = "Bundle ID is required")
    private Long bundleId;

    @NotNull(message = "Product variant size IDs are required")
    private List<Long> productVariantSizeIds;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    public AddBundleToCartRequestDto() {
    }

    public Long getBundleId() {
        return bundleId;
    }

    public void setBundleId(Long bundleId) {
        this.bundleId = bundleId;
    }

    public List<Long> getProductVariantSizeIds() {
        return productVariantSizeIds;
    }

    public void setProductVariantSizeIds(List<Long> productVariantSizeIds) {
        this.productVariantSizeIds = productVariantSizeIds;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
