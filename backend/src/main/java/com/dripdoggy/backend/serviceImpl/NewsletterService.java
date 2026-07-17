package com.dripdoggy.backend.serviceImpl;

import com.dripdoggy.backend.Iservice.INewsletterService;
import com.dripdoggy.backend.RequestDto.NewsletterCampaignRequestDto;
import com.dripdoggy.backend.RequestDto.NewsletterSubscribeRequestDto;
import com.dripdoggy.backend.ResponseDto.ResponseMsgDto;
import com.dripdoggy.backend.entity.NewsletterSubscriber;
import com.dripdoggy.backend.exception.InvalidOrderStateException;
import com.dripdoggy.backend.repository.NewsletterSubscriberRepository;
import com.dripdoggy.backend.repository.UserRepository;
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
    private final UserRepository userRepository;

    @Autowired
    public NewsletterService(NewsletterSubscriberRepository newsletterSubscriberRepository, EmailService emailService, UserRepository userRepository) {
        this.newsletterSubscriberRepository = newsletterSubscriberRepository;
        this.emailService = emailService;
        this.userRepository = userRepository;
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
        List<String> emails;
        
        if (dto.getTargetAudience() != null && 
            (dto.getTargetAudience().equalsIgnoreCase("ALL_REGISTERED_USERS") || 
             dto.getTargetAudience().equalsIgnoreCase("ALL_REGISTERED") ||
             dto.getTargetAudience().equalsIgnoreCase("registered") ||
             dto.getTargetAudience().equalsIgnoreCase("all"))) {
            
            emails = userRepository.findAllRegisteredEmails().stream()
                    .filter(email -> email != null && !email.trim().isEmpty())
                    .map(String::trim)
                    .map(String::toLowerCase)
                    .distinct()
                    .collect(Collectors.toList());
        } else {
            emails = newsletterSubscriberRepository.findAll().stream()
                    .map(NewsletterSubscriber::getEmail)
                    .filter(email -> email != null && !email.trim().isEmpty())
                    .map(String::trim)
                    .map(String::toLowerCase)
                    .distinct()
                    .collect(Collectors.toList());
        }

        if (emails.isEmpty()) {
            return new ResponseMsgDto(200, "No recipients found. Campaign not sent.");
        }

        int successCount = 0;
        for (String email : emails) {
            try {
                emailService.sendCampaignEmail(
                        email,
                        dto.getSubject(),
                        dto.getContent(),
                        dto.getImage1(),
                        dto.getImage2()
                );
                successCount++;
            } catch (Exception e) {
                System.err.println("Failed to send campaign email to " + email + ": " + e.getMessage());
            }
        }

        return new ResponseMsgDto(200, "Campaign email dispatched to " + successCount + " recipient(s) successfully.");
    }

    @Override
    @Transactional(readOnly = true)
    public List<NewsletterSubscriberResponseDto> getAllSubscribers() {
        return newsletterSubscriberRepository.findAll().stream()
                .map(sub -> new NewsletterSubscriberResponseDto(sub.getEmail(), sub.getSubscribedAt()))
                .collect(Collectors.toList());
    }
}
