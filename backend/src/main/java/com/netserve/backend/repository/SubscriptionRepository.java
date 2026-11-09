package com.netserve.backend.repository;

import com.netserve.backend.dto.PlanCount;
import com.netserve.backend.entity.Subscription;
import com.netserve.backend.entity.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    Optional<Subscription> findByUserIdAndStatus(Long userId, SubscriptionStatus status);
    List<Subscription> findByUserIdOrderByStartDateDesc(Long userId);
    long countByStatus(SubscriptionStatus status);

    @Query("select new com.netserve.backend.dto.PlanCount(s.plan.name, count(s)) " +
            "from Subscription s where s.status = :status group by s.plan.name")
    List<PlanCount> countByPlan(@Param("status") SubscriptionStatus status);
}