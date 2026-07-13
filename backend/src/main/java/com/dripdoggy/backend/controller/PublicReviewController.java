package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.IReviewService;
import com.dripdoggy.backend.ResponseDto.ReviewResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/reviews")
public class PublicReviewController {

    private final IReviewService reviewService;

    @Autowired
    public PublicReviewController(IReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponseDto>> getActiveReviewsForProduct(@PathVariable Long productId) {
        List<ReviewResponseDto> responses = reviewService.getActiveReviewsForProduct(productId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/variant/{variantId}")
    public ResponseEntity<List<ReviewResponseDto>> getActiveReviewsForVariant(@PathVariable Long variantId) {
        List<ReviewResponseDto> responses = reviewService.getActiveReviewsForVariant(variantId);
        return ResponseEntity.ok(responses);
    }
}
