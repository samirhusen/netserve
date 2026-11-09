package com.netserve.backend.config;

import com.netserve.backend.entity.Plan;
import com.netserve.backend.entity.Role;
import com.netserve.backend.entity.User;
import com.netserve.backend.repository.PlanRepository;
import com.netserve.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PlanRepository planRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@netserve.com")) {
            userRepository.save(User.builder()
                    .fullName("NetServe Admin")
                    .email("admin@netserve.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build());
        }

        if (planRepository.count() == 0) {
            planRepository.saveAll(List.of(
                    Plan.builder().name("Basic").speedMbps(50).dataLimitGb(500)
                            .price(new BigDecimal("29.99")).validityDays(30)
                            .description("Good for browsing, email, and streaming on one device").build(),
                    Plan.builder().name("Standard").speedMbps(200).dataLimitGb(null)
                            .price(new BigDecimal("49.99")).validityDays(30)
                            .description("Unlimited data for families and HD streaming").build(),
                    Plan.builder().name("Premium").speedMbps(1000).dataLimitGb(null)
                            .price(new BigDecimal("79.99")).validityDays(30)
                            .description("Gigabit speed for gaming, 4K streaming, and remote work").build()
            ));
        }
    }
}