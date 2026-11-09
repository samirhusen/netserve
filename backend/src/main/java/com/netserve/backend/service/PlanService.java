package com.netserve.backend.service;

import com.netserve.backend.dto.PlanRequest;
import com.netserve.backend.dto.PlanResponse;
import com.netserve.backend.entity.Plan;
import com.netserve.backend.exception.ResourceNotFoundException;
import com.netserve.backend.repository.PlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlanService {

    private final PlanRepository planRepository;

    public List<PlanResponse> getActivePlans() {
        return planRepository.findByActiveTrue().stream().map(PlanResponse::from).toList();
    }

    public List<PlanResponse> getAllPlans() {
        return planRepository.findAll().stream().map(PlanResponse::from).toList();
    }

    public PlanResponse getPlan(Long id) {
        return PlanResponse.from(findPlan(id));
    }

    @Transactional
    public PlanResponse createPlan(PlanRequest request) {
        Plan plan = Plan.builder()
                .name(request.name())
                .speedMbps(request.speedMbps())
                .dataLimitGb(request.dataLimitGb())
                .price(request.price())
                .validityDays(request.validityDays())
                .description(request.description())
                .active(true)
                .build();
        return PlanResponse.from(planRepository.save(plan));
    }

    @Transactional
    public PlanResponse updatePlan(Long id, PlanRequest request) {
        Plan plan = findPlan(id);
        plan.setName(request.name());
        plan.setSpeedMbps(request.speedMbps());
        plan.setDataLimitGb(request.dataLimitGb());
        plan.setPrice(request.price());
        plan.setValidityDays(request.validityDays());
        plan.setDescription(request.description());
        return PlanResponse.from(planRepository.save(plan));
    }

    @Transactional
    public PlanResponse toggleStatus(Long id) {
        Plan plan = findPlan(id);
        plan.setActive(!plan.getActive());
        return PlanResponse.from(planRepository.save(plan));
    }

    public Plan findPlan(Long id) {
        return planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found with id " + id));
    }
}