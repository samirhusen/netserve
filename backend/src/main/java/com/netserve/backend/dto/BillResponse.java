package com.netserve.backend.dto;

import com.netserve.backend.entity.Bill;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record BillResponse(
        Long id,
        Long subscriptionId,
        String planName,
        BigDecimal amount,
        LocalDate issueDate,
        LocalDate dueDate,
        String status,
        LocalDateTime paidAt,
        String customerName
) {
    public static BillResponse from(Bill b) {
        return new BillResponse(
                b.getId(),
                b.getSubscription().getId(),
                b.getSubscription().getPlan().getName(),
                b.getAmount(),
                b.getIssueDate(),
                b.getDueDate(),
                b.getStatus().name(),
                b.getPaidAt(),
                b.getUser().getFullName());
    }
}