package com.Eventsphere.project.controller;

import com.Eventsphere.project.dto.UserProfileRequest;
import com.Eventsphere.project.dto.UserProfileResponse;
import com.Eventsphere.project.entity.User;
import com.Eventsphere.project.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Authenticated: Get current user profile
    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(@AuthenticationPrincipal User currentUser) {
        UserProfileResponse profile = userService.getProfile(currentUser);
        return ResponseEntity.ok(profile);
    }

    // Authenticated: Update profile
    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @AuthenticationPrincipal User currentUser,
            @RequestBody UserProfileRequest request
    ) {
        UserProfileResponse updated = userService.updateProfile(currentUser, request);
        return ResponseEntity.ok(updated);
    }

    // Public: Forgot password
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        userService.handleForgotPassword(email);
        return ResponseEntity.ok(Map.of("message", "Password reset instructions have been sent to your email."));
    }
}

