package com.netserve.backend.service;

import com.netserve.backend.dto.BillResponse;
import com.netserve.backend.entity.Bill;
import com.netserve.backend.entity.BillStatus;
import com.netserve.backend.entity.User;
import com.netserve.backend.exception.BadRequestException;
import com.netserve.backend.exception.ResourceNotFoundException;
import com.netserve.backend.repository.BillRepository;
import com.netserve.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BillService {

    private final BillRepository billRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional(readOnly = true)
    public List<BillResponse> getMyBills(String email) {
        User user = findUser(email);
        return billRepository.findByUserIdOrderByIssueDateDesc(user.getId())
                .stream().map(BillResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<BillResponse> getPaymentHistory(String email) {
        User user = findUser(email);
        return billRepository.findByUserIdAndStatusOrderByPaidAtDesc(user.getId(), BillStatus.PAID)
                .stream().map(BillResponse::from).toList();
    }

    @Transactional
    public BillResponse payBill(String email, Long billId) {
        User user = findUser(email);

        Bill bill = billRepository.findById(billId)
                .filter(b -> b.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found"));

        if (bill.getStatus() == BillStatus.PAID) {
            throw new BadRequestException("This bill is already paid");
        }

        bill.setStatus(BillStatus.PAID);
        bill.setPaidAt(LocalDateTime.now());

        Bill saved = billRepository.save(bill);
        emailService.sendPaymentEmail(user.getEmail(), user.getFullName(),
                saved.getId(), saved.getAmount(), saved.getSubscription().getPlan().getName());
        return BillResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public List<BillResponse> getAllBills() {
        return billRepository.findAll(Sort.by(Sort.Direction.DESC, "id"))
                .stream().map(BillResponse::from).toList();
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}