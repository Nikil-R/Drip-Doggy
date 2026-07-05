package com.dripdoggy.backend.Iservice;

import com.dripdoggy.backend.RequestDto.WishlistRequestDto;
import com.dripdoggy.backend.ResponseDto.WishlistListResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;

public interface IWishlistService {
    WishlistListResponseDto getWishlist();
    
    ResponseMsgDto addToWishlist(WishlistRequestDto request);
    
    ResponseMsgDto removeWishlistItem(Long wishlistItemId);
    
    ResponseMsgDto toggleWishlistItemActive(Long wishlistItemId);
}
