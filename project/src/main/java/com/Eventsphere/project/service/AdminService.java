package com.Eventsphere.project.service;

import com.Eventsphere.project.dto.AdminStatsResponse;
import com.Eventsphere.project.dto.UserProfileResponse;
import com.Eventsphere.project.entity.User;
import com.Eventsphere.project.enums.Role;
import com.Eventsphere.project.repository.EventRepository;
import com.Eventsphere.project.repository.RegistrationRepository;
import com.Eventsphere.project.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;

    public AdminService(
            UserRepository userRepository,
            EventRepository eventRepository,
            RegistrationRepository registrationRepository
    ) {
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
    }

    public AdminStatsResponse getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalEvents = eventRepository.count();
        long totalRegistrations = registrationRepository.count();
        long upcomingEvents = eventRepository.countByEventDateAfter(LocalDateTime.now());

        return new AdminStatsResponse(totalUsers, totalEvents, totalRegistrations, upcomingEvents);
    }

    public List<UserProfileResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> new UserProfileResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getCollege(),
                        user.getDepartment(),
                        user.getRole(),
                        user.isActive(),
                        user.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public UserProfileResponse toggleUserStatus(Long userId, User currentUser) {
        if (userId.equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot modify your own active status");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        user.setActive(!user.isActive());
        user = userRepository.save(user);

        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getCollege(),
                user.getDepartment(),
                user.getRole(),
                user.isActive(),
                user.getCreatedAt()
        );
    }

    @Transactional
    public UserProfileResponse updateUserRole(Long userId, Role newRole, User currentUser) {
        if (userId.equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot change your own role");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        user.setRole(newRole);
        user = userRepository.save(user);

        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getCollege(),
                user.getDepartment(),
                user.getRole(),
                user.isActive(),
                user.getCreatedAt()
        );
    }

    @Transactional
    public void deleteUser(Long userId, User currentUser) {
        if (userId.equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot delete your own admin account");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        userRepository.delete(user);
    }
}

