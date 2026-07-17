package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.ICartService;
import com.dripdoggy.backend.RequestDto.CartRequestDto;
import com.dripdoggy.backend.RequestDto.AddBundleToCartRequestDto;
import com.dripdoggy.backend.ResponseDto.CartListResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

	// -- is_deleted = true andre deleted else false
    private final ICartService cartService;

    @Autowired
    public CartController(ICartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping
    public ResponseEntity<ResponseMsgDto> addToCart(@Valid @RequestBody CartRequestDto request) {
        ResponseMsgDto response = cartService.addToCart(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/bundle")
    public ResponseEntity<ResponseMsgDto> addBundleToCart(@Valid @RequestBody AddBundleToCartRequestDto request) {
        ResponseMsgDto response = cartService.addBundleToCart(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<CartListResponseDto> getCart() {
        CartListResponseDto response = cartService.getCart();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    @PutMapping("/{cartItemId}")
    public ResponseEntity<ResponseMsgDto> updateCartItemQuantity(
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity) {
        ResponseMsgDto response = cartService.updateCartItemQuantity(cartItemId, quantity);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{cartItemId}/size")
    public ResponseEntity<ResponseMsgDto> updateCartItemSize(
            @PathVariable Long cartItemId,
            @RequestParam Long productVariantSizeId) {
        ResponseMsgDto response = cartService.updateCartItemSize(cartItemId, productVariantSizeId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<ResponseMsgDto> removeCartItem(@PathVariable Long cartItemId) {
        ResponseMsgDto response = cartService.removeCartItem(cartItemId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping
    public ResponseEntity<ResponseMsgDto> clearCart() {
        ResponseMsgDto response = cartService.clearCart();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
//    is_active	false (0)	Inactive (Hidden from users)
//    is_active	true (1)	Active (Visible to users)
//    is_deleted	false (0)	Not Deleted (Valid item)
//    is_deleted	true (1)	Deleted (Soft-deleted)
}
