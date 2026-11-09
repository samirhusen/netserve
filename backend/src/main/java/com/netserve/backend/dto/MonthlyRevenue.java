package com.netserve.backend.dto;

import java.math.BigDecimal;

public record MonthlyRevenue(String month, BigDecimal revenue) {}