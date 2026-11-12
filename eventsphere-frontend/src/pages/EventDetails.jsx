import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import "./EventDetails.css";

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get(`/events/${id}`)
      .then((res) => {
        setEvent(res.data);
      })
      .catch((err) => {
        console.error("Failed to load event details", err);
        setError("Event not found or has been removed.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "TBA";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "10:00 AM";
    try {
      return new Date(dateStr).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "10:00 AM";
    }
  };

  const formatPrice = (price) => {
    if (!price || price <= 0) return "Free";
    return `₹${price}`;
  };

  if (loading) {
    return (
      <div className="event-details-page" style={{ textAlign: "center", padding: "60px" }}>
        <h2>Loading event details...</h2>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="event-not-found" style={{ textAlign: "center", padding: "60px" }}>
        <h2>{error || "Event Not Found"}</h2>
        <Link to="/events" className="back-link">Back to Events</Link>
      </div>
    );
  }

  return (
    <div className="event-details-page">
      <div className="details-container">
        <Link to="/events" className="back-link">
          ← Back to Events
        </Link>

        <img
          src={event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87"}
          alt={event.title}
          className="details-image"
        />

        <div className="details-content">
          <div className="details-main">
            <span className="details-category">
              {event.category}
            </span>

            <h1>{event.title}</h1>

            <p className="details-description">
              {event.description}
            </p>

            <div className="details-information">
              <div>
                <h3>📅 Date</h3>
                <p>{formatDate(event.eventDate)}</p>
              </div>

              <div>
                <h3>🕒 Time</h3>
                <p>{formatTime(event.eventDate)}</p>
              </div>

              <div>
                <h3>📍 Location</h3>
                <p>{event.location || event.venue}</p>
              </div>

              <div>
                <h3>🏢 Venue</h3>
                <p>{event.venue || event.location}</p>
              </div>
            </div>
          </div>

          <div className="registration-card">
            <h2>Event Registration</h2>

            <p>Ticket Price</p>
            <h1>{formatPrice(event.price)}</h1>

            <p style={{ fontSize: "14px", color: event.availableSeats > 0 ? "#2e7d32" : "#c62828", margin: "10px 0" }}>
              {event.availableSeats > 0 ? `🎟️ ${event.availableSeats} seats remaining` : "Sold Out"}
            </p>

            {event.availableSeats > 0 ? (
              <Link
                to={`/register-event/${event.id}`}
                className="register-event-btn"
              >
                Register Now
              </Link>
            ) : (
              <button disabled className="register-event-btn" style={{ opacity: 0.6, cursor: "not-allowed" }}>
                Sold Out
              </button>
            )}

            <p className="registration-note">
              Secure your spot at this event.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
