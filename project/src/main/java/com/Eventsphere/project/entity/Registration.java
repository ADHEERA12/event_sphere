package com.Eventsphere.project.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.Eventsphere.project.enums.RegistrationStatus;

@Entity
@Table(name = "registrations")
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    private String ticketId;

    private String attendeeName;

    private String attendeeEmail;

    private String attendeePhone;

    private String attendeeCollege;

    private LocalDateTime registeredAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private RegistrationStatus status = RegistrationStatus.CONFIRMED;

    public Registration() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }

    public String getTicketId() { return ticketId; }
    public void setTicketId(String ticketId) { this.ticketId = ticketId; }

    public String getAttendeeName() { return attendeeName; }
    public void setAttendeeName(String attendeeName) { this.attendeeName = attendeeName; }

    public String getAttendeeEmail() { return attendeeEmail; }
    public void setAttendeeEmail(String attendeeEmail) { this.attendeeEmail = attendeeEmail; }

    public String getAttendeePhone() { return attendeePhone; }
    public void setAttendeePhone(String attendeePhone) { this.attendeePhone = attendeePhone; }

    public String getAttendeeCollege() { return attendeeCollege; }
    public void setAttendeeCollege(String attendeeCollege) { this.attendeeCollege = attendeeCollege; }

    public LocalDateTime getRegisteredAt() { return registeredAt; }
    public void setRegisteredAt(LocalDateTime registeredAt) {
        this.registeredAt = registeredAt;
    }

    public RegistrationStatus getStatus() { return status; }
    public void setStatus(RegistrationStatus status) { this.status = status; }
}
