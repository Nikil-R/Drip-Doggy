package com.dripdoggy.backend.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
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
                "                                                    dripDoggy\n" +
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
                "                            <!-- Mascot Circular Avatar with Sparkles & Party Horn -->\n" +
                "                            <div style=\"display: inline-block; position: relative; margin-bottom: 25px;\">\n" +
                "                                <div style=\"width: 100px; height: 100px; border-radius: 50%; border: 2px solid #dbebff; background-color: #ffffff; overflow: hidden; display: inline-block; padding: 5px; box-sizing: border-box;\">\n" +
                "                                    <img src=\"cid:mascotLogo\" alt=\"DripDoggy Mascot\" style=\"width: 100%; height: 100%; object-fit: contain; border-radius: 50%;\" />\n" +
                "                                </div>\n" +
                "                                <!-- Sparkles top-left -->\n" +
                "                                <div style=\"position: absolute; top: -8px; left: -8px; font-size: 20px; line-height: 1;\">✨</div>\n" +
                "                                <!-- Party horn bottom-right -->\n" +
                "                                <div style=\"position: absolute; bottom: -4px; right: -4px; font-size: 20px; line-height: 1;\">🎉</div>\n" +
                "                            </div>\n" +
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
                "                                <a href=\"#\" style=\"color: #0056cc; text-decoration: none; margin: 0 8px;\">Support Center</a>\n" +
                "                                <a href=\"#\" style=\"color: #0056cc; text-decoration: none; margin: 0 8px;\">Privacy Policy</a>\n" +
                "                                <a href=\"#\" style=\"color: #0056cc; text-decoration: none; margin: 0 8px;\">Unsubscribe</a>\n" +
                "                            </div>\n" +
                "                            <div style=\"font-weight: 600; color: #475569; margin-bottom: 5px;\">\n" +
                "                                Best regards,<br/>\n" +
                "                                <span style=\"color: #1e293b;\">The DripDoggy Team</span>\n" +
                "                            </div>\n" +
                "                            <div style=\"color: #94a3b8; font-size: 10px; margin-top: 15px;\">\n" +
                "                                &copy; 2026 dripDoggy Security Team. All rights reserved.\n" +
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
            
            try {
                helper.addInline("mascotLogo", new ClassPathResource("new_logo_icon.png"));
            } catch (Exception imgEx) {
                System.err.println("Could not add inline image logo to email: " + imgEx.getMessage());
            }
            
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
            
            try {
                helper.addInline("mascotLogo", new ClassPathResource("new_logo_icon.png"));
            } catch (Exception imgEx) {
                System.err.println("Could not add inline image logo to email: " + imgEx.getMessage());
            }
            
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
                    "<td style=\"padding: 6px 0; font-weight: 600; color: #1e293b;\">Price</td>" +
                    "<td align=\"right\" style=\"padding: 6px 0; color: #475569;\">₹" + price + "</td>" +
                    "</tr>" +
                    "<tr style=\"border-bottom: 1px solid #f1f5f9;\">" +
                    "<td style=\"padding: 6px 0; font-weight: 600; color: #1e293b;\">Quantity</td>" +
                    "<td align=\"right\" style=\"padding: 6px 0; color: #475569;\">" + quantity + "</td>" +
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
            
            try {
                helper.addInline("mascotLogo", new ClassPathResource("new_logo_icon.png"));
            } catch (Exception imgEx) {
                System.err.println("Could not add inline image logo to email: " + imgEx.getMessage());
            }
            
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
                    "If you have any questions or concerns about this update, please reach out to our Support Center."
            );
            
            helper.setText(htmlContent, true);
            
            try {
                helper.addInline("mascotLogo", new ClassPathResource("new_logo_icon.png"));
            } catch (Exception imgEx) {
                System.err.println("Could not add inline image logo to email: " + imgEx.getMessage());
            }
            
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
            
            String title = "Return Package Update";
            String subtitle = "Hello, " + customerName + "! There is a new update regarding your return shipment.";
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
                    "We are closely monitoring your return package transit back to our warehouse."
            );
            
            helper.setText(htmlContent, true);
            
            try {
                helper.addInline("mascotLogo", new ClassPathResource("new_logo_icon.png"));
            } catch (Exception imgEx) {
                System.err.println("Could not add inline image logo to email: " + imgEx.getMessage());
            }
            
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
            
            String refundReasonText = wasExchangeFallback 
                    ? "Replacement item for exchange request was out of stock."
                    : "Return refund approved and processed.";

            String title = "Your Refund has been Processed!";
            String subtitle = "Hello, " + customerName + "! We've successfully completed your refund for Order " + orderNumber + ".";
            
            String footerNote = "Refund Proof Receipt: <a href=\"" + proofImageUrl + "\" style=\"color: #0056cc; font-weight: 600;\">Click here to view receipt</a><br/>Please allow 2-3 business days for the funds to reflect in your account.";

            String htmlContent = buildCustomerEmail(
                    title,
                    subtitle,
                    "Product",
                    productName,
                    "Refund Amount",
                    "₹" + refundAmount,
                    "Reason for Refund",
                    refundReasonText,
                    null,
                    footerNote
            );
            
            helper.setText(htmlContent, true);
            
            try {
                helper.addInline("mascotLogo", new ClassPathResource("new_logo_icon.png"));
            } catch (Exception imgEx) {
                System.err.println("Could not add inline image logo to email: " + imgEx.getMessage());
            }

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
            
            try {
                helper.addInline("mascotLogo", new ClassPathResource("new_logo_icon.png"));
            } catch (Exception imgEx) {
                System.err.println("Could not add inline image logo to email: " + imgEx.getMessage());
            }
            
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
            
            String title = "Exchange Payment Required";
            String subtitle = "Hello, " + customerName + "! Your exchange request for order " + orderNumber + " requires a net price difference payment.";
            String htmlContent = buildCustomerEmail(
                    title,
                    subtitle,
                    "Replacement Product",
                    productName + " (" + variantName + ")",
                    "Net Difference Amount",
                    "₹" + amount,
                    "Payment Method",
                    "Please scan the attached QR code or pay via UPI to: dripdoggyofficial@gmail.com",
                    null,
                    "Please pay the due amount so that we can proceed with shipping your replacement items."
            );
            
            helper.setText(htmlContent, true);
            
            try {
                helper.addInline("mascotLogo", new ClassPathResource("new_logo_icon.png"));
            } catch (Exception imgEx) {
                System.err.println("Could not add inline image logo to email: " + imgEx.getMessage());
            }

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
                    "<td style=\"padding: 6px 0; font-weight: 600; color: #1e293b;\">Price</td>" +
                    "<td align=\"right\" style=\"padding: 6px 0; color: #475569;\">₹" + price + "</td>" +
                    "</tr>" +
                    "<tr style=\"border-bottom: 1px solid #f1f5f9;\">" +
                    "<td style=\"padding: 6px 0; font-weight: 600; color: #1e293b;\">Quantity</td>" +
                    "<td align=\"right\" style=\"padding: 6px 0; color: #475569;\">" + quantity + "</td>" +
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
            
            try {
                helper.addInline("mascotLogo", new ClassPathResource("new_logo_icon.png"));
            } catch (Exception imgEx) {
                System.err.println("Could not add inline image logo to email: " + imgEx.getMessage());
            }
            
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
            
            try {
                helper.addInline("mascotLogo", new ClassPathResource("new_logo_icon.png"));
            } catch (Exception imgEx) {
                System.err.println("Could not add inline image logo to email: " + imgEx.getMessage());
            }
            
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
            
            String title = "Exchange Size Unavailable";
            String subtitle = "Hello, " + customerName + "! We went to process your exchange for the product on order " + orderNumber + " but the requested size is unavailable.";
            
            String customDetailsHtml = "<div style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #475569; line-height: 1.6;\">" +
                    "<strong>Resolution Options:</strong><br/>" +
                    "&bull; Option 1 (Refund): <a href=\"http://localhost:3000/returns/" + returnId + "/resolution?choice=REFUND\" style=\"color: #0056cc; font-weight: 600;\">Request full refund</a><br/>" +
                    "&bull; Option 2 (Keep Original): <a href=\"http://localhost:3000/returns/" + returnId + "/resolution?choice=KEEP_ORIGINAL\" style=\"color: #0056cc; font-weight: 600;\">Keep original items</a>" +
                    "</div>";
            
            String htmlContent = buildCustomerEmail(
                    title,
                    subtitle,
                    "Requested Product",
                    productName + " (Size: " + targetSize + ")",
                    "Action Required",
                    "Choose Resolution",
                    null, null,
                    customDetailsHtml,
                    "Please click one of the options above to select how you would like to proceed with this exchange."
            );
            
            helper.setText(htmlContent, true);
            
            try {
                helper.addInline("mascotLogo", new ClassPathResource("new_logo_icon.png"));
            } catch (Exception imgEx) {
                System.err.println("Could not add inline image logo to email: " + imgEx.getMessage());
            }
            
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
            
            String title = "Exchange Request Closed";
            String subtitle = "Hello, " + customerName + "! Your exchange request for order " + orderNumber + " has been closed.";
            String htmlContent = buildCustomerEmail(
                    title,
                    subtitle,
                    "Order Reference",
                    orderNumber,
                    "Ticket Status",
                    "CLOSED",
                    "Reason for Closure",
                    "You chose to keep the original products in your possession.",
                    null,
                    "Thank you for shopping with us! Let us know if you need any further assistance."
            );
            
            helper.setText(htmlContent, true);
            
            try {
                helper.addInline("mascotLogo", new ClassPathResource("new_logo_icon.png"));
            } catch (Exception imgEx) {
                System.err.println("Could not add inline image logo to email: " + imgEx.getMessage());
            }
            
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
                    "If this cancellation was done by mistake or if you need any assistance, please contact our Support Center."
            );
            
            helper.setText(htmlContent, true);
            
            try {
                helper.addInline("mascotLogo", new ClassPathResource("new_logo_icon.png"));
            } catch (Exception imgEx) {
                System.err.println("Could not add inline image logo to email: " + imgEx.getMessage());
            }
            
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
                    "We hope you love your new products! If you have any questions or concerns, please reach out to our Support Center."
            );
            
            helper.setText(htmlContent, true);
            
            try {
                helper.addInline("mascotLogo", new ClassPathResource("new_logo_icon.png"));
            } catch (Exception imgEx) {
                System.err.println("Could not add inline image logo to email: " + imgEx.getMessage());
            }
            
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
            
            try {
                helper.addInline("mascotLogo", new ClassPathResource("new_logo_icon.png"));
            } catch (Exception imgEx) {
                System.err.println("Could not add inline image logo to email: " + imgEx.getMessage());
            }

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
}
