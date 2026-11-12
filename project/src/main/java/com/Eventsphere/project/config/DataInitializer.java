package com.Eventsphere.project.config;

import com.Eventsphere.project.entity.Event;
import com.Eventsphere.project.entity.User;
import com.Eventsphere.project.enums.Role;
import com.Eventsphere.project.repository.EventRepository;
import com.Eventsphere.project.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            EventRepository eventRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 1. Seed initial Admin account if not present
        if (!userRepository.existsByEmail("admin@eventsphere.com")) {
            User admin = new User();
            admin.setName("EventSphere Admin");
            admin.setEmail("admin@eventsphere.com");
            admin.setPassword(passwordEncoder.encode("Admin@1234"));
            admin.setRole(Role.ADMIN);
            admin.setActive(true);
            admin.setPhone("9876543210");
            admin.setCollege("EventSphere HQ");
            admin.setDepartment("Platform Operations");
            userRepository.save(admin);
            System.out.println(">>> Seeded default admin account: admin@eventsphere.com / Admin@1234");
        }

        // 2. Seed initial demo events if event table is empty
        if (eventRepository.count() == 0) {
            createEvent(
                    "Tech Innovation Summit 2026",
                    "A gathering of forward-thinking tech leaders, founders, and engineers discussing AI, Web3, and cloud architecture.",
                    "Technology",
                    "Coimbatore",
                    "Codissia Trade Fair Complex",
                    LocalDateTime.now().plusDays(3),
                    LocalDateTime.now().plusDays(2),
                    250,
                    0.0,
                    "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
                    true
            );

            createEvent(
                    "Creative Design Workshop",
                    "Hands-on UI/UX design masterclass covering design systems, micro-interactions, and Figma to code pipelines.",
                    "Arts & Design",
                    "Chennai",
                    "IIT Madras Research Park",
                    LocalDateTime.now().plusDays(8),
                    LocalDateTime.now().plusDays(7),
                    80,
                    299.0,
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
                    true
            );

            createEvent(
                    "Startup Networking Meet",
                    "Pitch your startup, meet active angel investors, and connect with potential co-founders and early hires.",
                    "Business",
                    "Bangalore",
                    "Koramangala Social",
                    LocalDateTime.now().plusDays(13),
                    LocalDateTime.now().plusDays(11),
                    120,
                    499.0,
                    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
                    true
            );

            createEvent(
                    "AI and Machine Learning Workshop",
                    "Deep dive into transformer models, fine-tuning LLMs, and deploying AI solutions at production scale.",
                    "Technology",
                    "Coimbatore",
                    "PSG Tech Auditorium",
                    LocalDateTime.now().plusDays(23),
                    LocalDateTime.now().plusDays(20),
                    150,
                    0.0,
                    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
                    true
            );

            createEvent(
                    "Live Music Festival",
                    "An open-air evening celebrating indie artists, live fusion bands, and acoustic performances.",
                    "Music",
                    "Chennai",
                    "Besant Nagar Beach Grounds",
                    LocalDateTime.now().plusDays(30),
                    LocalDateTime.now().plusDays(28),
                    300,
                    599.0,
                    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea",
                    true
            );

            createEvent(
                    "Sports Championship 2026",
                    "Inter-college and open athletic tournament featuring badminton, football, and track events.",
                    "Sports",
                    "Bangalore",
                    "Kanteerava Stadium",
                    LocalDateTime.now().plusDays(36),
                    LocalDateTime.now().plusDays(34),
                    200,
                    199.0,
                    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211",
                    true
            );

            System.out.println(">>> Seeded 6 default published events for EventSphere platform");
        }
    }

    private void createEvent(
            String title,
            String desc,
            String category,
            String location,
            String venue,
            LocalDateTime eventDate,
            LocalDateTime deadline,
            int seats,
            double price,
            String imageUrl,
            boolean published
    ) {
        Event event = new Event();
        event.setTitle(title);
        event.setDescription(desc);
        event.setCategory(category);
        event.setLocation(location);
        event.setVenue(venue);
        event.setEventDate(eventDate);
        event.setRegistrationDeadline(deadline);
        event.setCapacity(seats);
        event.setAvailableSeats(seats);
        event.setPrice(price);
        event.setImageUrl(imageUrl);
        event.setPublished(published);
        eventRepository.save(event);
    }
}

