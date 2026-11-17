package com.netserve.backend.service;

import com.netserve.backend.dto.SubscriptionResponse;
import com.netserve.backend.entity.*;
import com.netserve.backend.exception.BadRequestException;
import com.netserve.backend.repository.BillRepository;
import com.netserve.backend.repository.SubscriptionRepository;
import com.netserve.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * Unit tests for SubscriptionService.
 * Repositories and services it depends on are mocked, so no database is needed.
 */
@ExtendWith(MockitoExtension.class)
class SubscriptionServiceTest {

    private static final String EMAIL = "customer@test.com";

    @Mock private SubscriptionRepository subscriptionRepository;
    @Mock private BillRepository billRepository;
    @Mock private UserRepository userRepository;
    @Mock private PlanService planService;
    @Mock private EmailService emailService;

    @InjectMocks private SubscriptionService subscriptionService;

    private User customer;
    private Plan basic;
    private Plan standard;

    @BeforeEach
    void setUp() {
        customer = User.builder()
                .id(1L).fullName("Test Customer").email(EMAIL).password("hashed").role(Role.CUSTOMER)
                .build();
        basic = Plan.builder()
                .id(1L).name("Basic").speedMbps(50).dataLimitGb(500)
                .price(new BigDecimal("29.99")).validityDays(30).active(true)
                .build();
        standard = Plan.builder()
                .id(2L).name("Standard").speedMbps(200)
                .price(new BigDecimal("49.99")).validityDays(30).active(true)
                .build();
    }

    @Test
    @DisplayName("Subscribing creates an active subscription, a pending bill, and sends an email")
    void subscribe_createsSubscriptionAndPendingBill() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(customer));
        when(subscriptionRepository.findByUserIdAndStatus(1L, SubscriptionStatus.ACTIVE)).thenReturn(Optional.empty());
        when(planService.findPlan(1L)).thenReturn(basic);
        when(subscriptionRepository.save(any(Subscription.class))).thenAnswer(inv -> inv.getArgument(0));

        SubscriptionResponse response = subscriptionService.subscribe(EMAIL, 1L);

        assertThat(response.planName()).isEqualTo("Basic");
        assertThat(response.status()).isEqualTo("ACTIVE");
        assertThat(response.endDate()).isEqualTo(LocalDate.now().plusDays(30));

        ArgumentCaptor<Bill> billCaptor = ArgumentCaptor.forClass(Bill.class);
        verify(billRepository).save(billCaptor.capture());
        Bill bill = billCaptor.getValue();
        assertThat(bill.getAmount()).isEqualByComparingTo("29.99");
        assertThat(bill.getStatus()).isEqualTo(BillStatus.PENDING);
        assertThat(bill.getDueDate()).isEqualTo(LocalDate.now().plusDays(7));

        verify(emailService).sendSubscriptionEmail(eq(EMAIL), eq("Test Customer"), eq("Basic"),
                any(BigDecimal.class), any(LocalDate.class), eq(false));
    }

    @Test
    @DisplayName("Subscribing twice is rejected")
    void subscribe_whenAlreadySubscribed_throws() {
        Subscription existing = Subscription.builder()
                .id(10L).user(customer).plan(basic).status(SubscriptionStatus.ACTIVE).build();
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(customer));
        when(subscriptionRepository.findByUserIdAndStatus(1L, SubscriptionStatus.ACTIVE)).thenReturn(Optional.of(existing));

        assertThatThrownBy(() -> subscriptionService.subscribe(EMAIL, 2L))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("already have an active subscription");

        verify(subscriptionRepository, never()).save(any());
        verify(billRepository, never()).save(any());
        verifyNoInteractions(emailService);
    }

    @Test
    @DisplayName("Subscribing to a deactivated plan is rejected")
    void subscribe_toInactivePlan_throws() {
        basic.setActive(false);
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(customer));
        when(subscriptionRepository.findByUserIdAndStatus(1L, SubscriptionStatus.ACTIVE)).thenReturn(Optional.empty());
        when(planService.findPlan(1L)).thenReturn(basic);

        assertThatThrownBy(() -> subscriptionService.subscribe(EMAIL, 1L))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("not available");

        verify(subscriptionRepository, never()).save(any());
    }

    @Test
    @DisplayName("Changing to the plan you already have is rejected")
    void changePlan_toSamePlan_throws() {
        Subscription current = Subscription.builder()
                .id(10L).user(customer).plan(basic).status(SubscriptionStatus.ACTIVE).build();
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(customer));
        when(subscriptionRepository.findByUserIdAndStatus(1L, SubscriptionStatus.ACTIVE)).thenReturn(Optional.of(current));

        assertThatThrownBy(() -> subscriptionService.changePlan(EMAIL, 1L))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("already on this plan");

        verify(subscriptionRepository, never()).save(any());
    }

    @Test
    @DisplayName("Changing plan cancels the old subscription and creates a new one with a new bill")
    void changePlan_cancelsOldAndCreatesNew() {
        Subscription current = Subscription.builder()
                .id(10L).user(customer).plan(basic).status(SubscriptionStatus.ACTIVE)
                .startDate(LocalDate.now().minusDays(5)).endDate(LocalDate.now().plusDays(25))
                .build();
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(customer));
        when(subscriptionRepository.findByUserIdAndStatus(1L, SubscriptionStatus.ACTIVE)).thenReturn(Optional.of(current));
        when(planService.findPlan(2L)).thenReturn(standard);
        when(subscriptionRepository.save(any(Subscription.class))).thenAnswer(inv -> inv.getArgument(0));

        SubscriptionResponse response = subscriptionService.changePlan(EMAIL, 2L);

        // Old subscription is cancelled today
        assertThat(current.getStatus()).isEqualTo(SubscriptionStatus.CANCELLED);
        assertThat(current.getEndDate()).isEqualTo(LocalDate.now());

        // New subscription is on the new plan
        assertThat(response.planName()).isEqualTo("Standard");
        assertThat(response.status()).isEqualTo("ACTIVE");
        verify(subscriptionRepository, times(2)).save(any(Subscription.class));

        // A new bill is generated for the new plan's price
        ArgumentCaptor<Bill> billCaptor = ArgumentCaptor.forClass(Bill.class);
        verify(billRepository).save(billCaptor.capture());
        assertThat(billCaptor.getValue().getAmount()).isEqualByComparingTo("49.99");

        verify(emailService).sendSubscriptionEmail(eq(EMAIL), eq("Test Customer"), eq("Standard"),
                any(BigDecimal.class), any(LocalDate.class), eq(true));
    }
}
