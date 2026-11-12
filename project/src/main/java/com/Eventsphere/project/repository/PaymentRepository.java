package com.Eventsphere.project.repository;

import com.Eventsphere.project.entity.Payment;
import com.Eventsphere.project.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByRegistration(Registration registration);

    Optional<Payment> findByRazorpayOrderId(String orderId);

    Optional<Payment> findByRazorpayPaymentId(String paymentId);
}
