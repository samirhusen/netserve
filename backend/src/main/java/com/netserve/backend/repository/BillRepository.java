package com.netserve.backend.repository;

import com.netserve.backend.entity.Bill;
import com.netserve.backend.entity.BillStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByUserIdOrderByIssueDateDesc(Long userId);
    List<Bill> findByUserIdAndStatus(Long userId, BillStatus status);
    List<Bill> findByUserIdAndStatusOrderByPaidAtDesc(Long userId, BillStatus status);
    List<Bill> findByStatus(BillStatus status);
}