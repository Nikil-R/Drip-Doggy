package com.dripdoggy.backend.serviceImpl;

import com.dripdoggy.backend.Iservice.INewsletterService;
import com.dripdoggy.backend.RequestDto.NewsletterCampaignRequestDto;
import com.dripdoggy.backend.RequestDto.NewsletterSubscribeRequestDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.entity.NewsletterSubscriber;
import com.dripdoggy.backend.exception.InvalidOrderStateException;
import com.dripdoggy.backend.repository.NewsletterSubscriberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dripdoggy.backend.ResponseDto.NewsletterSubscriberResponseDto;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class NewsletterService implements INewsletterService {

    private final NewsletterSubscriberRepository newsletterSubscriberRepository;
    private final EmailService emailService;

    @Autowired
    public NewsletterService(NewsletterSubscriberRepository newsletterSubscriberRepository, EmailService emailService) {
        this.newsletterSubscriberRepository = newsletterSubscriberRepository;
        this.emailService = emailService;
    }

    @Override
    public ResponseMsgDto subscribe(NewsletterSubscribeRequestDto dto) {
        String email = dto.getEmail().trim().toLowerCase();
        if (newsletterSubscriberRepository.existsByEmail(email)) {
            throw new InvalidOrderStateException("This email is already subscribed to our newsletter.");
        }

        NewsletterSubscriber subscriber = new NewsletterSubscriber(email);
        newsletterSubscriberRepository.save(subscriber);

        return new ResponseMsgDto(200, "Subscribed successfully!");
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseMsgDto sendCampaign(NewsletterCampaignRequestDto dto) {
        List<NewsletterSubscriber> subscribers = newsletterSubscriberRepository.findAll();
        if (subscribers.isEmpty()) {
            return new ResponseMsgDto(200, "No subscribers found. Campaign not sent.");
        }

        for (NewsletterSubscriber subscriber : subscribers) {
            try {
                emailService.sendCampaignEmail(
                        subscriber.getEmail(),
                        dto.getSubject(),
                        dto.getContent(),
                        dto.getImage1(),
                        dto.getImage2()
                );
            } catch (Exception e) {
                System.err.println("Failed to send campaign email to " + subscriber.getEmail() + ": " + e.getMessage());
            }
        }

        return new ResponseMsgDto(200, "Campaign email dispatched to " + subscribers.size() + " subscriber(s) successfully.");
    }

    @Override
    @Transactional(readOnly = true)
    public List<NewsletterSubscriberResponseDto> getAllSubscribers() {
        return newsletterSubscriberRepository.findAll().stream()
                .map(sub -> new NewsletterSubscriberResponseDto(sub.getEmail(), sub.getSubscribedAt()))
                .collect(Collectors.toList());
    }
}
