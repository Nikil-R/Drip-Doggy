package com.dripdoggy.backend.Iservice;

import com.dripdoggy.backend.RequestDto.ReviewRequestDto;
import com.dripdoggy.backend.ResponseDto.ReviewResponseDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;

import java.util.List;

public interface IReviewService {
    ReviewResponseDto createReview(ReviewRequestDto dto);
    List<ReviewResponseDto> getCustomerReviews();
    ReviewResponseDto getCustomerReviewById(Long id);
    ReviewResponseDto updateReview(Long id, String comment);
    ResponseMsgDto deleteReview(Long id);
    
    // Admin Operations
    List<ReviewResponseDto> getAllReviews();
    ReviewResponseDto toggleReviewActiveStatus(Long id);
    ResponseMsgDto adminDeleteReview(Long id);
}
