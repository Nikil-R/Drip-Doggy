package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.IWishlistService;
import com.dripdoggy.backend.RequestDto.WishlistRequestDto;
import com.dripdoggy.backend.ResponseDto.WishlistListResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final IWishlistService wishlistService;

    @Autowired
    public WishlistController(IWishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @PostMapping
    public ResponseEntity<ResponseMsgDto> addToWishlist(@Valid @RequestBody WishlistRequestDto request) {
        ResponseMsgDto response = wishlistService.addToWishlist(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<WishlistListResponseDto> getWishlist() {
        WishlistListResponseDto response = wishlistService.getWishlist();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{wishlistItemId}")
    public ResponseEntity<ResponseMsgDto> removeWishlistItem(@PathVariable Long wishlistItemId) {
        ResponseMsgDto response = wishlistService.removeWishlistItem(wishlistItemId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/{wishlistItemId}")
    public ResponseEntity<ResponseMsgDto> toggleWishlistItemActive(@PathVariable Long wishlistItemId) {
        ResponseMsgDto response = wishlistService.toggleWishlistItemActive(wishlistItemId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
