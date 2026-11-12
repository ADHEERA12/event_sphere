
package com.Eventsphere.project.service;

import com.Eventsphere.project.entity.Event;
import com.Eventsphere.project.entity.User;
import com.Eventsphere.project.service.RecommendationService;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "http://localhost:5173")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(
            RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping
    public List<Event> getRecommendations(
            @AuthenticationPrincipal User user) {

        return recommendationService.getRecommendations(user);
    }
}
