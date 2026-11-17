package com.netserve.backend.service;

import com.netserve.backend.dto.TicketResponse;
import com.netserve.backend.dto.TicketStatusUpdateRequest;
import com.netserve.backend.entity.*;
import com.netserve.backend.exception.BadRequestException;
import com.netserve.backend.repository.TicketRepository;
import com.netserve.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for the admin side of TicketService.
 */
@ExtendWith(MockitoExtension.class)
class TicketServiceTest {

    @Mock private TicketRepository ticketRepository;
    @Mock private UserRepository userRepository;
    @Mock private EmailService emailService;

    @InjectMocks private TicketService ticketService;

    private Ticket ticket;

    @BeforeEach
    void setUp() {
        User customer = User.builder()
                .id(1L).fullName("Test Customer").email("customer@test.com").password("hashed").role(Role.CUSTOMER)
                .build();
        ticket = Ticket.builder()
                .id(7L).user(customer).subject("Internet down").description("No connection since morning")
                .category("Connectivity").priority(TicketPriority.HIGH).status(TicketStatus.OPEN)
                .build();
    }

    @Test
    @DisplayName("Admin can update a ticket's status and remark, and the customer is emailed")
    void updateStatus_updatesTicketAndNotifiesCustomer() {
        when(ticketRepository.findById(7L)).thenReturn(Optional.of(ticket));
        when(ticketRepository.saveAndFlush(any(Ticket.class))).thenAnswer(inv -> inv.getArgument(0));

        TicketResponse response = ticketService.updateStatus(7L,
                new TicketStatusUpdateRequest(TicketStatus.IN_PROGRESS, "Technician assigned"));

        assertThat(response.status()).isEqualTo("IN_PROGRESS");
        assertThat(response.adminRemark()).isEqualTo("Technician assigned");

        verify(emailService).sendTicketUpdateEmail("customer@test.com", "Test Customer", 7L,
                "Internet down", "IN_PROGRESS", "Technician assigned");
    }

    @Test
    @DisplayName("Closed tickets cannot be updated")
    void updateStatus_onClosedTicket_throws() {
        ticket.setStatus(TicketStatus.CLOSED);
        when(ticketRepository.findById(7L)).thenReturn(Optional.of(ticket));

        assertThatThrownBy(() -> ticketService.updateStatus(7L,
                new TicketStatusUpdateRequest(TicketStatus.OPEN, "Reopening")))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Closed tickets cannot be updated");

        verify(ticketRepository, never()).saveAndFlush(any());
        verifyNoInteractions(emailService);
    }
}
