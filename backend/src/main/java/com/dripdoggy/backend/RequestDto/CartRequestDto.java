package com.dripdoggy.backend.RequestDto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class CartRequestDto {

    @NotNull(message = "Product variant size ID is required")
    private Long productVariantSizeId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    public CartRequestDto() {
    }

    public Long getProductVariantSizeId() {
        return productVariantSizeId;
    }

    public void setProductVariantSizeId(Long productVariantSizeId) {
        this.productVariantSizeId = productVariantSizeId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
