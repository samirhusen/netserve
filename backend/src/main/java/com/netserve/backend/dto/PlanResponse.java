package com.netserve.backend.dto;

import com.netserve.backend.entity.Plan;

import java.math.BigDecimal;

public record PlanResponse(
        Long id,
        String name,
        Integer speedMbps,
        Integer dataLimitGb,
        BigDecimal price,
        Integer validityDays,
        String description,
        Boolean active
) {
    public static PlanResponse from(Plan plan) {
        return new PlanResponse(plan.getId(), plan.getName(), plan.getSpeedMbps(),
                plan.getDataLimitGb(), plan.getPrice(), plan.getValidityDays(),
                plan.getDescription(), plan.getActive());
    }
}