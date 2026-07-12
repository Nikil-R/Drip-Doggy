package com.dripdoggy.backend.RequestDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ReviewRequestDto {

    @NotNull(message = "Order ID is required.")
    private Long orderId;

    @NotNull(message = "Product Variant ID is required.")
    private Long productVariantId;

    @NotBlank(message = "Comment is required.")
    private String comment;

    public ReviewRequestDto() {
    }

    public ReviewRequestDto(Long orderId, Long productVariantId, String comment) {
        this.orderId = orderId;
        this.productVariantId = productVariantId;
        this.comment = comment;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getProductVariantId() {
        return productVariantId;
    }

    public void setProductVariantId(Long productVariantId) {
        this.productVariantId = productVariantId;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
