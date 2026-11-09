package com.netserve.backend.controller;

import com.netserve.backend.dto.BillResponse;
import com.netserve.backend.service.BillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
@RequiredArgsConstructor
public class BillController {

    private final BillService billService;

    @GetMapping
    public ResponseEntity<List<BillResponse>> getMyBills(Authentication auth) {
        return ResponseEntity.ok(billService.getMyBills(auth.getName()));
    }

    @GetMapping("/payments")
    public ResponseEntity<List<BillResponse>> getPaymentHistory(Authentication auth) {
        return ResponseEntity.ok(billService.getPaymentHistory(auth.getName()));
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<BillResponse> payBill(Authentication auth, @PathVariable Long id) {
        return ResponseEntity.ok(billService.payBill(auth.getName(), id));
    }
}