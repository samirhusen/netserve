package com.netserve.backend.dto;

import com.netserve.backend.entity.Ticket;

import java.time.LocalDateTime;

public record TicketResponse(
        Long id,
        String subject,
        String description,
        String category,
        String priority,
        String status,
        String adminRemark,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        String customerName,
        String customerEmail
) {
    public static TicketResponse from(Ticket t) {
        return new TicketResponse(
                t.getId(), t.getSubject(), t.getDescription(), t.getCategory(),
                t.getPriority().name(), t.getStatus().name(), t.getAdminRemark(),
                t.getCreatedAt(), t.getUpdatedAt(),
                t.getUser().getFullName(), t.getUser().getEmail());
    }
}