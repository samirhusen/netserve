package com.netserve.backend.service;

import com.netserve.backend.dto.BillResponse;
import com.netserve.backend.entity.*;
import com.netserve.backend.exception.BadRequestException;
import com.netserve.backend.exception.ResourceNotFoundException;
import com.netserve.backend.repository.BillRepository;
import com.netserve.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
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
 * Unit tests for BillService, focused on paying bills safely.
 */
@ExtendWith(MockitoExtension.class)
class BillServiceTest {

    private static final String EMAIL = "customer@test.com";

    @Mock private BillRepository billRepository;
    @Mock private UserRepository userRepository;
    @Mock private EmailService emailService;

    @InjectMocks private BillService billService;

    private User customer;
    private Bill pendingBill;

    @BeforeEach
    void setUp() {
        customer = User.builder()
                .id(1L).fullName("Test Customer").email(EMAIL).password("hashed").role(Role.CUSTOMER)
                .build();
        Plan basic = Plan.builder()
                .id(1L).name("Basic").speedMbps(50).price(new BigDecimal("29.99")).validityDays(30).active(true)
                .build();
        Subscription subscription = Subscription.builder()
                .id(5L).user(customer).plan(basic).status(SubscriptionStatus.ACTIVE)
                .startDate(LocalDate.now()).endDate(LocalDate.now().plusDays(30))
                .build();
        pendingBill = Bill.builder()
                .id(100L).user(customer).subscription(subscription)
                .amount(new BigDecimal("29.99")).issueDate(LocalDate.now()).dueDate(LocalDate.now().plusDays(7))
                .status(BillStatus.PENDING)
                .build();
    }

    @Test
    @DisplayName("Paying a pending bill marks it paid, records the time, and sends a receipt")
    void payBill_marksBillPaid() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(customer));
        when(billRepository.findById(100L)).thenReturn(Optional.of(pendingBill));
        when(billRepository.save(any(Bill.class))).thenAnswer(inv -> inv.getArgument(0));

        BillResponse response = billService.payBill(EMAIL, 100L);

        assertThat(response.status()).isEqualTo("PAID");
        assertThat(response.paidAt()).isNotNull();
        assertThat(pendingBill.getStatus()).isEqualTo(BillStatus.PAID);

        verify(emailService).sendPaymentEmail(eq(EMAIL), eq("Test Customer"), eq(100L),
                any(BigDecimal.class), eq("Basic"));
    }

    @Test
    @DisplayName("Paying a bill that is already paid is rejected")
    void payBill_alreadyPaid_throws() {
        pendingBill.setStatus(BillStatus.PAID);
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(customer));
        when(billRepository.findById(100L)).thenReturn(Optional.of(pendingBill));

        assertThatThrownBy(() -> billService.payBill(EMAIL, 100L))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("already paid");

        verify(billRepository, never()).save(any());
        verifyNoInteractions(emailService);
    }

    @Test
    @DisplayName("A customer cannot pay another customer's bill")
    void payBill_belongingToAnotherCustomer_throws() {
        User otherCustomer = User.builder()
                .id(2L).fullName("Other Customer").email("other@test.com").password("hashed").role(Role.CUSTOMER)
                .build();
        when(userRepository.findByEmail("other@test.com")).thenReturn(Optional.of(otherCustomer));
        when(billRepository.findById(100L)).thenReturn(Optional.of(pendingBill));

        assertThatThrownBy(() -> billService.payBill("other@test.com", 100L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Bill not found");

        assertThat(pendingBill.getStatus()).isEqualTo(BillStatus.PENDING);
        verify(billRepository, never()).save(any());
        verifyNoInteractions(emailService);
    }
}
