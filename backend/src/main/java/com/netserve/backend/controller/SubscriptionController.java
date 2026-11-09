package com.netserve.backend.controller;

import com.netserve.backend.dto.SubscribeRequest;
import com.netserve.backend.dto.SubscriptionResponse;
import com.netserve.backend.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping
    public ResponseEntity<SubscriptionResponse> subscribe(Authentication auth,
                                                          @Valid @RequestBody SubscribeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(subscriptionService.subscribe(auth.getName(), request.planId()));
    }

    @PutMapping("/change")
    public ResponseEntity<SubscriptionResponse> changePlan(Authentication auth,
                                                           @Valid @RequestBody SubscribeRequest request) {
        return ResponseEntity.ok(subscriptionService.changePlan(auth.getName(), request.planId()));
    }

    @GetMapping("/current")
    public ResponseEntity<SubscriptionResponse> getCurrent(Authentication auth) {
        return subscriptionService.getCurrentSubscription(auth.getName())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @GetMapping
    public ResponseEntity<List<SubscriptionResponse>> getMySubscriptions(Authentication auth) {
        return ResponseEntity.ok(subscriptionService.getMySubscriptions(auth.getName()));
    }
}