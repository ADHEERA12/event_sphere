package com.Eventsphere.project.controller;

import com.Eventsphere.project.dto.PaymentRequest;
import com.Eventsphere.project.dto.PaymentResponse;
import com.Eventsphere.project.entity.User;
import com.Eventsphere.project.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // Authenticated: Initialize payment order
    @PostMapping("/create-order/{registrationId}")
    public ResponseEntity<PaymentResponse> createOrder(
            @PathVariable Long registrationId,
            @AuthenticationPrincipal User currentUser
    ) {
        PaymentResponse response = paymentService.createOrder(registrationId, currentUser);
        return ResponseEntity.ok(response);
    }

    // Authenticated: Verify Razorpay payment
    @PostMapping("/verify")
    public ResponseEntity<PaymentResponse> verifyPayment(
            @RequestBody PaymentRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        PaymentResponse response = paymentService.verifyPayment(request, currentUser);
        return ResponseEntity.ok(response);
    }

    // Authenticated: Simulate/Direct test payment
    @PostMapping("/simulate/{registrationId}")
    public ResponseEntity<PaymentResponse> simulatePayment(
            @PathVariable Long registrationId,
            @AuthenticationPrincipal User currentUser
    ) {
        PaymentResponse response = paymentService.simulatePayment(registrationId, currentUser);
        return ResponseEntity.ok(response);
    }
}

