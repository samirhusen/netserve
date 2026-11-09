package com.netserve.backend.service;

import com.netserve.backend.dto.DashboardResponse;
import com.netserve.backend.dto.MonthlyRevenue;
import com.netserve.backend.dto.PlanCount;
import com.netserve.backend.entity.*;
import com.netserve.backend.repository.BillRepository;
import com.netserve.backend.repository.SubscriptionRepository;
import com.netserve.backend.repository.TicketRepository;
import com.netserve.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final BillRepository billRepository;
    private final TicketRepository ticketRepository;

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard() {
        long totalCustomers = userRepository.countByRole(Role.CUSTOMER);
        long activeSubscriptions = subscriptionRepository.countByStatus(SubscriptionStatus.ACTIVE);
        long openTickets = ticketRepository.countByStatusIn(List.of(TicketStatus.OPEN, TicketStatus.IN_PROGRESS));

        List<Bill> paidBills = billRepository.findByStatus(BillStatus.PAID);
        BigDecimal totalRevenue = paidBills.stream()
                .map(Bill::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<PlanCount> subscribersPerPlan = subscriptionRepository.countByPlan(SubscriptionStatus.ACTIVE);

        return new DashboardResponse(totalCustomers, activeSubscriptions, openTickets,
                totalRevenue, subscribersPerPlan, buildMonthlyRevenue(paidBills));
    }

    // Revenue for the last 6 months, including months with zero revenue
    private List<MonthlyRevenue> buildMonthlyRevenue(List<Bill> paidBills) {
        Map<YearMonth, BigDecimal> totals = new HashMap<>();
        for (Bill bill : paidBills) {
            if (bill.getPaidAt() != null) {
                totals.merge(YearMonth.from(bill.getPaidAt()), bill.getAmount(), BigDecimal::add);
            }
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy", Locale.ENGLISH);
        YearMonth current = YearMonth.now();
        List<MonthlyRevenue> result = new ArrayList<>();

        for (int i = 5; i >= 0; i--) {
            YearMonth month = current.minusMonths(i);
            result.add(new MonthlyRevenue(month.format(formatter), totals.getOrDefault(month, BigDecimal.ZERO)));
        }
        return result;
    }
}