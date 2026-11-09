package com.netserve.backend.controller;

import com.netserve.backend.dto.TicketRequest;
import com.netserve.backend.dto.TicketResponse;
import com.netserve.backend.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @PostMapping
    public ResponseEntity<TicketResponse> createTicket(Authentication auth,
                                                       @Valid @RequestBody TicketRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ticketService.createTicket(auth.getName(), request));
    }

    @GetMapping
    public ResponseEntity<List<TicketResponse>> getMyTickets(Authentication auth) {
        return ResponseEntity.ok(ticketService.getMyTickets(auth.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getMyTicket(Authentication auth, @PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getMyTicket(auth.getName(), id));
    }
}