
package com.Eventsphere.project.service;

import com.Eventsphere.project.entity.Event;
import com.Eventsphere.project.entity.Registration;
import com.Eventsphere.project.entity.User;
import com.Eventsphere.project.enums.RegistrationStatus;
import com.Eventsphere.project.repository.EventRepository;
import com.Eventsphere.project.repository.RegistrationRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;

    public RecommendationService(
            EventRepository eventRepository,
            RegistrationRepository registrationRepository) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
    }

    public List<Event> getRecommendations(User user) {

        LocalDateTime now = LocalDateTime.now();

        // 1. Get the user's confirmed registrations
        List<Registration> registrations =
                registrationRepository.findByUserAndStatus(
                        user, RegistrationStatus.CONFIRMED
                );

        // 2. Collect categories from registration history
        Map<String, Long> categoryFrequency = registrations.stream()
                .map(r -> r.getEvent().getCategory())
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(category -> !category.isEmpty())
                .collect(Collectors.groupingBy(
                        String::toLowerCase,
                        Collectors.counting()
                ));

        // 3. Exclude events already registered for
        Set<Long> registeredEventIds = registrations.stream()
                .map(r -> r.getEvent().getId())
                .collect(Collectors.toSet());

        // 4. Get upcoming published events
        List<Event> upcomingEvents =
                eventRepository.findByPublishedTrueAndEventDateAfterOrderByEventDateAsc(now);

        List<Event> availableEvents = upcomingEvents.stream()
                .filter(event -> !registeredEventIds.contains(event.getId()))
                .filter(event -> event.getAvailableSeats() > 0)
                .toList();

        // 5. If the user has no history, recommend upcoming events
        if (categoryFrequency.isEmpty()) {
            return availableEvents.stream()
                    .limit(6)
                    .toList();
        }

        // 6. Score events based on category preferences
        return availableEvents.stream()
                .sorted(
                    Comparator
                        .comparingLong((Event event) ->
                            categoryFrequency.getOrDefault(
                                event.getCategory() == null
                                    ? ""
                                    : event.getCategory().trim().toLowerCase(),
                                0L
                            )
                        )
                        .reversed()
                        .thenComparing(Event::getEventDate)
                )
                .limit(6)
                .toList();
    }
}
