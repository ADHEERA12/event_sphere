package com.Eventsphere.project.service;

import com.Eventsphere.project.dto.EventRequest;
import com.Eventsphere.project.entity.Event;
import com.Eventsphere.project.repository.EventRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    // Create Event
    public Event createEvent(EventRequest request) {

        Event event = new Event();

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setCategory(request.getCategory());
        
        String loc = request.getLocation() != null && !request.getLocation().isBlank()
                ? request.getLocation() : request.getVenue();
        String ven = request.getVenue() != null && !request.getVenue().isBlank()
                ? request.getVenue() : loc;
        event.setLocation(loc);
        event.setVenue(ven);

        event.setEventDate(request.getEventDate());
        event.setRegistrationDeadline(request.getRegistrationDeadline());

        int capacity = request.getCapacity() > 0 ? request.getCapacity() : request.getAvailableSeats();
        int available = request.getAvailableSeats() > 0 ? request.getAvailableSeats() : capacity;
        event.setCapacity(capacity);
        event.setAvailableSeats(available);

        event.setPrice(request.getPrice());
        event.setImageUrl(request.getImageUrl());
        event.setPublished(request.isPublished());

        return eventRepository.save(event);
    }

    // Get All Published Events (with optional category and search query)
    public List<Event> getAllPublishedEvents(String category, String query) {
        if ((category != null && !category.isBlank() && !category.equalsIgnoreCase("All")) ||
            (query != null && !query.isBlank())) {
            return eventRepository.searchPublishedEvents(category, query);
        }
        return eventRepository.findByPublishedTrueOrderByEventDateAsc();
    }

    // Get All Events (for Admin - includes drafts and unpublished)
    public List<Event> getAllEventsForAdmin() {
        return eventRepository.findAllByOrderByCreatedAtDesc();
    }

    // Get Event By ID
    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Event not found with id: " + id
                ));
    }

    // Update Event
    public Event updateEvent(Long id, EventRequest request) {

        Event event = getEventById(id);

        if (request.getTitle() != null) event.setTitle(request.getTitle());
        if (request.getDescription() != null) event.setDescription(request.getDescription());
        if (request.getCategory() != null) event.setCategory(request.getCategory());
        if (request.getLocation() != null) event.setLocation(request.getLocation());
        if (request.getVenue() != null) event.setVenue(request.getVenue());
        if (request.getEventDate() != null) event.setEventDate(request.getEventDate());
        if (request.getRegistrationDeadline() != null) event.setRegistrationDeadline(request.getRegistrationDeadline());

        if (request.getCapacity() > 0) {
            int diff = request.getCapacity() - event.getCapacity();
            event.setCapacity(request.getCapacity());
            event.setAvailableSeats(Math.max(0, event.getAvailableSeats() + diff));
        } else if (request.getAvailableSeats() >= 0) {
            event.setAvailableSeats(request.getAvailableSeats());
        }

        event.setPrice(request.getPrice());
        if (request.getImageUrl() != null) event.setImageUrl(request.getImageUrl());
        event.setPublished(request.isPublished());

        return eventRepository.save(event);
    }

    // Delete Event
    public void deleteEvent(Long id) {
        Event event = getEventById(id);
        eventRepository.delete(event);
    }
}
