package com.Eventsphere.project.service;

import com.Eventsphere.project.dto.PaymentRequest;
import com.Eventsphere.project.dto.PaymentResponse;
import com.Eventsphere.project.entity.Event;
import com.Eventsphere.project.entity.Payment;
import com.Eventsphere.project.entity.Registration;
import com.Eventsphere.project.entity.User;
import com.Eventsphere.project.enums.PaymentStatus;
import com.Eventsphere.project.enums.RegistrationStatus;
import com.Eventsphere.project.repository.EventRepository;
import com.Eventsphere.project.repository.PaymentRepository;
import com.Eventsphere.project.repository.RegistrationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;

    public PaymentService(
            PaymentRepository paymentRepository,
            RegistrationRepository registrationRepository,
            EventRepository eventRepository
    ) {
        this.paymentRepository = paymentRepository;
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
    }

    @Transactional
    public PaymentResponse createOrder(Long registrationId, User currentUser) {

        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registration not found"));

        if (!registration.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to pay for this registration");
        }

        Event event = registration.getEvent();
        if (event == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Associated event not found");
        }

        if (event.getAvailableSeats() <= 0 && registration.getStatus() != RegistrationStatus.CONFIRMED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Seats are no longer available");
        }

        Payment payment = paymentRepository.findByRegistration(registration)
                .orElseGet(() -> {
                    Payment p = new Payment();
                    p.setRegistration(registration);
                    p.setAmount(event.getPrice());
                    return p;
                });

        String orderId = "order_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14);
        payment.setRazorpayOrderId(orderId);
        payment.setAmount(event.getPrice());
        payment.setStatus(PaymentStatus.PENDING);
        payment = paymentRepository.save(payment);

        PaymentResponse response = new PaymentResponse();
        response.setId(payment.getId());
        response.setRegistrationId(registration.getId());
        response.setRazorpayOrderId(orderId);
        response.setAmount(payment.getAmount());
        response.setStatus(payment.getStatus());
        response.setCreatedAt(payment.getCreatedAt());
        response.setMessage("Order created successfully");

        return response;
    }

    @Transactional
    public PaymentResponse verifyPayment(PaymentRequest request, User currentUser) {

        Registration registration = registrationRepository.findById(request.getRegistrationId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registration not found"));

        if (!registration.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }

        Payment payment = paymentRepository.findByRegistration(registration)
                .orElseGet(() -> {
                    Payment p = new Payment();
                    p.setRegistration(registration);
                    return p;
                });

        payment.setRazorpayOrderId(request.getRazorpayOrderId());
        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setRazorpaySignature(request.getRazorpaySignature());
        payment.setAmount(request.getAmount() > 0 ? request.getAmount() : registration.getEvent().getPrice());
        payment.setStatus(PaymentStatus.SUCCESS);
        payment = paymentRepository.save(payment);

        if (registration.getStatus() != RegistrationStatus.CONFIRMED) {
            registration.setStatus(RegistrationStatus.CONFIRMED);
            registrationRepository.save(registration);

            Event event = registration.getEvent();
            if (event != null && event.getAvailableSeats() > 0) {
                event.setAvailableSeats(event.getAvailableSeats() - 1);
                eventRepository.save(event);
            }
        }

        PaymentResponse response = new PaymentResponse();
        response.setId(payment.getId());
        response.setRegistrationId(registration.getId());
        response.setRazorpayOrderId(payment.getRazorpayOrderId());
        response.setRazorpayPaymentId(payment.getRazorpayPaymentId());
        response.setAmount(payment.getAmount());
        response.setStatus(payment.getStatus());
        response.setCreatedAt(payment.getCreatedAt());
        response.setMessage("Payment verified and registration confirmed!");

        return response;
    }

    @Transactional
    public PaymentResponse simulatePayment(Long registrationId, User currentUser) {

        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registration not found"));

        if (!registration.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }

        Payment payment = paymentRepository.findByRegistration(registration)
                .orElseGet(() -> {
                    Payment p = new Payment();
                    p.setRegistration(registration);
                    return p;
                });

        String simulatedPaymentId = "pay_demo_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
        payment.setRazorpayPaymentId(simulatedPaymentId);
        payment.setAmount(registration.getEvent().getPrice());
        payment.setStatus(PaymentStatus.SUCCESS);
        payment = paymentRepository.save(payment);

        if (registration.getStatus() != RegistrationStatus.CONFIRMED) {
            registration.setStatus(RegistrationStatus.CONFIRMED);
            registrationRepository.save(registration);

            Event event = registration.getEvent();
            if (event != null && event.getAvailableSeats() > 0) {
                event.setAvailableSeats(event.getAvailableSeats() - 1);
                eventRepository.save(event);
            }
        }

        PaymentResponse response = new PaymentResponse();
        response.setId(payment.getId());
        response.setRegistrationId(registration.getId());
        response.setRazorpayPaymentId(simulatedPaymentId);
        response.setAmount(payment.getAmount());
        response.setStatus(payment.getStatus());
        response.setCreatedAt(payment.getCreatedAt());
        response.setMessage("Payment completed successfully (Demo Mode)");

        return response;
    }
}

