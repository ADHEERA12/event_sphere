import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalRegistrations: 0,
    upcomingEvents: 0,
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/admin/stats"),
      api.get("/events/all"),
    ])
      .then(([statsRes, eventsRes]) => {
        setStats(statsRes.data);
        setRecentEvents(eventsRes.data.slice(0, 5));
      })
      .catch((err) => {
        console.error("Failed to load admin dashboard data", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const statItems = [
    { title: "Total Users", value: stats.totalUsers, icon: "👥" },
    { title: "Total Events", value: stats.totalEvents, icon: "📅" },
    { title: "Registrations", value: stats.totalRegistrations, icon: "🎟️" },
    { title: "Upcoming Events", value: stats.upcomingEvents, icon: "🚀" },
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return "TBA";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome back, Admin! Manage your events from here.</p>
        </div>

        <Link to="/admin/create-event" className="create-event-btn">
          + Create Event
        </Link>
      </div>

      {/* Statistics */}
      <div className="admin-stats">
        {statItems.map((item, index) => (
          <div className="admin-stat-card" key={index}>
            <div className="admin-stat-icon">{item.icon}</div>
            <div>
              <p>{item.title}</p>
              <h2>{item.value.toLocaleString("en-IN")}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="admin-section">
        <h2>Quick Actions</h2>

        <div className="admin-actions">
          <Link to="/admin/create-event">
            <span>➕</span>
            <h3>Create Event</h3>
            <p>Add a new event to EventSphere.</p>
          </Link>

          <Link to="/admin/manage-events">
            <span>📋</span>
            <h3>Manage Events</h3>
            <p>View and manage existing events.</p>
          </Link>

          <Link to="/admin/manage-users">
            <span>👥</span>
            <h3>Manage Users</h3>
            <p>View registered users.</p>
          </Link>

          <Link to="/admin/registrations">
            <span>🎟️</span>
            <h3>View Registrations</h3>
            <p>Monitor event registrations.</p>
          </Link>
        </div>
      </div>

      {/* Recent Events */}
      <div className="admin-section">
        <h2>Recent Events</h2>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Category</th>
                <th>Date</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>Loading recent events...</td>
                </tr>
              ) : recentEvents.length > 0 ? (
                recentEvents.map((event) => (
                  <tr key={event.id}>
                    <td><strong>{event.title}</strong></td>
                    <td>{event.category}</td>
                    <td>{formatDate(event.eventDate)}</td>
                    <td>{event.price > 0 ? `₹${event.price}` : "Free"}</td>
                    <td>
                      <span
                        className={
                          event.published
                            ? "admin-status published"
                            : "admin-status draft"
                        }
                      >
                        {event.published ? "Published" : "Draft"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>No events found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
