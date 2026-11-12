package com.Eventsphere.project.controller;

import com.Eventsphere.project.dto.EventRequest;
import com.Eventsphere.project.entity.Event;
import com.Eventsphere.project.service.EventService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    // Public: Get all published events (supports optional category & search filter)
    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search
    ) {
        List<Event> events = eventService.getAllPublishedEvents(category, search);
        return ResponseEntity.ok(events);
    }

    // Admin: Get all events including drafts
    @GetMapping("/all")
    public ResponseEntity<List<Event>> getAllEventsForAdmin() {
        List<Event> events = eventService.getAllEventsForAdmin();
        return ResponseEntity.ok(events);
    }

    // Public: Get single event by ID
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        Event event = eventService.getEventById(id);
        return ResponseEntity.ok(event);
    }

    // Admin: Create new event
    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody EventRequest request) {
        Event created = eventService.createEvent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // Admin: Update event
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(
            @PathVariable Long id,
            @RequestBody EventRequest request
    ) {
        Event updated = eventService.updateEvent(id, request);
        return ResponseEntity.ok(updated);
    }

    // Admin: Delete event
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}

