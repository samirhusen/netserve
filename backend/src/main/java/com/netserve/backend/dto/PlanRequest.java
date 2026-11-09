package com.netserve.backend.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record PlanRequest(
        @NotBlank(message = "Plan name is required") String name,
        @NotNull(message = "Speed is required") @Positive(message = "Speed must be positive") Integer speedMbps,
        @Positive(message = "Data limit must be positive") Integer dataLimitGb,
        @NotNull(message = "Price is required") @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0") BigDecimal price,
        @NotNull(message = "Validity is required") @Positive(message = "Validity must be positive") Integer validityDays,
        @Size(max = 500, message = "Description is too long") String description
) {}