package com.netserve.backend.service;

import com.netserve.backend.dto.SubscriptionResponse;
import com.netserve.backend.entity.*;
import com.netserve.backend.exception.BadRequestException;
import com.netserve.backend.exception.ResourceNotFoundException;
import com.netserve.backend.repository.BillRepository;
import com.netserve.backend.repository.SubscriptionRepository;
import com.netserve.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final BillRepository billRepository;
    private final UserRepository userRepository;
    private final PlanService planService;
    private final EmailService emailService;

    @Transactional
    public SubscriptionResponse subscribe(String email, Long planId) {
        User user = findUser(email);

        if (subscriptionRepository.findByUserIdAndStatus(user.getId(), SubscriptionStatus.ACTIVE).isPresent()) {
            throw new BadRequestException("You already have an active subscription. Use change plan instead.");
        }

        Plan plan = getActivePlan(planId);
        Subscription subscription = createSubscriptionWithBill(user, plan);
        emailService.sendSubscriptionEmail(user.getEmail(), user.getFullName(),
                plan.getName(), plan.getPrice(), subscription.getEndDate(), false);   // NEW
        return SubscriptionResponse.from(subscription);
    }

    @Transactional
    public SubscriptionResponse changePlan(String email, Long newPlanId) {
        User user = findUser(email);

        Subscription current = subscriptionRepository
                .findByUserIdAndStatus(user.getId(), SubscriptionStatus.ACTIVE)
                .orElseThrow(() -> new BadRequestException("You do not have an active subscription"));

        if (current.getPlan().getId().equals(newPlanId)) {
            throw new BadRequestException("You are already on this plan");
        }

        Plan newPlan = getActivePlan(newPlanId);

        current.setStatus(SubscriptionStatus.CANCELLED);
        current.setEndDate(LocalDate.now());
        subscriptionRepository.save(current);

        Subscription subscription = createSubscriptionWithBill(user, newPlan);
        emailService.sendSubscriptionEmail(user.getEmail(), user.getFullName(),
                newPlan.getName(), newPlan.getPrice(), subscription.getEndDate(), true);
        return SubscriptionResponse.from(subscription);
    }

    @Transactional(readOnly = true)
    public Optional<SubscriptionResponse> getCurrentSubscription(String email) {
        User user = findUser(email);
        return subscriptionRepository.findByUserIdAndStatus(user.getId(), SubscriptionStatus.ACTIVE)
                .map(SubscriptionResponse::from);
    }

    @Transactional(readOnly = true)
    public List<SubscriptionResponse> getMySubscriptions(String email) {
        User user = findUser(email);
        return subscriptionRepository.findByUserIdOrderByStartDateDesc(user.getId())
                .stream().map(SubscriptionResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<SubscriptionResponse> getAllSubscriptions() {
        return subscriptionRepository.findAll(Sort.by(Sort.Direction.DESC, "id"))
                .stream().map(SubscriptionResponse::from).toList();
    }

    private Subscription createSubscriptionWithBill(User user, Plan plan) {
        LocalDate today = LocalDate.now();

        Subscription subscription = subscriptionRepository.save(Subscription.builder()
                .user(user)
                .plan(plan)
                .startDate(today)
                .endDate(today.plusDays(plan.getValidityDays()))
                .status(SubscriptionStatus.ACTIVE)
                .build());

        billRepository.save(Bill.builder()
                .user(user)
                .subscription(subscription)
                .amount(plan.getPrice())
                .issueDate(today)
                .dueDate(today.plusDays(7))
                .status(BillStatus.PENDING)
                .build());

        return subscription;
    }

    private Plan getActivePlan(Long planId) {
        Plan plan = planService.findPlan(planId);
        if (!plan.getActive()) {
            throw new BadRequestException("This plan is not available");
        }
        return plan;
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}