package com.netserve.backend.dto;

import com.netserve.backend.entity.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TicketRequest(
        @NotBlank(message = "Subject is required") String subject,
        @NotBlank(message = "Description is required") @Size(max = 1000, message = "Description is too long") String description,
        @NotBlank(message = "Category is required") String category,
        @NotNull(message = "Priority is required") TicketPriority priority
) {}