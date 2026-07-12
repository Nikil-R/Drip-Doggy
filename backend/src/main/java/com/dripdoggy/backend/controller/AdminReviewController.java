package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.IReviewService;
import com.dripdoggy.backend.ResponseDto.ReviewResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reviews")
public class AdminReviewController {

    private final IReviewService reviewService;

    @Autowired
    public AdminReviewController(IReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<List<ReviewResponseDto>> getAllReviews() {
        List<ReviewResponseDto> responses = reviewService.getAllReviews();
        return ResponseEntity.ok(responses);
    }

    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<ResponseMsgDto> toggleReviewActiveStatus(@PathVariable Long id) {
        ResponseMsgDto response = reviewService.toggleReviewActiveStatus(id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseMsgDto> adminDeleteReview(@PathVariable Long id) {
        ResponseMsgDto response = reviewService.adminDeleteReview(id);
        return ResponseEntity.ok(response);
    }
}
