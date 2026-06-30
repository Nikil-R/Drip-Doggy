package com.dripdoggy.backend.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otpCode) {
        sendOtpEmail(toEmail, otpCode, false);
    }

    public void sendOtpEmail(String toEmail, String otpCode, boolean isLogin) {
        try {
            jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setTo(toEmail);
            
            String label = isLogin ? "login otp" : "signup otp";
            String boldLabel = "<b>" + label + "</b>";
            
            helper.setSubject(isLogin ? "Your Login OTP" : "Your Signup OTP");
            helper.setText("Your OTP code is: " + otpCode + "\n\nThis is your " + boldLabel + ".\n\nIt is valid for 5 minutes.", true);
            
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            String label = isLogin ? "LOGIN OTP" : "SIGNUP OTP";
            message.setSubject(isLogin ? "Your Login OTP" : "Your Signup OTP");
            message.setText("Your OTP code is: " + otpCode + "\n\nThis is your " + label + ".\n\nIt is valid for 5 minutes.");
            mailSender.send(message);
        }
    }

    public void sendWelcomeAdminEmail(String toEmail) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("DripDoggy Admin Access Granted");
        message.setText("Welcome to DripDoggy,\n\n" +
                "You have been granted Administrator access to the DripDoggy platform.\n\n" +
                "To get started, please log in to the Admin Dashboard using your registered email address:\n" +
                "Email: " + toEmail + "\n\n" +
                "Login Instructions:\n" +
                "1. Go to the DripDoggy Admin login page.\n" +
                "2. Enter your registered email address.\n" +
                "3. Verify your identity using the OTP code sent to this email.\n\n" +
                "If you have any questions or did not expect this invitation, please contact the system administrator.\n\n" +
                "Best regards,\n" +
                "The DripDoggy Team");
        mailSender.send(message);
    }
}
