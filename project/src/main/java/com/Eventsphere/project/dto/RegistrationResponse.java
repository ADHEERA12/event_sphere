package com.Eventsphere.project.dto;

import com.Eventsphere.project.enums.PaymentStatus;
import com.Eventsphere.project.enums.RegistrationStatus;

import java.time.LocalDateTime;

public class RegistrationResponse {

    private Long id;
    private Long eventId;
    private String eventTitle;
    private String eventCategory;
    private String eventLocation;
    private String eventVenue;
    private LocalDateTime eventDate;
    private double eventPrice;
    private String ticketId;

    private Long userId;
    private String userName;
    private String userEmail;

    private String attendeeName;
    private String attendeeEmail;
    private String attendeePhone;
    private String attendeeCollege;

    private RegistrationStatus status;
    private PaymentStatus paymentStatus;
    private LocalDateTime registeredAt;

    public RegistrationResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }

    public String getEventTitle() { return eventTitle; }
    public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }

    public String getEventCategory() { return eventCategory; }
    public void setEventCategory(String eventCategory) { this.eventCategory = eventCategory; }

    public String getEventLocation() { return eventLocation; }
    public void setEventLocation(String eventLocation) { this.eventLocation = eventLocation; }

    public String getEventVenue() { return eventVenue; }
    public void setEventVenue(String eventVenue) { this.eventVenue = eventVenue; }

    public LocalDateTime getEventDate() { return eventDate; }
    public void setEventDate(LocalDateTime eventDate) { this.eventDate = eventDate; }

    public double getEventPrice() { return eventPrice; }
    public void setEventPrice(double eventPrice) { this.eventPrice = eventPrice; }

    public String getTicketId() { return ticketId; }
    public void setTicketId(String ticketId) { this.ticketId = ticketId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getAttendeeName() { return attendeeName; }
    public void setAttendeeName(String attendeeName) { this.attendeeName = attendeeName; }

    public String getAttendeeEmail() { return attendeeEmail; }
    public void setAttendeeEmail(String attendeeEmail) { this.attendeeEmail = attendeeEmail; }

    public String getAttendeePhone() { return attendeePhone; }
    public void setAttendeePhone(String attendeePhone) { this.attendeePhone = attendeePhone; }

    public String getAttendeeCollege() { return attendeeCollege; }
    public void setAttendeeCollege(String attendeeCollege) { this.attendeeCollege = attendeeCollege; }

    public RegistrationStatus getStatus() { return status; }
    public void setStatus(RegistrationStatus status) { this.status = status; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public LocalDateTime getRegisteredAt() { return registeredAt; }
    public void setRegisteredAt(LocalDateTime registeredAt) { this.registeredAt = registeredAt; }
}

