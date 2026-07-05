package com.dripdoggy.backend.RequestDto;

import jakarta.validation.constraints.NotNull;

public class WishlistRequestDto {

    @NotNull(message = "Product variant size ID is required")
    private Long productVariantSizeId;

    public WishlistRequestDto() {
    }

    public WishlistRequestDto(Long productVariantSizeId) {
        this.productVariantSizeId = productVariantSizeId;
    }

    public Long getProductVariantSizeId() {
        return productVariantSizeId;
    }

    public void setProductVariantSizeId(Long productVariantSizeId) {
        this.productVariantSizeId = productVariantSizeId;
    }
}
