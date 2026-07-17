package com.dripdoggy.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dripdoggy.backend.Iservice.IProductService;
import com.dripdoggy.backend.ResponseDto.ProductDetailsResponseDto;
import com.dripdoggy.backend.ResponseDto.ProductListResponseDto;
import com.dripdoggy.backend.ResponseDto.ProductVariantDetailsResponseDto;

@RestController
@RequestMapping("/api/public/products")
public class PublicProductController {

    private final IProductService productService;

    @Autowired
    public PublicProductController(IProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<ProductListResponseDto> fetchAllProducts() {
        ProductListResponseDto response = productService.fetchAllActiveProducts();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailsResponseDto> fetchProductById(@PathVariable Long id) {
        ProductDetailsResponseDto response = productService.fetchProductById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/variants/{variantId}")
    public ResponseEntity<ProductVariantDetailsResponseDto> fetchVariantDetailsById(@PathVariable Long variantId) {
        ProductVariantDetailsResponseDto response = productService.fetchVariantDetailsById(variantId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
