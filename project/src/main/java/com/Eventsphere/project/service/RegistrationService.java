package com.Eventsphere.project.service;

import com.Eventsphere.project.dto.RegistrationRequest;
import com.Eventsphere.project.dto.RegistrationResponse;
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

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final PaymentRepository paymentRepository;

    public RegistrationService(
            RegistrationRepository registrationRepository,
            EventRepository eventRepository,
            PaymentRepository paymentRepository
    ) {
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
        this.paymentRepository = paymentRepository;
    }

    @Transactional
    public RegistrationResponse registerForEvent(RegistrationRequest request, User currentUser) {

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));

        if (!event.isPublished()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Event is not open for registration");
        }

        if (event.getRegistrationDeadline() != null && event.getRegistrationDeadline().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Registration deadline has passed");
        }

        if (registrationRepository.existsByUserAndEventAndStatus(currentUser, event, RegistrationStatus.CONFIRMED)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You are already registered for this event");
        }

        if (event.getAvailableSeats() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No seats available for this event");
        }

        Registration registration = new Registration();
        registration.setUser(currentUser);
        registration.setEvent(event);

        String randomCode = String.format("%04d", (int) (Math.random() * 9000) + 1000);
        registration.setTicketId("EVT-" + Year.now().getValue() + "-" + randomCode);

        registration.setAttendeeName(request.getFullName() != null && !request.getFullName().isBlank()
                ? request.getFullName() : currentUser.getName());
        registration.setAttendeeEmail(request.getEmail() != null && !request.getEmail().isBlank()
                ? request.getEmail() : currentUser.getEmail());
        registration.setAttendeePhone(request.getPhone() != null && !request.getPhone().isBlank()
                ? request.getPhone() : currentUser.getPhone());
        registration.setAttendeeCollege(request.getCollege() != null && !request.getCollege().isBlank()
                ? request.getCollege() : currentUser.getCollege());

        boolean isFree = event.getPrice() <= 0;

        if (isFree) {
            registration.setStatus(RegistrationStatus.CONFIRMED);
            event.setAvailableSeats(event.getAvailableSeats() - 1);
            eventRepository.save(event);
        } else {
            registration.setStatus(RegistrationStatus.PENDING);
        }

        registration = registrationRepository.save(registration);

        // Create initial payment record
        Payment payment = new Payment();
        payment.setRegistration(registration);
        payment.setAmount(event.getPrice());
        payment.setStatus(isFree ? PaymentStatus.SUCCESS : PaymentStatus.PENDING);
        paymentRepository.save(payment);

        return mapToResponse(registration);
    }

    public List<RegistrationResponse> getMyRegistrations(User currentUser) {
        return registrationRepository.findByUserOrderByRegisteredAtDesc(currentUser)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<RegistrationResponse> getAllRegistrationsForAdmin() {
        return registrationRepository.findAllByOrderByRegisteredAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<RegistrationResponse> getRegistrationsByEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));

        return registrationRepository.findByEventOrderByRegisteredAtDesc(event)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public RegistrationResponse cancelRegistration(Long id, User currentUser, boolean isAdmin) {

        Registration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registration not found"));

        if (!isAdmin && !registration.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to cancel this registration");
        }

        if (registration.getStatus() == RegistrationStatus.CONFIRMED) {
            Event event = registration.getEvent();
            if (event != null) {
                event.setAvailableSeats(event.getAvailableSeats() + 1);
                eventRepository.save(event);
            }
        }

        registration.setStatus(RegistrationStatus.CANCELLED);
        registration = registrationRepository.save(registration);

        return mapToResponse(registration);
    }

    public RegistrationResponse mapToResponse(Registration reg) {
        RegistrationResponse resp = new RegistrationResponse();
        resp.setId(reg.getId());
        resp.setTicketId(reg.getTicketId());
        resp.setStatus(reg.getStatus());
        resp.setRegisteredAt(reg.getRegisteredAt());

        resp.setAttendeeName(reg.getAttendeeName());
        resp.setAttendeeEmail(reg.getAttendeeEmail());
        resp.setAttendeePhone(reg.getAttendeePhone());
        resp.setAttendeeCollege(reg.getAttendeeCollege());

        if (reg.getUser() != null) {
            resp.setUserId(reg.getUser().getId());
            resp.setUserName(reg.getUser().getName());
            resp.setUserEmail(reg.getUser().getEmail());
        }

        if (reg.getEvent() != null) {
            resp.setEventId(reg.getEvent().getId());
            resp.setEventTitle(reg.getEvent().getTitle());
            resp.setEventCategory(reg.getEvent().getCategory());
            resp.setEventLocation(reg.getEvent().getLocation());
            resp.setEventVenue(reg.getEvent().getVenue());
            resp.setEventDate(reg.getEvent().getEventDate());
            resp.setEventPrice(reg.getEvent().getPrice());
        }

        paymentRepository.findByRegistration(reg).ifPresentOrElse(
                p -> resp.setPaymentStatus(p.getStatus()),
                () -> resp.setPaymentStatus(
                        reg.getEvent() != null && reg.getEvent().getPrice() <= 0
                                ? PaymentStatus.SUCCESS
                                : PaymentStatus.PENDING
                )
        );

        return resp;
    }
}

