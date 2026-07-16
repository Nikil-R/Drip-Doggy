package com.dripdoggy.backend.Iservice;

import com.dripdoggy.backend.RequestDto.NewsletterCampaignRequestDto;
import com.dripdoggy.backend.RequestDto.NewsletterSubscribeRequestDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.ResponseDto.NewsletterSubscriberResponseDto;

import java.util.List;

public interface INewsletterService {
    ResponseMsgDto subscribe(NewsletterSubscribeRequestDto dto);
    ResponseMsgDto sendCampaign(NewsletterCampaignRequestDto dto);
    List<NewsletterSubscriberResponseDto> getAllSubscribers();
}

