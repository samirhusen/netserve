package com.netserve.backend.repository;

import com.netserve.backend.entity.Subscription;
import com.netserve.backend.entity.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    Optional<Subscription> findByUserIdAndStatus(Long userId, SubscriptionStatus status);
    List<Subscription> findByUserIdOrderByStartDateDesc(Long userId);
}