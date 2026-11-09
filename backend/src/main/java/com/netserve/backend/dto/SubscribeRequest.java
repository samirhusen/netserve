package com.netserve.backend.dto;

import jakarta.validation.constraints.NotNull;

public record SubscribeRequest(
        @NotNull(message = "Plan id is required") Long planId
) {}