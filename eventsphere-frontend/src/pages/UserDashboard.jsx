import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./UserDashboard.css";

function UserDashboard() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/registrations/my-registrations")
      .then((res) => {
        setRegistrations(res.data);
      })
      .catch((err) => {
        console.error("Failed to load dashboard data", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const upcomingEvents = registrations.filter(
    (reg) => reg.status === "CONFIRMED"
  );

  const completedEvents = registrations.filter(
    (reg) => reg.status === "COMPLETED" || reg.status === "CANCELLED"
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "TBA";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="dashboard-page">
      {/* Welcome Section */}
      <section className="dashboard-welcome">
        <div>
          <span>USER DASHBOARD</span>
          <h1>Welcome back, {user?.name || "Explorer"}!</h1>
          <p>Manage your registrations and discover new experiences.</p>
        </div>

        <Link to="/events" className="explore-btn">
          + Explore Events
        </Link>
      </section>

      {/* Statistics */}
      <section className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">🎟️</div>
          <div>
            <h2>{registrations.length}</h2>
            <p>Total Registrations</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div>
            <h2>{upcomingEvents.length}</h2>
            <p>Confirmed Events</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div>
            <h2>{completedEvents.length}</h2>
            <p>Past / Cancelled</p>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <span>YOUR ACTIVITIES</span>
            <h2>Registered Events</h2>
          </div>

          <Link to="/my-registrations">View All</Link>
        </div>

        <div className="dashboard-event-list">
          {loading ? (
            <p>Loading activities...</p>
          ) : upcomingEvents.length > 0 ? (
            upcomingEvents.slice(0, 3).map((event) => (
              <div className="dashboard-event-card" key={event.id}>
                <div className="dashboard-event-date">📅</div>

                <div className="dashboard-event-details">
                  <h3>{event.eventTitle}</h3>
                  <p>{formatDate(event.eventDate)}</p>
                  <p>📍 {event.eventLocation || event.eventVenue}</p>
                </div>

                <div className="dashboard-event-right">
                  <span className="confirmed-status">{event.status}</span>
                  <strong>{event.eventPrice > 0 ? `₹${event.eventPrice}` : "Free"}</strong>
                </div>
              </div>
            ))
          ) : (
            <p>No confirmed registrations found. <Link to="/events">Browse events to join!</Link></p>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="dashboard-quick-actions">
        <h2>Quick Actions</h2>

        <div className="quick-action-grid">
          <Link to="/events" className="quick-action-card">
            <span>🔍</span>
            <h3>Explore Events</h3>
            <p>Discover new events.</p>
          </Link>

          <Link to="/my-registrations" className="quick-action-card">
            <span>🎟️</span>
            <h3>My Registrations</h3>
            <p>View your event registrations.</p>
          </Link>

          <Link to="/profile" className="quick-action-card">
            <span>👤</span>
            <h3>My Profile</h3>
            <p>Manage your account details.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default UserDashboard;
