package com.Eventsphere.project.service;

import com.Eventsphere.project.dto.UserProfileRequest;
import com.Eventsphere.project.dto.UserProfileResponse;
import com.Eventsphere.project.entity.User;
import com.Eventsphere.project.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserProfileResponse getProfile(User currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

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

    public UserProfileResponse updateProfile(User currentUser, UserProfileRequest request) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getCollege() != null) {
            user.setCollege(request.getCollege());
        }
        if (request.getDepartment() != null) {
            user.setDepartment(request.getDepartment());
        }

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

    public void handleForgotPassword(String email) {
        userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No account found with this email"));
    }
}

