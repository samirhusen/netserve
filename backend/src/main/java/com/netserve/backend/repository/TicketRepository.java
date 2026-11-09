package com.netserve.backend.repository;

import com.netserve.backend.entity.Ticket;
import com.netserve.backend.entity.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Ticket> findAllByOrderByCreatedAtDesc();
    long countByStatusIn(Collection<TicketStatus> statuses);
}