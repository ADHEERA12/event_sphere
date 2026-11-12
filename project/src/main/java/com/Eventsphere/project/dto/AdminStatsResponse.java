package com.Eventsphere.project.dto;

public class AdminStatsResponse {

    private long totalUsers;
    private long totalEvents;
    private long totalRegistrations;
    private long upcomingEvents;

    public AdminStatsResponse() {}

    public AdminStatsResponse(long totalUsers, long totalEvents, long totalRegistrations, long upcomingEvents) {
        this.totalUsers = totalUsers;
        this.totalEvents = totalEvents;
        this.totalRegistrations = totalRegistrations;
        this.upcomingEvents = upcomingEvents;
    }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalEvents() { return totalEvents; }
    public void setTotalEvents(long totalEvents) { this.totalEvents = totalEvents; }

    public long getTotalRegistrations() { return totalRegistrations; }
    public void setTotalRegistrations(long totalRegistrations) { this.totalRegistrations = totalRegistrations; }

    public long getUpcomingEvents() { return upcomingEvents; }
    public void setUpcomingEvents(long upcomingEvents) { this.upcomingEvents = upcomingEvents; }
}

