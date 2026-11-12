package com.Eventsphere.project.controller;

import com.Eventsphere.project.dto.RegistrationRequest;
import com.Eventsphere.project.dto.RegistrationResponse;
import com.Eventsphere.project.entity.User;
import com.Eventsphere.project.enums.Role;
import com.Eventsphere.project.service.RegistrationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    // Authenticated: Register for an event
    @PostMapping("/register")
    public ResponseEntity<RegistrationResponse> register(
            @RequestBody RegistrationRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        RegistrationResponse response = registrationService.registerForEvent(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Authenticated: Get my registrations
    @GetMapping("/my-registrations")
    public ResponseEntity<List<RegistrationResponse>> getMyRegistrations(
            @AuthenticationPrincipal User currentUser
    ) {
        List<RegistrationResponse> registrations = registrationService.getMyRegistrations(currentUser);
        return ResponseEntity.ok(registrations);
    }

    // Admin: Get all registrations across platform
    @GetMapping("/all")
    public ResponseEntity<List<RegistrationResponse>> getAllRegistrations() {
        List<RegistrationResponse> registrations = registrationService.getAllRegistrationsForAdmin();
        return ResponseEntity.ok(registrations);
    }

    // Admin: Get registrations for specific event
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<RegistrationResponse>> getRegistrationsByEvent(
            @PathVariable Long eventId
    ) {
        List<RegistrationResponse> registrations = registrationService.getRegistrationsByEvent(eventId);
        return ResponseEntity.ok(registrations);
    }

    // Authenticated / Admin: Cancel registration
    @PutMapping("/{id}/cancel")
    public ResponseEntity<RegistrationResponse> cancelRegistration(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        RegistrationResponse cancelled = registrationService.cancelRegistration(id, currentUser, isAdmin);
        return ResponseEntity.ok(cancelled);
    }
}

