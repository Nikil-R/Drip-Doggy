package com.dripdoggy.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sns.SnsClient;
import software.amazon.awssdk.services.sns.model.PublishRequest;
import jakarta.annotation.PostConstruct;

@Service
public class SmsService {

    @Value("${aws.sns.access-key}")
    private String accessKey;

    @Value("${aws.sns.secret-key}")
    private String secretKey;

    @Value("${aws.sns.region}")
    private String region;

    private SnsClient snsClient;

    @PostConstruct
    public void init() {
        if(accessKey != null && !accessKey.isEmpty() && !accessKey.equals("YOUR_AWS_ACCESS_KEY")) {
            snsClient = SnsClient.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey)))
                .build();
        } else {
            snsClient = SnsClient.builder().region(Region.of(region)).build();
        }
    }

    public void sendOtpSms(String phoneNumber, String otpCode) {
        String message = "Your OTP code is: " + otpCode;
        PublishRequest request = PublishRequest.builder()
                .message(message)
                .phoneNumber(phoneNumber)
                .build();
        snsClient.publish(request);
    }
}
