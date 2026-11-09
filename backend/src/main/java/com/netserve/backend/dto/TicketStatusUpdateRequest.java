package com.netserve.backend.dto;

import com.netserve.backend.entity.TicketStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TicketStatusUpdateRequest(
        @NotNull(message = "Status is required") TicketStatus status,
        @Size(max = 1000, message = "Remark is too long") String adminRemark
) {}