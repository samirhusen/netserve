package com.netserve.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public record DashboardResponse(
        long totalCustomers,
        long activeSubscriptions,
        long openTickets,
        BigDecimal totalRevenue,
        List<PlanCount> subscribersPerPlan,
        List<MonthlyRevenue> monthlyRevenue
) {}