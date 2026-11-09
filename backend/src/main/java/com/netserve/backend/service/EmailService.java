package com.netserve.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromAddress;

    @Async
    public void sendWelcomeEmail(String to, String name) {
        send(to, "Welcome to NetServe",
                "Hi " + name + ",\n\n" +
                        "Welcome to NetServe! Your account has been created successfully.\n" +
                        "You can now browse our internet plans and subscribe to the one that fits you best.\n\n" +
                        "Thank you,\nThe NetServe Team");
    }

    @Async
    public void sendSubscriptionEmail(String to, String name, String planName,
                                      BigDecimal price, LocalDate endDate, boolean planChanged) {
        String action = planChanged ? "Your plan has been changed to" : "You have subscribed to";
        send(to, planChanged ? "Your NetServe plan was changed" : "Your NetServe subscription is active",
                "Hi " + name + ",\n\n" +
                        action + " the " + planName + " plan.\n\n" +
                        "Price: $" + price + "\n" +
                        "Valid until: " + endDate + "\n\n" +
                        "A bill has been generated for this plan. You can pay it from your dashboard.\n\n" +
                        "Thank you,\nThe NetServe Team");
    }

    @Async
    public void sendPaymentEmail(String to, String name, Long billId, BigDecimal amount, String planName) {
        send(to, "Payment received for bill #" + billId,
                "Hi " + name + ",\n\n" +
                        "We have received your payment of $" + amount + " for the " + planName + " plan.\n" +
                        "Bill number: #" + billId + "\n\n" +
                        "Thank you for choosing NetServe!\nThe NetServe Team");
    }

    @Async
    public void sendTicketUpdateEmail(String to, String name, Long ticketId,
                                      String subject, String status, String remark) {
        String remarkLine = (remark != null && !remark.isBlank()) ? "Remark from support: " + remark + "\n" : "";
        send(to, "Update on your support ticket #" + ticketId,
                "Hi " + name + ",\n\n" +
                        "Your support ticket \"" + subject + "\" has been updated.\n\n" +
                        "New status: " + status.replace('_', ' ') + "\n" +
                        remarkLine + "\n" +
                        "You can track your ticket from your dashboard.\n\n" +
                        "Thank you,\nThe NetServe Team");
    }

    private void send(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Email sent to {} with subject '{}'", to, subject);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}