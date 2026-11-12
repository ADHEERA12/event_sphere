package com.Eventsphere.project.repository;

import com.Eventsphere.project.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByPublishedTrueAndEventDateAfterOrderByEventDateAsc(
    LocalDateTime now
);
    List<Event> findByPublishedTrue();

    List<Event> findByPublishedTrueOrderByEventDateAsc();

    List<Event> findAllByOrderByCreatedAtDesc();

    List<Event> findByCategoryIgnoreCase(String category);

    List<Event> findByTitleContainingIgnoreCase(String title);

    long countByEventDateAfter(LocalDateTime now);

    @Query("SELECT e FROM Event e WHERE e.published = true AND " +
           "(:category IS NULL OR :category = '' OR :category = 'All' OR LOWER(e.category) = LOWER(:category)) AND " +
           "(:query IS NULL OR :query = '' OR LOWER(e.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.location) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.venue) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Event> searchPublishedEvents(
            @Param("category") String category,
            @Param("query") String query
    );
}
