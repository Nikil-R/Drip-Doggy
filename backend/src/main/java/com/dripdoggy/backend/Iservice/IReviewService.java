package com.dripdoggy.backend.Iservice;

import com.dripdoggy.backend.RequestDto.ReviewRequestDto;
import com.dripdoggy.backend.RequestDto.ReviewUpdateRequestDto;
import com.dripdoggy.backend.ResponseDto.ReviewResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;

import java.util.List;

public interface IReviewService {
    ReviewResponseDto createReview(ReviewRequestDto dto);
    List<ReviewResponseDto> getCustomerReviews();
    ReviewResponseDto getCustomerReviewById(Long id);
    ReviewResponseDto updateReview(Long id, ReviewUpdateRequestDto dto);
    ResponseMsgDto deleteReview(Long id);
    List<ReviewResponseDto> getActiveReviewsForProduct(Long productId);
    List<ReviewResponseDto> getActiveReviewsForVariant(Long variantId);
    
    // Admin Operations
    List<ReviewResponseDto> getAllReviews();
    ResponseMsgDto toggleReviewActiveStatus(Long id);
    ResponseMsgDto adminDeleteReview(Long id);
}
