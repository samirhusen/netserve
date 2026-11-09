package com.netserve.backend.dto;

import com.netserve.backend.entity.Subscription;

import java.math.BigDecimal;
import java.time.LocalDate;

public record SubscriptionResponse(
        Long id,
        Long planId,
        String planName,
        Integer speedMbps,
        BigDecimal price,
        LocalDate startDate,
        LocalDate endDate,
        String status,
        String customerName,
        String customerEmail
) {
    public static SubscriptionResponse from(Subscription s) {
        return new SubscriptionResponse(
                s.getId(),
                s.getPlan().getId(),
                s.getPlan().getName(),
                s.getPlan().getSpeedMbps(),
                s.getPlan().getPrice(),
                s.getStartDate(),
                s.getEndDate(),
                s.getStatus().name(),
                s.getUser().getFullName(),
                s.getUser().getEmail());
    }
}