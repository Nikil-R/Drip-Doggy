package com.dripdoggy.backend.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOtpEmail(String toEmail, String otpCode) {
        sendOtpEmail(toEmail, otpCode, false);
    }

    public void sendOtpEmail(String toEmail, String otpCode, boolean isLogin) {
        try {
            jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            
            String label = isLogin ? "login otp" : "signup otp";
            String boldLabel = "<b>" + label + "</b>";
            
            helper.setSubject(isLogin ? "Your Login OTP" : "Your Signup OTP");
            helper.setText("Your OTP code is: " + otpCode + "\n\nThis is your " + boldLabel + ".\n\nIt is valid for 5 minutes.", true);
            
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            String label = isLogin ? "LOGIN OTP" : "SIGNUP OTP";
            message.setSubject(isLogin ? "Your Login OTP" : "Your Signup OTP");
            message.setText("Your OTP code is: " + otpCode + "\n\nThis is your " + label + ".\n\nIt is valid for 5 minutes.");
            mailSender.send(message);
        }
    }

    public void sendWelcomeAdminEmail(String toEmail) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
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

    public void sendOrderPlacementEmail(String toEmail, String orderNumber, String customerName, double totalAmount) {
        try {
            jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("DripDoggy Order Placed Successfully - " + orderNumber);
            
            String htmlContent = "<h3>Thank you for your order, " + customerName + "!</h3>" +
                    "<p>Your order <b>" + orderNumber + "</b> has been successfully placed.</p>" +
                    "<p><b>Total Amount:</b> ₹" + totalAmount + "</p>" +
                    "<p><b>Payment Method:</b> Cash on Delivery (COD)</p>" +
                    "<p>We will notify you when your items are shipped.</p>" +
                    "<p>Best regards,<br/>The DripDoggy Team</p>";
                    
            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("DripDoggy Order Placed Successfully - " + orderNumber);
            message.setText("Dear " + customerName + ",\n\n" +
                    "Your order " + orderNumber + " has been successfully placed.\n\n" +
                    "Total Amount: ₹" + totalAmount + "\n" +
                    "Payment Method: Cash on Delivery (COD)\n\n" +
                    "Thank you for shopping with us!\n\n" +
                    "Best regards,\n" +
                    "The DripDoggy Team");
            mailSender.send(message);
        }
    }

    public void sendAdminReturnRequestNotification(String adminEmail, String orderNumber, String requestType, String customerName, String customerEmail, String productName, String reason) {
        try {
            jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(adminEmail);
            helper.setSubject("New " + requestType + " Request Submitted - " + orderNumber);
            
            String htmlContent = "<h3>New Return/Exchange Request Submitted</h3>" +
                    "<p>A new <b>" + requestType + "</b> request has been submitted for order <b>" + orderNumber + "</b>.</p>" +
                    "<p><b>Customer:</b> " + customerName + " (" + customerEmail + ")</p>" +
                    "<p><b>Product:</b> " + productName + "</p>" +
                    "<p><b>Reason:</b> " + reason + "</p>" +
                    "<p>Please log in to the Admin Dashboard to review and approve/reject the request.</p>" +
                    "<p>Best regards,<br/>The DripDoggy System</p>";
                    
            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(adminEmail);
            message.setSubject("New " + requestType + " Request Submitted - " + orderNumber);
            message.setText("Dear Admin,\n\n" +
                    "A new " + requestType + " request has been submitted for order " + orderNumber + ".\n\n" +
                    "Customer: " + customerName + " (" + customerEmail + ")\n" +
                    "Product: " + productName + "\n" +
                    "Reason: " + reason + "\n\n" +
                    "Please log in to the Admin Dashboard to review the request.\n\n" +
                    "Best regards,\n" +
                    "The DripDoggy System");
            mailSender.send(message);
        }
    }

    public void sendCustomerReturnInitiatedEmail(String toEmail, String orderNumber, String requestType, String customerName, String productName) {
        try {
            jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("DripDoggy " + requestType + " Request Initiated - " + orderNumber);
            
            String htmlContent = "<h3>Hello, " + customerName + "!</h3>" +
                    "<p>We have successfully received your <b>" + requestType + "</b> request for order <b>" + orderNumber + "</b>.</p>" +
                    "<p><b>Product:</b> " + productName + "</p>" +
                    "<p>Our admin team is currently reviewing your request (defect images & reasons). We will update you once it is approved or rejected.</p>" +
                    "<p>Best regards,<br/>The DripDoggy Team</p>";
                    
            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("DripDoggy " + requestType + " Request Initiated - " + orderNumber);
            message.setText("Dear " + customerName + ",\n\n" +
                    "We have successfully received your " + requestType + " request for order " + orderNumber + ".\n\n" +
                    "Product: " + productName + "\n\n" +
                    "Our admin team is currently reviewing your request. We will update you once it is approved or rejected.\n\n" +
                    "Best regards,\n" +
                    "The DripDoggy Team");
            mailSender.send(message);
        }
    }

    public void sendCustomerReturnStatusUpdateEmail(String toEmail, String orderNumber, String requestType, String customerName, String status) {
        try {
            jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("DripDoggy " + requestType + " Request Status Update: " + status + " - " + orderNumber);
            
            String statusText = status.equalsIgnoreCase("APPROVED") 
                    ? "approved! Our courier partner will pick up the package from your address shortly." 
                    : "rejected after reviewing. If you believe this is an error, please contact support.";
                    
            String htmlContent = "<h3>Hello, " + customerName + "!</h3>" +
                    "<p>Your <b>" + requestType + "</b> request for order <b>" + orderNumber + "</b> has been " + statusText + "</p>" +
                    "<p>Current Request Status: <b>" + status + "</b></p>" +
                    "<p>Best regards,<br/>The DripDoggy Team</p>";
                    
            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("DripDoggy " + requestType + " Request Status Update: " + status + " - " + orderNumber);
            
            String text = status.equalsIgnoreCase("APPROVED")
                    ? "approved! Our courier partner will pick up the package from your address shortly."
                    : "rejected. If you believe this is an error, please contact support.";
                    
            message.setText("Dear " + customerName + ",\n\n" +
                    "Your " + requestType + " request for order " + orderNumber + " has been " + text + "\n\n" +
                    "Current Request Status: " + status + "\n\n" +
                    "Best regards,\n" +
                    "The DripDoggy Team");
            mailSender.send(message);
        }
    }

    public void sendCustomerReturnLogisticsEmail(String toEmail, String orderNumber, String customerName, String deliveryStatus) {
        try {
            jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("DripDoggy Return Package Update: " + deliveryStatus + " - " + orderNumber);
            
            String updateMessage = "";
            if (deliveryStatus.contains("PICKUPED")) {
                updateMessage = "has been successfully picked up by our courier partner from your address.";
            } else if (deliveryStatus.contains("SHIPPED")) {
                updateMessage = "has been shipped and is in transit back to our warehouse.";
            } else if (deliveryStatus.contains("OUT_OF_DELIVERY")) {
                updateMessage = "is out for delivery to our warehouse for final inspection.";
            } else if (deliveryStatus.contains("DELIVERED")) {
                updateMessage = "has been safely received at our warehouse. We are now processing your refund/replacement.";
            } else {
                updateMessage = "status has been updated to: " + deliveryStatus;
            }
            
            String htmlContent = "<h3>Hello, " + customerName + "!</h3>" +
                    "<p>Your return package for order <b>" + orderNumber + "</b> " + updateMessage + "</p>" +
                    "<p>Logistics Status: <b>" + deliveryStatus + "</b></p>" +
                    "<p>Best regards,<br/>The DripDoggy Team</p>";
                    
            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("DripDoggy Return Package Update: " + deliveryStatus + " - " + orderNumber);
            
            String updateMessage = "";
            if (deliveryStatus.contains("PICKUPED")) {
                updateMessage = "has been successfully picked up by our courier partner from your address.";
            } else if (deliveryStatus.contains("SHIPPED")) {
                updateMessage = "has been shipped and is in transit back to our warehouse.";
            } else if (deliveryStatus.contains("OUT_OF_DELIVERY")) {
                updateMessage = "is out for delivery to our warehouse.";
            } else if (deliveryStatus.contains("DELIVERED")) {
                updateMessage = "has been safely received at our warehouse. We are now processing your refund/replacement.";
            } else {
                updateMessage = "status has been updated to: " + deliveryStatus;
            }
            
            message.setText("Dear " + customerName + ",\n\n" +
                       "Your return package for order " + orderNumber + " " + updateMessage + "\n\n" +
                       "Logistics Status: " + deliveryStatus + "\n\n" +
                       "Best regards,\n" +
                       "The DripDoggy Team");
            mailSender.send(message);
        }
    }

    public void sendCustomerRefundCompletedEmail(String toEmail, String orderNumber, String customerName, String productName, String proofImageUrl, MultipartFile proofImage, double refundAmount) {
        sendCustomerRefundCompletedEmail(toEmail, orderNumber, customerName, productName, proofImageUrl, proofImage, false, refundAmount);
    }

    public void sendCustomerRefundCompletedEmail(String toEmail, String orderNumber, String customerName, String productName, String proofImageUrl, MultipartFile proofImage, boolean wasExchangeFallback, double refundAmount) {
        try {
            jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(wasExchangeFallback ? "DripDoggy Exchange Refund Processed - " + orderNumber : "DripDoggy Refund Processed Successfully - " + orderNumber);
            
            String refundText = wasExchangeFallback 
                    ? "Your refund for order <b>" + orderNumber + "</b> has been processed because the replacement item for your exchange request was out of stock."
                    : "Your refund for order <b>" + orderNumber + "</b> has been successfully processed.";
            
            String htmlContent = "<h3>Hello, " + customerName + "!</h3>" +
                    "<p>" + refundText + "</p>" +
                    "<p><b>Product:</b> " + productName + "</p>" +
                    "<p><b>Refund Amount:</b> ₹" + refundAmount + "</p>" +
                    "<p><b>Refund Proof Transaction Receipt:</b> <a href=\"" + proofImageUrl + "\">Click here to view transaction proof receipt</a></p>" +
                    "<p>Please allow 2-3 business days for the funds to reflect in your account.</p>" +
                    "<p>Best regards,<br/>The DripDoggy Team</p>";
                    
            helper.setText(htmlContent, true);
            
            if (proofImage != null && !proofImage.isEmpty()) {
                String fileName = proofImage.getOriginalFilename();
                if (fileName == null || fileName.isEmpty()) {
                    fileName = "refund_proof.png";
                }
                helper.addAttachment(fileName, proofImage);
            }
            
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject(wasExchangeFallback ? "DripDoggy Exchange Refund Processed - " + orderNumber : "DripDoggy Refund Processed Successfully - " + orderNumber);
            
            String refundText = wasExchangeFallback
                    ? "Your refund for order " + orderNumber + " has been processed because the replacement item for your exchange request was out of stock."
                    : "Your refund for order " + orderNumber + " has been successfully processed.";
            
            message.setText("Dear " + customerName + ",\n\n" +
                    refundText + "\n\n" +
                    "Product: " + productName + "\n" +
                    "Refund Amount: ₹" + refundAmount + "\n" +
                    "Refund Transaction Receipt URL: " + proofImageUrl + "\n\n" +
                    "Please allow 2-3 business days for the funds to reflect in your account.\n\n" +
                    "Best regards,\n" +
                    "The DripDoggy Team");
            mailSender.send(message);
        }
    }

    public void sendCustomerExchangeCompletedEmail(String toEmail, String orderNumber, String customerName, String productName, String targetSize, String trackingNumber) {
        try {
            jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("DripDoggy Replacement Order Shipped - " + orderNumber);
            
            String htmlContent = "<h3>Hello, " + customerName + "!</h3>" +
                    "<p>Your exchange request for order <b>" + orderNumber + "</b> has been completed.</p>" +
                    "<p>Your replacement item <b>" + productName + " (Size: " + targetSize + ")</b> has been shipped!</p>" +
                    "<p><b>New Tracking ID:</b> " + (trackingNumber != null && !trackingNumber.isEmpty() ? trackingNumber : "N/A") + "</p>" +
                    "<p>Best regards,<br/>The DripDoggy Team</p>";
                    
            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("DripDoggy Replacement Order Shipped - " + orderNumber);
            message.setText("Dear " + customerName + ",\n\n" +
                    "Your exchange request for order " + orderNumber + " has been completed.\n\n" +
                    "Your replacement item " + productName + " (Size: " + targetSize + ") has been shipped!\n" +
                    "New Tracking ID: " + (trackingNumber != null && !trackingNumber.isEmpty() ? trackingNumber : "N/A") + "\n\n" +
                    "Best regards,\n" +
                    "The DripDoggy Team");
            mailSender.send(message);
        }
    }

    public void sendCustomerExchangePaymentRequestEmail(String toEmail, String orderNumber, String customerName, String productName, String variantName, double amount, MultipartFile qrCode) {
        try {
            jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("DripDoggy Exchange Request - Payment Required - " + orderNumber);
            
            String htmlContent = "<h3>Hello, " + customerName + "!</h3>" +
                    "<p>Your exchange request for order <b>" + orderNumber + "</b> requires a net difference payment of <b>₹" + amount + "</b>.</p>" +
                    "<p><b>Product:</b> " + productName + " (" + variantName + ")</p>" +
                    "<p>Please scan the attached QR code to pay the amount via UPI.</p>" +
                    "<p>Best regards,<br/>The DripDoggy Team</p>";
            
            helper.setText(htmlContent, true);
            
            if (qrCode != null && !qrCode.isEmpty()) {
                String fileName = qrCode.getOriginalFilename();
                if (fileName == null || fileName.isEmpty()) {
                    fileName = "payment_qr.png";
                }
                helper.addAttachment(fileName, qrCode);
            }
            
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("DripDoggy Exchange Request - Payment Required - " + orderNumber);
            message.setText("Dear " + customerName + ",\n\n" +
                    "Your exchange request for order " + orderNumber + " requires a net difference payment of ₹" + amount + ".\n\n" +
                    "Product: " + productName + " (" + variantName + ")\n" +
                    "Please scan the QR code or pay the amount via UPI to: dripdoggyofficial@gmail.com\n\n" +
                    "Best regards,\n" +
                    "The DripDoggy Team");
            mailSender.send(message);
        }
    }

    public void sendCustomerExchangeRefundInitiatedEmail(String toEmail, String orderNumber, String customerName, String productName, String variantName, double refundAmount) {
        try {
            jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("DripDoggy Exchange Request Initiated - Refund Pending - " + orderNumber);
            
            String htmlContent = "<h3>Hello, " + customerName + "!</h3>" +
                    "<p>Your exchange request for order <b>" + orderNumber + "</b> has been successfully initiated.</p>" +
                    "<p><b>Product:</b> " + productName + " (" + variantName + ")</p>" +
                    "<p>Because the replacement item is cheaper, you are owed a refund of <b>₹" + refundAmount + "</b> which will be processed upon approval.</p>" +
                    "<p>Best regards,<br/>The DripDoggy Team</p>";
            
            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("DripDoggy Exchange Request Initiated - Refund Pending - " + orderNumber);
            message.setText("Dear " + customerName + ",\n\n" +
                    "Your exchange request for order " + orderNumber + " has been successfully initiated.\n\n" +
                    "Product: " + productName + " (" + variantName + ")\n" +
                    "Because the replacement item is cheaper, you are owed a refund of ₹" + refundAmount + " which will be processed upon approval.\n\n" +
                    "Best regards,\n" +
                    "The DripDoggy Team");
            mailSender.send(message);
        }
    }

    public void sendCustomerExchangeDeliveredEmail(String toEmail, String orderNumber, String customerName) {
        try {
            jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("DripDoggy Exchange Product Delivered - " + orderNumber);
            
            String htmlContent = "<h3>Hello, " + customerName + "!</h3>" +
                    "<p>Your exchange product for order <b>" + orderNumber + "</b> has been successfully delivered to you.</p>" +
                    "<p>Thank you for your time.</p>" +
                    "<p>Best regards,<br/>The DripDoggy Team</p>";
                    
            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("DripDoggy Exchange Product Delivered - " + orderNumber);
            message.setText("Dear " + customerName + ",\n\n" +
                    "Your exchange product for order " + orderNumber + " has been successfully delivered to you.\n\n" +
                    "Thank you for your time.\n\n" +
                    "Best regards,\n" +
                    "The DripDoggy Team");
            mailSender.send(message);
        }
    }

    public void sendCustomerExchangeSizeUnavailableEmail(String toEmail, String orderNumber, String customerName, String productName, String targetSize, Long returnId) {
        try {
            jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Action Required: Exchange Size Unavailable for Order " + orderNumber);
            
            String htmlContent = "<h3>Hello, " + customerName + "!</h3>" +
                    "<p>We went to process your exchange for the <b>" + productName + "</b> (Size: <b>" + targetSize + "</b>), but unfortunately this size is currently unavailable.</p>" +
                    "<p>Please log in to your account or visit the following links to select how you would like to proceed:</p>" +
                    "<ul>" +
                    "<li><b>Option 1 (Refund):</b> <a href=\"http://localhost:3000/returns/" + returnId + "/resolution?choice=REFUND\">Request a full refund for these items</a></li>" +
                    "<li><b>Option 2 (Keep Original):</b> <a href=\"http://localhost:3000/returns/" + returnId + "/resolution?choice=KEEP_ORIGINAL\">Keep the original items you already have (No refund)</a></li>" +
                    "</ul>" +
                    "<p>Best regards,<br/>The DripDoggy Team</p>";
                    
            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Action Required: Exchange Size Unavailable for Order " + orderNumber);
            message.setText("Dear " + customerName + ",\n\n" +
                    "We went to process your exchange for the " + productName + " (Size: " + targetSize + "), but unfortunately this size is currently unavailable.\n\n" +
                    "Please choose how you would like to proceed:\n" +
                    "Option 1 (Refund): http://localhost:3000/returns/" + returnId + "/resolution?choice=REFUND\n" +
                    "Option 2 (Keep Original): http://localhost:3000/returns/" + returnId + "/resolution?choice=KEEP_ORIGINAL\n\n" +
                    "Best regards,\n" +
                    "The DripDoggy Team");
            mailSender.send(message);
        }
    }

    public void sendCustomerExchangeUnavailableClosedEmail(String toEmail, String orderNumber, String customerName) {
        try {
            jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Exchange Request Closed - " + orderNumber);
            
            String htmlContent = "<h3>Hello, " + customerName + "!</h3>" +
                    "<p>Your exchange request for order <b>" + orderNumber + "</b> has been closed as you chose to keep the original products.</p>" +
                    "<p>Thank you for shopping with us!</p>" +
                    "<p>Best regards,<br/>The DripDoggy Team</p>";
                    
            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Exchange Request Closed - " + orderNumber);
            message.setText("Dear " + customerName + ",\n\n" +
                    "Your exchange request for order " + orderNumber + " has been closed as you chose to keep the original products.\n\n" +
                    "Thank you for shopping with us!\n\n" +
                    "Best regards,\n" +
                    "The DripDoggy Team");
            mailSender.send(message);
        }
    }
}
