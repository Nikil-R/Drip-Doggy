package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.IProductService;
import com.dripdoggy.backend.RequestDto.ProductRequestDto;
import com.dripdoggy.backend.ResponseDto.ProductDetailsResponseDto;
import com.dripdoggy.backend.ResponseDto.ProductListResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/products")
public class ProductController {

    private final IProductService productService;

    @Autowired
    public ProductController(IProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<ResponseMsgDto> createProduct(
            @Valid @ModelAttribute ProductRequestDto productDto) {
        ResponseMsgDto response = productService.createProduct(productDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
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

    @PutMapping("/{id}")
    public ResponseEntity<ResponseMsgDto> updateProduct(
            @PathVariable Long id,
            @Valid @ModelAttribute ProductRequestDto productDto) {
        ResponseMsgDto response = productService.updateProduct(id, productDto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseMsgDto> deleteProduct(@PathVariable Long id) {
        ResponseMsgDto response = productService.deleteProduct(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ResponseMsgDto> toggleProductIsActive(@PathVariable Long id) {
        ResponseMsgDto response = productService.toggleProductIsActive(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/variants/{id}")
    public ResponseEntity<ResponseMsgDto> toggleProductVariantIsActive(@PathVariable Long id) {
        ResponseMsgDto response = productService.toggleProductVariantIsActive(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/variants/{id}")
    public ResponseEntity<ResponseMsgDto> deleteProductVariant(@PathVariable Long id) {
        ResponseMsgDto response = productService.deleteProductVariant(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
