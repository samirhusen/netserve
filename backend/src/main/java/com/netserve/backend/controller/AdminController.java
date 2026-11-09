package com.netserve.backend.controller;

import com.netserve.backend.dto.BillResponse;
import com.netserve.backend.dto.SubscriptionResponse;
import com.netserve.backend.service.BillService;
import com.netserve.backend.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final SubscriptionService subscriptionService;
    private final BillService billService;

    @GetMapping("/subscriptions")
    public ResponseEntity<List<SubscriptionResponse>> getAllSubscriptions() {
        return ResponseEntity.ok(subscriptionService.getAllSubscriptions());
    }

    @GetMapping("/bills")
    public ResponseEntity<List<BillResponse>> getAllBills() {
        return ResponseEntity.ok(billService.getAllBills());
    }
}