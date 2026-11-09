package com.netserve.backend.controller;

import com.netserve.backend.dto.UpdateProfileRequest;
import com.netserve.backend.dto.UserResponse;
import com.netserve.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe(Authentication auth) {
        return ResponseEntity.ok(userService.getCurrentUser(auth.getName()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateMe(Authentication auth,
                                                 @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(auth.getName(), request));
    }
}