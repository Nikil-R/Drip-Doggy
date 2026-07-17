package com.dripdoggy.backend.Iservice;

import com.dripdoggy.backend.RequestDto.CartRequestDto;
import com.dripdoggy.backend.RequestDto.AddBundleToCartRequestDto;
import com.dripdoggy.backend.ResponseDto.CartListResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;

public interface ICartService {
    CartListResponseDto getCart();
    
    ResponseMsgDto addToCart(CartRequestDto request);
    
    ResponseMsgDto addBundleToCart(AddBundleToCartRequestDto request);
    
    ResponseMsgDto updateCartItemQuantity(Long cartItemId, Integer quantity);
    
    ResponseMsgDto removeCartItem(Long cartItemId);
    
    ResponseMsgDto clearCart();

    ResponseMsgDto updateCartItemSize(Long cartItemId, Long productVariantSizeId);
}
