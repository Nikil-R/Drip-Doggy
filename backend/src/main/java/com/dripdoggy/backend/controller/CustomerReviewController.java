package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.IReviewService;
import com.dripdoggy.backend.RequestDto.ReviewRequestDto;
import com.dripdoggy.backend.RequestDto.ReviewUpdateRequestDto;
import com.dripdoggy.backend.ResponseDto.ReviewResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer/reviews")
public class CustomerReviewController {

    private final IReviewService reviewService;

    @Autowired
    public CustomerReviewController(IReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<ReviewResponseDto> createReview(@Valid @ModelAttribute ReviewRequestDto dto) {
        ReviewResponseDto response = reviewService.createReview(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ReviewResponseDto>> getCustomerReviews() {
        List<ReviewResponseDto> responses = reviewService.getCustomerReviews();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponseDto> getCustomerReviewById(@PathVariable Long id) {
        ReviewResponseDto response = reviewService.getCustomerReviewById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReviewResponseDto> updateReview(@PathVariable Long id, @Valid @ModelAttribute ReviewUpdateRequestDto dto) {
        ReviewResponseDto response = reviewService.updateReview(id, dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseMsgDto> deleteReview(@PathVariable Long id) {
        ResponseMsgDto response = reviewService.deleteReview(id);
        return ResponseEntity.ok(response);
    }
}
