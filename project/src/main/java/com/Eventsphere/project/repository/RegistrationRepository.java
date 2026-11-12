package com.Eventsphere.project.repository;

import com.Eventsphere.project.entity.Registration;
import com.Eventsphere.project.entity.User;
import com.Eventsphere.project.entity.Event;
import com.Eventsphere.project.enums.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    List<Registration> findByUserAndStatus(
    User user,
    RegistrationStatus status
);
    List<Registration> findByUser(User user);

    List<Registration> findByUserOrderByRegisteredAtDesc(User user);

    List<Registration> findByEvent(Event event);

    List<Registration> findByEventOrderByRegisteredAtDesc(Event event);

    List<Registration> findAllByOrderByRegisteredAtDesc();

    boolean existsByUserAndEventAndStatus(
        User user,
        Event event,
        RegistrationStatus status
    );

    Optional<Registration> findByTicketId(String ticketId);

    long countByStatus(RegistrationStatus status);
}
