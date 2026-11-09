package com.netserve.backend.service;

import com.netserve.backend.dto.UpdateProfileRequest;
import com.netserve.backend.dto.UserResponse;
import com.netserve.backend.entity.User;
import com.netserve.backend.exception.ResourceNotFoundException;
import com.netserve.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String email) {
        return UserResponse.from(findUser(email));
    }

    @Transactional
    public UserResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = findUser(email);
        user.setFullName(request.fullName());
        user.setPhone(request.phone());
        user.setAddress(request.address());
        return UserResponse.from(userRepository.save(user));
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}