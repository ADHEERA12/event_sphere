package com.Eventsphere.project.controller;

import com.Eventsphere.project.dto.AdminStatsResponse;
import com.Eventsphere.project.dto.UserProfileResponse;
import com.Eventsphere.project.entity.User;
import com.Eventsphere.project.enums.Role;
import com.Eventsphere.project.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // Admin: Get overall statistics
    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        AdminStatsResponse stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    // Admin: Get all users
    @GetMapping("/users")
    public ResponseEntity<List<UserProfileResponse>> getAllUsers() {
        List<UserProfileResponse> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // Admin: Toggle user status (Active / Inactive)
    @PutMapping("/users/{id}/toggle-status")
    public ResponseEntity<UserProfileResponse> toggleUserStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        UserProfileResponse updated = adminService.toggleUserStatus(id, currentUser);
        return ResponseEntity.ok(updated);
    }

    // Admin: Update user role (USER / ADMIN)
    @PutMapping("/users/{id}/role")
    public ResponseEntity<UserProfileResponse> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal User currentUser
    ) {
        String roleStr = payload.get("role");
        Role role = Role.valueOf(roleStr.toUpperCase());
        UserProfileResponse updated = adminService.updateUserRole(id, role, currentUser);
        return ResponseEntity.ok(updated);
    }

    // Admin: Delete user
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        adminService.deleteUser(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}

