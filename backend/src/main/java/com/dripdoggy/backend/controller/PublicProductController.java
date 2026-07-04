package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.IProductService;
import com.dripdoggy.backend.ResponseDto.ProductListResponseDto;
import com.dripdoggy.backend.ResponseDto.ProductDetailsResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
