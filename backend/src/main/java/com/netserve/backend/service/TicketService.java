package com.netserve.backend.service;

import com.netserve.backend.dto.TicketRequest;
import com.netserve.backend.dto.TicketResponse;
import com.netserve.backend.dto.TicketStatusUpdateRequest;
import com.netserve.backend.entity.Ticket;
import com.netserve.backend.entity.TicketStatus;
import com.netserve.backend.entity.User;
import com.netserve.backend.exception.BadRequestException;
import com.netserve.backend.exception.ResourceNotFoundException;
import com.netserve.backend.repository.TicketRepository;
import com.netserve.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    @Transactional
    public TicketResponse createTicket(String email, TicketRequest request) {
        User user = findUser(email);

        Ticket ticket = Ticket.builder()
                .user(user)
                .subject(request.subject())
                .description(request.description())
                .category(request.category())
                .priority(request.priority())
                .status(TicketStatus.OPEN)
                .build();

        return TicketResponse.from(ticketRepository.saveAndFlush(ticket));
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> getMyTickets(String email) {
        User user = findUser(email);
        return ticketRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(TicketResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public TicketResponse getMyTicket(String email, Long id) {
        User user = findUser(email);
        return ticketRepository.findById(id)
                .filter(t -> t.getUser().getId().equals(user.getId()))
                .map(TicketResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(TicketResponse::from).toList();
    }

    @Transactional
    public TicketResponse updateStatus(Long id, TicketStatusUpdateRequest request) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));

        if (ticket.getStatus() == TicketStatus.CLOSED) {
            throw new BadRequestException("Closed tickets cannot be updated");
        }

        ticket.setStatus(request.status());
        if (request.adminRemark() != null && !request.adminRemark().isBlank()) {
            ticket.setAdminRemark(request.adminRemark());
        }

        return TicketResponse.from(ticketRepository.saveAndFlush(ticket));
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}