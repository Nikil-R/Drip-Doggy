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

    /**
     * Common template builder to render consistent visual layout matching the premium refund success email design,
     * without any interactive buttons.
     */
    private String buildCustomerEmail(
            String title,
            String subtitle,
            String badgeLabel,
            String badgeValue,
            String boxTitle,
            String boxValue,
            String extraLabel,
            String extraValue,
            String customDetailsHtml,
            String footerNote
    ) {
        String badgeRow = "";
        if (badgeLabel != null && !badgeLabel.isEmpty() && badgeValue != null && !badgeValue.isEmpty()) {
            badgeRow = "                            <!-- Badge/Product row -->\n" +
                    "                            <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"margin-bottom: 15px;\">\n" +
                    "                                <tr>\n" +
                    "                                    <td align=\"left\" style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; vertical-align: middle;\">\n" +
                    "                                        " + badgeLabel + "\n" +
                    "                                    </td>\n" +
                    "                                    <td align=\"right\" style=\"vertical-align: middle;\">\n" +
                    "                                        <span style=\"background-color: #0056cc; color: #ffffff; padding: 6px 14px; border-radius: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; font-weight: 700; display: inline-block; max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;\">\n" +
                    "                                            " + badgeValue + "\n" +
                    "                                        </span>\n" +
                    "                                    </td>\n" +
                    "                                </tr>\n" +
                    "                            </table>\n";
        }

        String extraBlock = "";
        if (extraLabel != null && !extraLabel.isEmpty() && extraValue != null && !extraValue.isEmpty()) {
            extraBlock = "                            <!-- Extra Info Block -->\n" +
                    "                            <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n" +
                    "                                <tr>\n" +
                    "                                    <td valign=\"top\" style=\"width: 22px;\">\n" +
                    "                                        <span style=\"display: inline-block; width: 14px; height: 14px; border-radius: 50%; border: 1.5px solid #ff0055; color: #ff0055; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px; font-weight: bold; line-height: 14px;\">i</span>\n" +
                    "                                    </td>\n" +
                    "                                    <td valign=\"top\" style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #1e293b; font-weight: 700; line-height: 14px;\">\n" +
                    "                                        " + extraLabel + "\n" +
                    "                                    </td>\n" +
                    "                                </tr>\n" +
                    "                                <tr>\n" +
                    "                                    <td>&nbsp;</td>\n" +
                    "                                    <td style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #64748b; line-height: 1.5; padding-top: 4px;\">\n" +
                    "                                        " + extraValue + "\n" +
                    "                                    </td>\n" +
                    "                                </tr>\n" +
                    "                            </table>\n";
        }

        String blueValueBox = "";
        if ((boxTitle != null && !boxTitle.isEmpty()) || (boxValue != null && !boxValue.isEmpty())) {
            blueValueBox = "                                        <!-- Blue Value Box -->\n" +
                    "                                        <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"background-color: #ebf3ff; border-radius: 12px; border-left: 4px solid #ff0055; border-right: 4px solid #fbc02d; margin-bottom: 15px;\">\n" +
                    "                                            <tr>\n" +
                    "                                                <td align=\"center\" style=\"padding: 15px 20px;\">\n" +
                    "                                                    <div style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px; font-weight: 800; color: #0056cc; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;\">\n" +
                    "                                                        " + (boxTitle != null ? boxTitle : "") + "\n" +
                    "                                                    </div>\n" +
                    "                                                    <div style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 32px; font-weight: 800; color: #0056cc;\">\n" +
                    "                                                        " + (boxValue != null ? boxValue : "") + "\n" +
                    "                                                    </div>\n" +
                    "                                                </td>\n" +
                    "                                            </tr>\n" +
                    "                                        </table>\n" +
                    "                                        \n";
        }

        String customDetailsSection = "";
        if (customDetailsHtml != null && !customDetailsHtml.isEmpty()) {
            customDetailsSection = "                            <!-- Custom Details Section -->\n" +
                    "                            <div style=\"margin-top: 20px; border-top: 1px dashed #e2e8f0; padding-top: 20px;\">\n" +
                    "                                " + customDetailsHtml + "\n" +
                    "                            </div>\n";
        }

        return "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "    <meta charset=\"utf-8\">\n" +
                "    <title>" + title + "</title>\n" +
                "</head>\n" +
                "<body style=\"margin: 0; padding: 0; background-color: #f3f6fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;\">\n" +
                "    <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"background-color: #f3f6fc; padding: 40px 20px;\">\n" +
                "        <tr>\n" +
                "            <td align=\"center\">\n" +
                "                <!-- Main Card Container -->\n" +
                "                <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"max-width: 480px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.03); border: 1px solid #ebf0f9; border-collapse: separate;\">\n" +
                "                    <tr>\n" +
                "                        <td style=\"padding: 40px 30px; position: relative; text-align: center;\">\n" +
                "                            \n" +
                "                            <!-- Header (Logo & Top Right Icon) -->\n" +
                "                            <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"margin-bottom: 30px;\">\n" +
                "                                <tr>\n" +
                "                                    <!-- Brand Logo -->\n" +
                "                                    <td align=\"left\" valign=\"middle\">\n" +
                "                                        <table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n" +
                "                                            <tr>\n" +
                "                                                <td style=\"padding-right: 8px; vertical-align: middle;\">\n" +
                "                                                    <svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" style=\"display: block;\">\n" +
                "                                                        <path d=\"M12 2L4 5V11C4 16.52 7.42 21.64 12 23C16.58 21.64 20 16.52 20 11V5L12 2Z\" fill=\"#0056cc\"/>\n" +
                "                                                        <path d=\"M12 7C10.9 7 10 7.9 10 9C10 9.74 10.4 10.38 11 10.72V14C11 14.55 11.45 15 12 15C12.55 15 13 14.55 13 14V10.72C13.6 10.38 14 9.74 14 9C14 7.9 13.1 7 12 7Z\" fill=\"#ffffff\"/>\n" +
                "                                                    </svg>\n" +
                "                                                </td>\n" +
                "                                                <td style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 20px; font-weight: 800; color: #0056cc; vertical-align: middle; letter-spacing: -0.5px;\">\n" +
                "                                                    DripDoggy\n" +
                "                                                </td>\n" +
                "                                            </tr>\n" +
                "                                        </table>\n" +
                "                                    </td>\n" +
                "                                    <!-- Top Right Icon -->\n" +
                "                                    <td align=\"right\" valign=\"middle\">\n" +
                "                                        <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
                "                                            <path d=\"M12 2L4 5V11C4 16.52 7.42 21.64 12 23C16.58 21.64 20 16.52 20 11V5L12 2Z\" stroke=\"#0056cc\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n" +
                "                                        </svg>\n" +
                "                                    </td>\n" +
                "                                </tr>\n" +
                "                            </table>\n" +
                "                            \n" +
                "                            <!-- Title -->\n" +
                "                            <h2 style=\"margin: 0 0 10px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; line-height: 1.3;\">\n" +
                "                                " + title + "\n" +
                "                            </h2>\n" +
                "                            \n" +
                "                            <!-- Subtitle -->\n" +
                "                            <p style=\"margin: 0 0 25px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #64748b; font-size: 14px; line-height: 1.5; font-weight: 500;\">\n" +
                "                                " + subtitle + "\n" +
                "                            </p>\n" +
                "                            \n" +
                "                            <!-- Information Box -->\n" +
                "                            <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 16px; padding: 20px; margin-bottom: 25px; text-align: left;\">\n" +
                "                                <tr>\n" +
                "                                    <td>\n" +
                "                                        " + badgeRow + "\n" +
                "                                        \n" +
                "                                        " + blueValueBox + "\n" +
                "                                        \n" +
                "                                        " + extraBlock + "\n" +
                "                                        \n" +
                "                                        " + customDetailsSection + "\n" +
                "                                    </td>\n" +
                "                                </tr>\n" +
                "                            </table>\n" +
                "                            \n" +
                "                            <!-- Footer Note -->\n" +
                "                            <p style=\"margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #64748b; font-size: 12px; line-height: 1.5; font-weight: 500;\">\n" +
                "                                " + footerNote + "\n" +
                "                            </p>\n" +
                "                            \n" +
                "                        </td>\n" +
                "                    </tr>\n" +
                "                </table>\n" +
                "                \n" +
                "                <!-- Footer Links & Signature -->\n" +
                "                <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"max-width: 480px; margin-top: 25px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\">\n" +
                "                    <tr>\n" +
                "                        <td style=\"color: #64748b; font-size: 12px; line-height: 1.8;\">\n" +
                "                            <div style=\"margin-bottom: 12px; font-weight: 600;\">\n" +
                "                                <a href=\"mailto:support.dripdoggy@gmail.com\" style=\"color: #0056cc; text-decoration: none; margin: 0 8px;\">Support Center</a>\n" +
                "                                <a href=\"#\" style=\"color: #0056cc; text-decoration: none; margin: 0 8px;\">Privacy Policy</a>\n" +
                "                                <a href=\"#\" style=\"color: #0056cc; text-decoration: none; margin: 0 8px;\">Unsubscribe</a>\n" +
                "                            </div>\n" +
                "                            <div style=\"font-weight: 600; color: #475569; margin-bottom: 5px;\">\n" +
                "                                Best regards,<br/>\n" +
                "                                <span style=\"color: #1e293b;\">The DripDoggy Team</span>\n" +
                "                            </div>\n" +
                "                            <div style=\"color: #94a3b8; font-size: 10px; margin-top: 15px;\">\n" +
                "                                &copy; 2026 DripDoggy Security Team. All rights reserved.\n" +
                "                            </div>\n" +
                "                        </td>\n" +
                "                    </tr>\n" +
                "                </table>\n" +
                "                \n" +
                "            </td>\n" +
                "        </tr>\n" +
                "    </table>\n" +
                "</body>\n" +
                "</html>";
    }

    public void sendOtpEmail(String toEmail, String otpCode) {
        sendOtpEmail(toEmail, otpCode, false);
    }

    public void sendOtpEmail(String toEmail, String otpCode, boolean isLogin) {
        try {
            jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            
            helper.setSubject(isLogin ? "Your Login OTP" : "Your Signup OTP");

            String formattedOtp = otpCode.length() == 6 
                ? otpCode.substring(0, 3) + " " + otpCode.substring(3) 
                : otpCode;

            String title = "Woof! Here's your secure code.";
            String subtitle = "We're so happy to see you! Use the code below to finish signing in.";
            String htmlContent = buildCustomerEmail(
                    title,
                    subtitle,
                    "Security Center",
                    isLogin ? "Login OTP" : "Signup OTP",
                    "OTP Code",
                    formattedOtp,
                    null, null,
                    null,
                    "This code expires in 10 minutes. Didn't request this? Just ignore us &mdash; no hard feelings!"
            );
            
            helper.setText(htmlContent, true);
            

            
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            String label = isLogin ? "LOGIN OTP" : "SIGNUP OTP";
            message.setSubject(isLogin ? "Your Login OTP" : "Your Signup OTP");
            message.setText("Your OTP code is: " + otpCode + "\n\nThis is your " + label + ".\n\nIt is valid for 10 minutes.");
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

    public void sendOrderPlacementEmail(String toEmail, String orderNumber, String customerName, com.dripdoggy.backend.entity.Orders order) {
        try {
            jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("DripDoggy Order Placed Successfully - " + orderNumber);
            
            java.math.BigDecimal subTotal = java.math.BigDecimal.ZERO;
            StringBuilder itemsHtml = new StringBuilder();
            itemsHtml.append("<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"6\" style=\"border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #334155; margin-bottom: 15px;\">")
                     .append("<thead>")
                     .append("<tr style=\"background-color: #f1f5f9; border-bottom: 2px solid #e2e8f0; font-weight: 700;\">")
                     .append("<th align=\"left\" style=\"padding: 8px 4px;\">Item</th>")
                     .append("<th align=\"center\" style=\"padding: 8px 4px;\">Size</th>")
                     .append("<th align=\"center\" style=\"padding: 8px 4px;\">Qty</th>")
                     .append("<th align=\"right\" style=\"padding: 8px 4px;\">Total</th>")
                     .append("</tr>")
                     .append("</thead>")
                     .append("<tbody>");
            
            if (order.getOrderItems() != null) {
                for (com.dripdoggy.backend.entity.OrderItem oi : order.getOrderItems()) {
                    subTotal = subTotal.add(oi.getSubTotal());
                    
                    String pName = "Product";
                    String vName = "Default";
                    String sName = "N/A";
                    
                    if (oi.getProductVariantSize() != null) {
                        sName = oi.getProductVariantSize().getSizeName();
                        if (oi.getProductVariantSize().getProductVariant() != null) {
                            vName = oi.getProductVariantSize().getProductVariant().getVariantName();
                            if (oi.getProductVariantSize().getProductVariant().getProduct() != null) {
                                pName = oi.getProductVariantSize().getProductVariant().getProduct().getProductName();
                            }
                        }
                    }
                    
                    itemsHtml.append("<tr style=\"border-bottom: 1px solid #f1f5f9;\">")
                             .append("<td style=\"padding: 8px 4px;\">")
                             .append("<div style=\"font-weight: 600; color: #1e293b;\">").append(pName).append("</div>")
                             .append("<div style=\"font-size: 11px; color: #64748b;\">Color: ").append(vName).append("</div>")
                             .append("</td>")
                             .append("<td align=\"center\" style=\"padding: 8px 4px;\">").append(sName).append("</td>")
                             .append("<td align=\"center\" style=\"padding: 8px 4px;\">").append(oi.getQuantity()).append("</td>")
                             .append("<td align=\"right\" style=\"padding: 8px 4px; font-weight: 600;\">₹").append(oi.getSubTotal()).append("</td>")
                             .append("</tr>");
                }
            }
            itemsHtml.append("</tbody></table>");
            
            java.math.BigDecimal discountVal = order.getDiscount() != null ? order.getDiscount() : java.math.BigDecimal.ZERO;
            java.math.BigDecimal shippingFee = order.getShippingFee() != null ? order.getShippingFee() : java.math.BigDecimal.ZERO;
            java.math.BigDecimal grandTotal = order.getTotalAmount() != null ? order.getTotalAmount() : subTotal.subtract(discountVal).add(shippingFee);
            
            StringBuilder billHtml = new StringBuilder();
            billHtml.append("<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"4\" style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #475569;\">")
                    .append("<tr><td align=\"left\">Subtotal</td><td align=\"right\">₹").append(subTotal).append("</td></tr>");
            
            if (discountVal.compareTo(java.math.BigDecimal.ZERO) > 0) {
                billHtml.append("<tr><td align=\"left\" style=\"color: #16a34a;\">Discount</td><td align=\"right\" style=\"color: #16a34a;\">-₹").append(discountVal).append("</td></tr>");
            }
            
            billHtml.append("<tr><td align=\"left\">Shipping Fee</td><td align=\"right\">₹").append(shippingFee).append("</td></tr>")
                    .append("<tr><td align=\"left\">Platform Fee</td><td align=\"right\" style=\"color: #16a34a; font-weight: 600;\">₹0.00 (FREE)</td></tr>")
                    .append("<tr style=\"font-size: 15px; font-weight: 800; color: #0056cc;\"><td align=\"left\" style=\"padding-top: 8px;\">Grand Total</td><td align=\"right\" style=\"padding-top: 8px;\">₹").append(grandTotal).append("</td></tr>")
                    .append("</table>");
            
            String customDetailsHtml = itemsHtml.toString() + billHtml.toString();

            String title = "Order Placed Successfully!";
            String subtitle = "Hello, " + customerName + "! We've successfully received and placed your order.";
            String htmlContent = buildCustomerEmail(
                    title,
                    subtitle,
                    "Order Reference",
                    orderNumber,
                    "Total Amount",
                    "₹" + grandTotal,
                    "Payment Method",
                    "Cash on Delivery (COD)",
                    customDetailsHtml,
                    "We will notify you via email when your items are shipped. Thank you for shopping with us!"
            );
            
            helper.setText(htmlContent, true);
            

            
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("DripDoggy Order Placed Successfully - " + orderNumber);
            message.setText("Dear " + customerName + ",\n\n" +
                    "Your order " + orderNumber + " has been successfully placed.\n\n" +
                    "Total Amount: ₹" + order.getTotalAmount() + "\n" +
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

    public void sendCustomerReturnInitiatedEmail(
            String toEmail, 
            String orderNumber, 
            String requestType, 
            String customerName, 
            String productName,
            String variantName,
            String sizeName,
            double price,
            int quantity
    ) {
        try {
            jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("DripDoggy " + requestType + " Request Initiated - " + orderNumber);
            
            String customDetailsHtml = "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"6\" style=\"border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #334155; margin-top: 10px;\">" +
                    "<tr style=\"border-bottom: 1px solid #f1f5f9;\">" +
                    "<td style=\"padding: 6px 0; font-weight: 600; color: #1e293b;\">Product</td>" +
                    "<td align=\"right\" style=\"padding: 6px 0; color: #475569;\">" + productName + "</td>" +
                    "</tr>" +
                    "<tr style=\"border-bottom: 1px solid #f1f5f9;\">" +
                    "<td style=\"padding: 6px 0; font-weight: 600; color: #1e293b;\">Color/Variant</td>" +
                    "<td align=\"right\" style=\"padding: 6px 0; color: #475569;\">" + variantName + "</td>" +
                    "</tr>" +
                    "<tr style=\"border-bottom: 1px solid #f1f5f9;\">" +
                    "<td style=\"padding: 6px 0; font-weight: 600; color: #1e293b;\">Size</td>" +
                    "<td align=\"right\" style=\"padding: 6px 0; color: #475569;\">" + sizeName + "</td>" +
                    "</tr>" +
                    "<tr style=\"border-bottom: 1px solid #f1f5f9;\">" +
                    "<td style=\"padding: 6px 0; font-weight: 600; color: #1e293b;\">Unit Price</td>" +
                    "<td align=\"right\" style=\"padding: 6px 0; color: #475569;\">₹" + price + "</td>" +
                    "</tr>" +
                    "<tr style=\"border-bottom: 1px solid #f1f5f9;\">" +
                    "<td style=\"padding: 6px 0; font-weight: 600; color: #1e293b;\">Quantity</td>" +
                    "<td align=\"right\" style=\"padding: 6px 0; color: #475569;\">" + quantity + "</td>" +
                    "</tr>" +
                    "<tr style=\"border-bottom: 1px solid #f1f5f9;\">" +
                    "<td style=\"padding: 6px 0; font-weight: 600; color: #1e293b;\">Total Value</td>" +
                    "<td align=\"right\" style=\"padding: 6px 0; color: #16a34a; font-weight: bold;\">₹" + (price * quantity) + "</td>" +
                    "</tr>" +
                    "</table>";

            String title = requestType + " Request Initiated!";
            String subtitle = "Hello, " + customerName + "! We have successfully received your " + requestType.toLowerCase() + " request for order " + orderNumber + ".";
            String htmlContent = buildCustomerEmail(
                    title,
                    subtitle,
                    "Request Type",
                    requestType,
                    "Current Status",
                    "Under Review",
                    null, null,
                    customDetailsHtml,
                    "Our admin team is currently reviewing your request (defect images & reasons). We will update you once it is approved or rejected."
            );
            
            helper.setText(htmlContent, true);
            

            
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("DripDoggy " + requestType + " Request Initiated - " + orderNumber);
            message.setText("Dear " + customerName + ",\n\n" +
                    "We have successfully received your " + requestType + " request for order " + orderNumber + ".\n\n" +
                    "Product: " + productName + "\n" +
                    "Variant: " + variantName + "\n" +
                    "Size: " + sizeName + "\n" +
                    "Price: ₹" + price + "\n" +
                    "Quantity: " + quantity + "\n\n" +
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
            
            String title = requestType + " Status Updated!";
            String subtitle = "Hello, " + customerName + "! Your " + requestType.toLowerCase() + " request for order " + orderNumber + " has been processed.";
            String htmlContent = buildCustomerEmail(
                    title,
                    subtitle,
                    "Order Number",
                    orderNumber,
                    "Request Status",
                    status,
                    "Update Details",
                    statusText,
                    null,
                    "If you have any questions or concerns about this update, please reach out to our <a href=\"mailto:support.dripdoggy@gmail.com\" style=\"color: #0056cc; text-decoration: underline;\">Support Center</a>."
            );
            
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
            
            String requestName = (deliveryStatus != null && deliveryStatus.startsWith("EXCHANGE")) ? "Exchange" : "Return";
            helper.setSubject("DripDoggy " + requestName + " Package Update: " + deliveryStatus + " - " + orderNumber);
            
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
            
            String title = requestName + " Package Update";
            String subtitle = "Hello, " + customerName + "! There is a new update regarding your " + requestName.toLowerCase() + " shipment.";
            String htmlContent = buildCustomerEmail(
                    title,
                    subtitle,
                    "Order Number",
                    orderNumber,
                    "Logistics Status",
                    deliveryStatus,
                    "Logistics Update",
                    updateMessage,
                    null,
                    "We are closely monitoring your " + requestName.toLowerCase() + " package transit back to our warehouse."
            );
            
            helper.setText(htmlContent, true);
            

            
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            String requestName = (deliveryStatus != null && deliveryStatus.startsWith("EXCHANGE")) ? "Exchange" : "Return";
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("DripDoggy " + requestName + " Package Update: " + deliveryStatus + " - " + orderNumber);
            
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
            
            message.setText("Dear " + customerName + ",\n\n" +
                    "There is a new update regarding your " + requestName.toLowerCase() + " shipment for order " + orderNumber + ".\n\n" +
                    "Status: " + deliveryStatus + "\n" +
                    "Details: Your package " + updateMessage + "\n\n" +
                    "Best regards,\n" +
                    "The DripDoggy Team");
            mailSender.send(message);
        }
    }

    public void sendCustomerRefundCompletedEmail(String toEmail, String orderNumber, String customerName, String productName, String transactionId, double refundAmount) {
        sendCustomerRefundCompletedEmail(toEmail, orderNumber, customerName, productName, transactionId, false, refundAmount);
    }

    public void sendCustomerRefundCompletedEmail(String toEmail, String orderNumber, String customerName, String productName, String transactionId, boolean wasExchangeFallback, double refundAmount) {
        try {
            jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(wasExchangeFallback ? "DripDoggy Exchange Refund Processed - " + orderNumber : "DripDoggy Refund Processed Successfully - " + orderNumber);
            
            String refundReasonText = wasExchangeFallback 
                    ? "Replacement item for exchange request was out of stock."
                    : "Return refund approved and processed.";

            String title = "Your Refund has been Processed!";
            String subtitle = "Hello, " + customerName + "! We've successfully completed your refund for Order " + orderNumber + ".";
            
            String footerNote = "Please allow 2-3 business days for the funds to reflect in your account.";
            
            String customDetailsHtml = null;
            if (transactionId != null && !transactionId.trim().isEmpty()) {
                customDetailsHtml = "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"6\" style=\"border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #334155; margin-top: 10px;\">" +
                        "<tr style=\"border-bottom: 1px solid #f1f5f9;\">" +
                        "<td style=\"padding: 6px 0; font-weight: 600; color: #1e293b;\">Transaction ID</td>" +
                        "<td align=\"right\" style=\"padding: 6px 0; color: #16a34a; font-weight: bold;\">" + transactionId.trim() + "</td>" +
                        "</tr>" +
                        "</table>";
            }

            String htmlContent = buildCustomerEmail(
                    title,
                    subtitle,
                    "Product",
                    productName,
                    "Refund Amount",
                    "₹" + refundAmount,
                    "Reason for Refund",
                    refundReasonText,
                    customDetailsHtml,
                    footerNote
            );
            
            helper.setText(htmlContent, true);
            

            
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject(wasExchangeFallback ? "DripDoggy Exchange Refund Processed - " + orderNumber : "DripDoggy Refund Processed Successfully - " + orderNumber);
            
            String refundText = wasExchangeFallback
                    ? "Your refund for order " + orderNumber + " has been processed because the replacement item for your exchange request was out of stock."
                    : "Your refund for order " + orderNumber + " has been successfully processed.";
            
            String receiptLine = (transactionId != null && !transactionId.trim().isEmpty())
                    ? "Transaction ID: " + transactionId.trim() + "\n"
                    : "";
            message.setText("Dear " + customerName + ",\n\n" +
                    refundText + "\n\n" +
                    "Product: " + productName + "\n" +
                    "Refund Amount: ₹" + refundAmount + "\n" +
                    receiptLine + "\n" +
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
            
            String trackingId = (trackingNumber != null && !trackingNumber.isEmpty()) ? trackingNumber : "N/A";
            
            String title = "Replacement Order Shipped!";
            String subtitle = "Hello, " + customerName + "! Your exchange request for order " + orderNumber + " is now completed and shipped.";
            String htmlContent = buildCustomerEmail(
                    title,
                    subtitle,
                    "Product Replacement",
                    productName + " (Size: " + targetSize + ")",
                    "Tracking ID",
                    trackingId,
                    "Exchange Status",
                    "Completed & Shipped",
                    null,
                    "Your replacement item is on its way. Thank you for your patience and for shopping with us!"
            );
            
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

    public void sendCustomerExchangeRefundInitiatedEmail(
            String toEmail, 
            String orderNumber, 
            String customerName, 
            String productName, 
            String variantName, 
            double refundAmount,
            String sizeName,
            double price,
            int quantity
    ) {
        try {
            jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("DripDoggy Exchange Request Initiated - Refund Pending - " + orderNumber);
            
            String customDetailsHtml = "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"6\" style=\"border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #334155; margin-top: 10px;\">" +
                    "<tr style=\"border-bottom: 1px solid #f1f5f9;\">" +
                    "<td style=\"padding: 6px 0; font-weight: 600; color: #1e293b;\">Product</td>" +
                    "<td align=\"right\" style=\"padding: 6px 0; color: #475569;\">" + productName + "</td>" +
                    "</tr>" +
                    "<tr style=\"border-bottom: 1px solid #f1f5f9;\">" +
                    "<td style=\"padding: 6px 0; font-weight: 600; color: #1e293b;\">Color/Variant</td>" +
                    "<td align=\"right\" style=\"padding: 6px 0; color: #475569;\">" + variantName + "</td>" +
                    "</tr>" +
                    "<tr style=\"border-bottom: 1px solid #f1f5f9;\">" +
                    "<td style=\"padding: 6px 0; font-weight: 600; color: #1e293b;\">Size</td>" +
                    "<td align=\"right\" style=\"padding: 6px 0; color: #475569;\">" + sizeName + "</td>" +
                    "</tr>" +
                    "<tr style=\"border-bottom: 1px solid #f1f5f9;\">" +
                    "<td style=\"padding: 6px 0; font-weight: 600; color: #1e293b;\">Unit Price</td>" +
                    "<td align=\"right\" style=\"padding: 6px 0; color: #475569;\">₹" + price + "</td>" +
                    "</tr>" +
                    "<tr style=\"border-bottom: 1px solid #f1f5f9;\">" +
                    "<td style=\"padding: 6px 0; font-weight: 600; color: #1e293b;\">Quantity</td>" +
                    "<td align=\"right\" style=\"padding: 6px 0; color: #475569;\">" + quantity + "</td>" +
                    "</tr>" +
                    "<tr style=\"border-bottom: 1px solid #f1f5f9;\">" +
                    "<td style=\"padding: 6px 0; font-weight: 600; color: #1e293b;\">Total Value</td>" +
                    "<td align=\"right\" style=\"padding: 6px 0; color: #16a34a; font-weight: bold;\">₹" + (price * quantity) + "</td>" +
                    "</tr>" +
                    "</table>";

            String title = "Exchange Refund Pending";
            String subtitle = "Hello, " + customerName + "! Your exchange request for order " + orderNumber + " has been successfully initiated.";
            String htmlContent = buildCustomerEmail(
                    title,
                    subtitle,
                    "Product Exchange",
                    productName,
                    "Refund Difference Due",
                    "₹" + refundAmount,
                    "Information Notice",
                    "Because the replacement item is cheaper, you are owed a refund difference which will be processed upon approval of the exchange.",
                    customDetailsHtml,
                    "The refund difference will be processed back to your original payment method once the returned item is inspected."
            );
            
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
                    "Size: " + sizeName + "\n" +
                    "Price: ₹" + price + "\n" +
                    "Quantity: " + quantity + "\n" +
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
            
            String title = "Replacement Product Delivered!";
            String subtitle = "Hello, " + customerName + "! Your replacement exchange item for order " + orderNumber + " has been successfully delivered.";
            String htmlContent = buildCustomerEmail(
                    title,
                    subtitle,
                    "Order Number",
                    orderNumber,
                    "Delivery Status",
                    "DELIVERED",
                    "Status Update",
                    "Your replacement items have been successfully dropped off at your address.",
                    null,
                    "Thank you for choosing DripDoggy. We hope you love your new replacement item!"
            );
            
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

    public void sendCustomerExchangeSizeUnavailableEmail(
            String toEmail, 
            String orderNumber, 
            String customerName, 
            String productName, 
            String originalSize, 
            String originalVariant, 
            int quantity, 
            String targetSize, 
            String targetVariant, 
            double refundAmount,
            Long returnId
    ) {
        try {
            jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Action Required: Exchange Size Unavailable for Order " + orderNumber);
            
            String title = "Exchange Size Unavailable";
            String subtitle = "Hello, " + customerName + "! The size you requested for your exchange is currently out of stock. Please select how you would like to proceed.";
            
            String customDetailsHtml = "<div style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #334155; line-height: 1.6;\">" +
                    "<p style=\"margin: 0 0 15px 0;\">We were processing your exchange, but unfortunately, the target replacement size is currently out of stock.</p>" +
                    "<div style=\"background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 15px 0;\">" +
                    "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"4\" style=\"font-size: 13px; color: #475569;\">" +
                    "<tr>" +
                    "<td style=\"font-weight: 600; color: #1e293b;\" width=\"40%\">Original Product:</td>" +
                    "<td><strong>" + quantity + " x</strong> " + productName + " (" + originalVariant + " / Size: " + originalSize + ")</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td style=\"font-weight: 600; color: #1e293b;\">Requested Exchange:</td>" +
                    "<td style=\"color: #ef4444; font-weight: 600;\">" + quantity + " x " + productName + " (" + targetVariant + " / Size: " + targetSize + ") <span style=\"font-size: 11px; font-weight: normal; background-color: #fee2e2; color: #ef4444; padding: 2px 6px; border-radius: 4px; margin-left: 5px;\">Out of Stock</span></td>" +
                    "</tr>" +
                    "</table>" +
                    "</div>" +
                    "<p style=\"margin: 15px 0 10px 0; font-weight: 600; color: #1e293b;\">How to resolve this:</p>" +
                    "<ol style=\"margin: 0; padding-left: 20px; color: #475569; font-size: 13px;\">" +
                    "<li style=\"margin-bottom: 8px;\">Log into your account on the <strong>DripDoggy Website</strong>.</li>" +
                    "<li style=\"margin-bottom: 8px;\">Go to your <strong>Order History</strong> page.</li>" +
                    "<li style=\"margin-bottom: 8px;\">Choose one of the following resolution options available on your order card:" +
                    "<ul style=\"margin: 8px 0 0 0; padding-left: 20px;\">" +
                    "<li style=\"margin-bottom: 4px;\"><strong>Option 1 (Refund):</strong> Convert the request to receive a full refund of <strong>₹" + refundAmount + "</strong>.</li>" +
                    "<li style=\"margin-bottom: 4px;\"><strong>Option 2 (Keep Original):</strong> Keep your original items and close the exchange request.</li>" +
                    "</ul>" +
                    "</li>" +
                    "</ol>" +
                    "</div>";
            
            String htmlContent = buildCustomerEmail(
                    title,
                    subtitle,
                    "Requested Product",
                    productName + " (Size: " + targetSize + ")",
                    "Action Required",
                    "Choose Resolution on Site",
                    null, null,
                    customDetailsHtml,
                    "Please visit your Order History page on our website to choose a resolution."
            );
            
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
                    "Option 1 (Refund): Request Refund for the " + quantity + " x " + productName + " (Size: " + originalSize + ") you originally received and returned.\n" +
                    "Option 2 (Keep Original): Cancel Exchange and keep your original " + quantity + " x " + productName + " (Size: " + originalSize + ").\n\n" +
                    "Best regards,\n" +
                    "The DripDoggy Team");
            mailSender.send(message);
        }
    }

    public void sendCustomerExchangeUnavailableClosedEmail(
            String toEmail, 
            String orderNumber, 
            String customerName,
            String productName,
            String variantName,
            String sizeName,
            int quantity
    ) {
        try {
            jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Exchange Request Resolved - " + orderNumber);
            
            String title = "Exchange Request Resolved";
            String subtitle = "Hello, " + customerName + "! Your exchange request for order " + orderNumber + " has been resolved.";
            
            String customDetailsHtml = "<div style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #334155; line-height: 1.6;\">" +
                    "<p style=\"margin: 0 0 10px 0;\">You chose to keep the original item in your possession instead of processing an exchange.</p>" +
                    "<div style=\"background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 15px 0;\">" +
                    "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"4\" style=\"font-size: 13px; color: #475569;\">" +
                    "<tr>" +
                    "<td style=\"font-weight: 600; color: #1e293b;\" width=\"40%\">Item Kept:</td>" +
                    "<td>" + productName + " (" + variantName + " / Size: " + sizeName + ")</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td style=\"font-weight: 600; color: #1e293b;\">Quantity Kept:</td>" +
                    "<td><strong>" + quantity + "</strong></td>" +
                    "</tr>" +
                    "</table>" +
                    "</div>" +
                    "</div>";

            String htmlContent = buildCustomerEmail(
                    title,
                    subtitle,
                    "Order Reference",
                    orderNumber,
                    "Exchange Ticket Status",
                    "RESOLVED",
                    "Reason for Resolution",
                    "Customer chose to keep the original items in their possession.",
                    customDetailsHtml,
                    "Thank you for shopping with us! If you have any questions, you can contact our <a href=\"mailto:support.dripdoggy@gmail.com\" style=\"color: #0056cc; text-decoration: underline;\">Support Center</a>."
            );
            
            helper.setText(htmlContent, true);
            

            
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Exchange Request Resolved - " + orderNumber);
            message.setText("Dear " + customerName + ",\n\n" +
                    "Your exchange request for order " + orderNumber + " has been resolved as you chose to keep the original product: " +
                    productName + " (Qty: " + quantity + ").\n\n" +
                    "If you have any questions, you can contact our Support Center.\n\n" +
                    "Best regards,\n" +
                    "The DripDoggy Team");
            mailSender.send(message);
        }
    }

    public void sendCustomerOrderCancelledEmail(String toEmail, String orderNumber, String customerName, com.dripdoggy.backend.entity.Orders order) {
        try {
            jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("DripDoggy Order Cancelled - " + orderNumber);
            
            java.math.BigDecimal subTotal = java.math.BigDecimal.ZERO;
            StringBuilder itemsHtml = new StringBuilder();
            itemsHtml.append("<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"6\" style=\"border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #334155; margin-bottom: 15px;\">")
                     .append("<thead>")
                     .append("<tr style=\"background-color: #f1f5f9; border-bottom: 2px solid #e2e8f0; font-weight: 700;\">")
                     .append("<th align=\"left\" style=\"padding: 8px 4px;\">Item</th>")
                     .append("<th align=\"center\" style=\"padding: 8px 4px;\">Size</th>")
                     .append("<th align=\"center\" style=\"padding: 8px 4px;\">Qty</th>")
                     .append("<th align=\"right\" style=\"padding: 8px 4px;\">Total</th>")
                     .append("</tr>")
                     .append("</thead>")
                     .append("<tbody>");
            
            if (order.getOrderItems() != null) {
                for (com.dripdoggy.backend.entity.OrderItem oi : order.getOrderItems()) {
                    subTotal = subTotal.add(oi.getSubTotal());
                    
                    String pName = "Product";
                    String vName = "Default";
                    String sName = "N/A";
                    
                    if (oi.getProductVariantSize() != null) {
                        sName = oi.getProductVariantSize().getSizeName();
                        if (oi.getProductVariantSize().getProductVariant() != null) {
                            vName = oi.getProductVariantSize().getProductVariant().getVariantName();
                            if (oi.getProductVariantSize().getProductVariant().getProduct() != null) {
                                pName = oi.getProductVariantSize().getProductVariant().getProduct().getProductName();
                            }
                        }
                    }
                    
                    itemsHtml.append("<tr style=\"border-bottom: 1px solid #f1f5f9;\">")
                             .append("<td style=\"padding: 8px 4px;\">")
                             .append("<div style=\"font-weight: 600; color: #1e293b;\">").append(pName).append("</div>")
                             .append("<div style=\"font-size: 11px; color: #64748b;\">Color: ").append(vName).append("</div>")
                             .append("</td>")
                             .append("<td align=\"center\" style=\"padding: 8px 4px;\">").append(sName).append("</td>")
                             .append("<td align=\"center\" style=\"padding: 8px 4px;\">").append(oi.getQuantity()).append("</td>")
                             .append("<td align=\"right\" style=\"padding: 8px 4px; font-weight: 600;\">₹").append(oi.getSubTotal()).append("</td>")
                             .append("</tr>");
                }
            }
            itemsHtml.append("</tbody></table>");
            
            java.math.BigDecimal discountVal = order.getDiscount() != null ? order.getDiscount() : java.math.BigDecimal.ZERO;
            java.math.BigDecimal shippingFee = order.getShippingFee() != null ? order.getShippingFee() : java.math.BigDecimal.ZERO;
            java.math.BigDecimal grandTotal = order.getTotalAmount() != null ? order.getTotalAmount() : subTotal.subtract(discountVal).add(shippingFee);
            
            StringBuilder billHtml = new StringBuilder();
            billHtml.append("<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"4\" style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #475569;\">")
                    .append("<tr><td align=\"left\">Subtotal</td><td align=\"right\">₹").append(subTotal).append("</td></tr>");
            
            if (discountVal.compareTo(java.math.BigDecimal.ZERO) > 0) {
                billHtml.append("<tr><td align=\"left\" style=\"color: #16a34a;\">Discount</td><td align=\"right\" style=\"color: #16a34a;\">-₹").append(discountVal).append("</td></tr>");
            }
            
            billHtml.append("<tr><td align=\"left\">Shipping Fee</td><td align=\"right\">₹").append(shippingFee).append("</td></tr>")
                    .append("<tr><td align=\"left\">Platform Fee</td><td align=\"right\" style=\"color: #16a34a; font-weight: 600;\">₹0.00 (FREE)</td></tr>")
                    .append("<tr style=\"font-size: 15px; font-weight: 800; color: #ff0055;\"><td align=\"left\" style=\"padding-top: 8px;\">Grand Total Cancelled</td><td align=\"right\" style=\"padding-top: 8px;\">₹").append(grandTotal).append("</td></tr>")
                    .append("</table>");
            
            String customDetailsHtml = itemsHtml.toString() + billHtml.toString();
            String reason = (order.getCancellationReason() != null && !order.getCancellationReason().isEmpty()) 
                    ? order.getCancellationReason() 
                    : "Customer request";

            String title = "Order Cancelled Successfully";
            String subtitle = "Hello, " + customerName + "! Your order " + orderNumber + " has been cancelled as requested.";
            String htmlContent = buildCustomerEmail(
                    title,
                    subtitle,
                    "Order Reference",
                    orderNumber,
                    "Cancelled Amount",
                    "₹" + grandTotal,
                    "Cancellation Reason",
                    reason,
                    customDetailsHtml,
                    "If this cancellation was done by mistake or if you need any assistance, please contact our <a href=\"mailto:support.dripdoggy@gmail.com\" style=\"color: #0056cc; text-decoration: underline;\">Support Center</a>."
            );
            
            helper.setText(htmlContent, true);
            

            
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("DripDoggy Order Cancelled - " + orderNumber);
            message.setText("Dear " + customerName + ",\n\n" +
                    "Your order " + orderNumber + " has been successfully cancelled.\n\n" +
                    "Cancelled Amount: ₹" + order.getTotalAmount() + "\n" +
                    "Reason: " + (order.getCancellationReason() != null ? order.getCancellationReason() : "Customer request") + "\n\n" +
                    "Best regards,\n" +
                    "The DripDoggy Team");
            mailSender.send(message);
        }
    }

    public void sendCustomerOrderDeliveredEmail(String toEmail, String orderNumber, String customerName, com.dripdoggy.backend.entity.Orders order) {
        try {
            jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Your DripDoggy Order Has Been Delivered! - " + orderNumber);
            
            java.math.BigDecimal subTotal = java.math.BigDecimal.ZERO;
            StringBuilder itemsHtml = new StringBuilder();
            itemsHtml.append("<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"6\" style=\"border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #334155; margin-bottom: 15px;\">")
                     .append("<thead>")
                     .append("<tr style=\"background-color: #f1f5f9; border-bottom: 2px solid #e2e8f0; font-weight: 700;\">")
                     .append("<th align=\"left\" style=\"padding: 8px 4px;\">Item</th>")
                     .append("<th align=\"center\" style=\"padding: 8px 4px;\">Size</th>")
                     .append("<th align=\"center\" style=\"padding: 8px 4px;\">Qty</th>")
                     .append("<th align=\"right\" style=\"padding: 8px 4px;\">Total</th>")
                     .append("</tr>")
                     .append("</thead>")
                     .append("<tbody>");
            
            if (order.getOrderItems() != null) {
                for (com.dripdoggy.backend.entity.OrderItem oi : order.getOrderItems()) {
                    subTotal = subTotal.add(oi.getSubTotal());
                    
                    String pName = "Product";
                    String vName = "Default";
                    String sName = "N/A";
                    
                    if (oi.getProductVariantSize() != null) {
                        sName = oi.getProductVariantSize().getSizeName();
                        if (oi.getProductVariantSize().getProductVariant() != null) {
                            vName = oi.getProductVariantSize().getProductVariant().getVariantName();
                            if (oi.getProductVariantSize().getProductVariant().getProduct() != null) {
                                pName = oi.getProductVariantSize().getProductVariant().getProduct().getProductName();
                            }
                        }
                    }
                    
                    itemsHtml.append("<tr style=\"border-bottom: 1px solid #f1f5f9;\">")
                             .append("<td style=\"padding: 8px 4px;\">")
                             .append("<div style=\"font-weight: 600; color: #1e293b;\">").append(pName).append("</div>")
                             .append("<div style=\"font-size: 11px; color: #64748b;\">Color: ").append(vName).append("</div>")
                             .append("</td>")
                             .append("<td align=\"center\" style=\"padding: 8px 4px;\">").append(sName).append("</td>")
                             .append("<td align=\"center\" style=\"padding: 8px 4px;\">").append(oi.getQuantity()).append("</td>")
                             .append("<td align=\"right\" style=\"padding: 8px 4px; font-weight: 600;\">₹").append(oi.getSubTotal()).append("</td>")
                             .append("</tr>");
                }
            }
            itemsHtml.append("</tbody></table>");
            
            java.math.BigDecimal discountVal = order.getDiscount() != null ? order.getDiscount() : java.math.BigDecimal.ZERO;
            java.math.BigDecimal shippingFee = order.getShippingFee() != null ? order.getShippingFee() : java.math.BigDecimal.ZERO;
            java.math.BigDecimal grandTotal = order.getTotalAmount() != null ? order.getTotalAmount() : subTotal.subtract(discountVal).add(shippingFee);
            
            StringBuilder billHtml = new StringBuilder();
            billHtml.append("<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"4\" style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #475569;\">")
                    .append("<tr><td align=\"left\">Subtotal</td><td align=\"right\">₹").append(subTotal).append("</td></tr>");
            
            if (discountVal.compareTo(java.math.BigDecimal.ZERO) > 0) {
                billHtml.append("<tr><td align=\"left\" style=\"color: #16a34a;\">Discount</td><td align=\"right\" style=\"color: #16a34a;\">-₹").append(discountVal).append("</td></tr>");
            }
            
            billHtml.append("<tr><td align=\"left\">Shipping Fee</td><td align=\"right\">₹").append(shippingFee).append("</td></tr>")
                    .append("<tr><td align=\"left\">Platform Fee</td><td align=\"right\" style=\"color: #16a34a; font-weight: 600;\">₹0.00 (FREE)</td></tr>")
                    .append("<tr style=\"font-size: 15px; font-weight: 800; color: #0056cc;\"><td align=\"left\" style=\"padding-top: 8px;\">Grand Total Paid</td><td align=\"right\" style=\"padding-top: 8px;\">₹").append(grandTotal).append("</td></tr>")
                    .append("</table>");
            
            String customDetailsHtml = itemsHtml.toString() + billHtml.toString();

            String title = "Your Product Has Been Delivered Successfully!";
            String subtitle = "Hello, " + customerName + "! Thank you for ordering from DripDoggy. We are pleased to inform you that your package has been successfully delivered.";
            String htmlContent = buildCustomerEmail(
                    title,
                    subtitle,
                    "Order Reference",
                    orderNumber,
                    "Delivery Confirmation",
                    "DELIVERED",
                    "Status Update",
                    "Your package has been successfully dropped off at your address.",
                    customDetailsHtml,
                    "We hope you love your new products! If you have any questions or concerns, please reach out to our <a href=\"mailto:support.dripdoggy@gmail.com\" style=\"color: #0056cc; text-decoration: underline;\">Support Center</a>."
            );
            
            helper.setText(htmlContent, true);
            

            
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Your DripDoggy Order Has Been Delivered! - " + orderNumber);
            message.setText("Dear " + customerName + ",\n\n" +
                    "Your order " + orderNumber + " has been successfully delivered. Thank you for ordering!\n\n" +
                    "Total Amount Paid: ₹" + order.getTotalAmount() + "\n\n" +
                    "Best regards,\n" +
                    "The DripDoggy Team");
            mailSender.send(message);
        }
    }

    public void sendCampaignEmail(String toEmail, String subject, String body, MultipartFile image1, MultipartFile image2) {
        try {
            jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            
            String image1Html = "";
            String image2Html = "";
            
            if (image1 != null && !image1.isEmpty()) {
                image1Html = "<div style=\"margin-top: 20px; text-align: center;\">\n" +
                             "    <img src=\"cid:campaignImage1\" style=\"max-width: 100%; border-radius: 8px; border: 1px solid #e2e8f0;\" />\n" +
                             "</div>\n";
            }

            if (image2 != null && !image2.isEmpty()) {
                image2Html = "<div style=\"margin-top: 20px; text-align: center;\">\n" +
                             "    <img src=\"cid:campaignImage2\" style=\"max-width: 100%; border-radius: 8px; border: 1px solid #e2e8f0;\" />\n" +
                             "</div>\n";
            }

            String htmlContent = body + image1Html + image2Html;
            
            helper.setText(htmlContent, true);
            


            if (image1 != null && !image1.isEmpty()) {
                helper.addInline("campaignImage1", image1, image1.getContentType());
            }

            if (image2 != null && !image2.isEmpty()) {
                helper.addInline("campaignImage2", image2, image2.getContentType());
            }
            
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        }
    }

    public void sendContactSupportEmail(String contactEmail, String firstName, String lastName, String orderId, String messageContent) {
        try {
            jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo("support.dripdoggy@gmail.com");
            helper.setSubject("New Customer Support Inquiry: " + firstName + " " + lastName);
            
            String htmlContent = "<h3>New Support Inquiry Received</h3>" +
                    "<table border='0' cellpadding='6' cellspacing='0' style='font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;font-size:14px;color:#1e293b;'>" +
                    "<tr><td><b>First Name:</b></td><td>" + firstName + "</td></tr>" +
                    "<tr><td><b>Last Name:</b></td><td>" + lastName + "</td></tr>" +
                    "<tr><td><b>Email:</b></td><td>" + contactEmail + "</td></tr>" +
                    "<tr><td><b>Order ID:</b></td><td>" + (orderId != null ? orderId : "N/A") + "</td></tr>" +
                    "<tr><td valign='top'><b>Message:</b></td><td>" + messageContent + "</td></tr>" +
                    "</table>" +
                    "<p style='color:#64748b;font-size:12px;margin-top:20px;'>Submitted via DripDoggy Contact Support Form.</p>";
            
            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo("support.dripdoggy@gmail.com");
            message.setSubject("New Customer Support Inquiry: " + firstName + " " + lastName);
            message.setText("New Customer Support Inquiry Received:\n\n" +
                    "First Name: " + firstName + "\n" +
                    "Last Name: " + lastName + "\n" +
                    "Email: " + contactEmail + "\n" +
                    "Order ID: " + (orderId != null ? orderId : "N/A") + "\n\n" +
                    "Message:\n" + messageContent);
            mailSender.send(message);
        }
    }

    public void sendCustomerSupportConfirmationEmail(String customerEmail, String firstName, String lastName, String orderId, String messageContent) {
        try {
            jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(customerEmail);
            helper.setSubject("DripDoggy Support Request Received");
            
            String ticketId = "#DD-TKT-" + (System.currentTimeMillis() % 100000);
            String title = "Support Request Received";
            String subtitle = "Hello " + firstName + "! We've received your inquiry and our support team is reviewing it.";
            
            String detailsHtml = "";
            if (orderId != null && !orderId.trim().isEmpty()) {
                detailsHtml = "<div style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #475569; margin-top: 10px;\">" +
                        "<b>Associated Order ID:</b> " + orderId.trim() +
                        "</div>";
            }

            String htmlContent = buildCustomerEmail(
                    title,
                    subtitle,
                    "Support Reference",
                    ticketId,
                    "Estimated Response Time",
                    "Within 24 Hours",
                    "Your Message Summary",
                    messageContent,
                    detailsHtml,
                    "Please do not hesitate to reply to this email if you need to add any more details. We're here to help!"
            );
            
            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(customerEmail);
            message.setSubject("DripDoggy Support Request Received");
            message.setText("Dear " + firstName + ",\n\n" +
                    "We have successfully received your support inquiry.\n\n" +
                    "Associated Order ID: " + (orderId != null ? orderId : "N/A") + "\n" +
                    "Your Message: " + messageContent + "\n\n" +
                    "Our support team will respond to you within 24 hours.\n\n" +
                    "Best regards,\n" +
                    "The DripDoggy Support Team");
            mailSender.send(message);
        }
    }
}


