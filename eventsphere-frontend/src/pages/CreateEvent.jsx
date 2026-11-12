import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "./CreateEvent.css";

function CreateEvent() {
  const navigate = useNavigate();

  const [event, setEvent] = useState({
    title: "",
    category: "",
    date: "",
    time: "",
    location: "",
    venue: "",
    capacity: "",
    price: "",
    description: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setEvent({
      ...event,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const eventDateTime = event.date && event.time
        ? `${event.date}T${event.time}:00`
        : (event.date ? `${event.date}T10:00:00` : null);

      const payload = {
        title: event.title.trim(),
        description: event.description.trim(),
        category: event.category,
        location: event.location.trim(),
        venue: event.venue.trim(),
        eventDate: eventDateTime,
        registrationDeadline: eventDateTime,
        capacity: Number(event.capacity) || 50,
        availableSeats: Number(event.capacity) || 50,
        price: Number(event.price) || 0,
        imageUrl: event.imageUrl.trim() || "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
        published: true,
      };

      await api.post("/events", payload);
      alert("Event published successfully!");
      navigate("/admin/manage-events");
    } catch (err) {
      console.error("Failed to publish event", err);
      setError(err.response?.data?.message || "Failed to publish event. Please verify all inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-page">
      <div className="create-event-header">
        <Link to="/admin/manage-events" className="create-back-link">
          ← Back to Manage Events
        </Link>
        <h1>Create & Publish Event</h1>
        <p>Fill in the event details to publish directly onto EventSphere.</p>
      </div>

      {error && (
        <div className="create-error-banner">
          ⚠️ {error}
        </div>
      )}

      <form className="create-event-form" onSubmit={handleSubmit}>
        <div className="create-event-grid">
          <div className="create-field">
            <label>Event Title *</label>
            <input
              name="title"
              value={event.title}
              onChange={handleChange}
              placeholder="e.g. National AI Hackathon 2026"
              required
            />
          </div>

          <div className="create-field">
            <label>Category *</label>
            <select
              name="category"
              value={event.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="Technology">Technology</option>
              <option value="Arts & Design">Arts & Design</option>
              <option value="Workshop">Workshop</option>
              <option value="Business">Business</option>
              <option value="Music">Music</option>
              <option value="Education">Education</option>
              <option value="Sports">Sports</option>
            </select>
          </div>

          <div className="create-field">
            <label>Event Date *</label>
            <input
              type="date"
              name="date"
              value={event.date}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div className="create-field">
            <label>Event Time *</label>
            <input
              type="time"
              name="time"
              value={event.time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="create-field">
            <label>Location (City) *</label>
            <input
              name="location"
              value={event.location}
              onChange={handleChange}
              placeholder="e.g. Coimbatore, Chennai, Bangalore"
              required
            />
          </div>

          <div className="create-field">
            <label>Venue (Hall / Auditorium) *</label>
            <input
              name="venue"
              value={event.venue}
              onChange={handleChange}
              placeholder="e.g. CODISSIA Trade Fair Complex"
              required
            />
          </div>

          <div className="create-field">
            <label>Total Capacity (Available Seats) *</label>
            <input
              type="number"
              name="capacity"
              value={event.capacity}
              onChange={handleChange}
              placeholder="e.g. 150"
              min="1"
              required
            />
          </div>

          <div className="create-field">
            <label>Ticket Price (₹) * (Enter 0 for Free)</label>
            <input
              type="number"
              name="price"
              value={event.price}
              onChange={handleChange}
              placeholder="0"
              min="0"
              required
            />
          </div>

          <div className="create-field full-width">
            <label>Cover Image URL (Optional)</label>
            <input
              name="imageUrl"
              value={event.imageUrl}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/photo-..."
            />
          </div>

          <div className="create-field full-width">
            <label>Event Description *</label>
            <textarea
              name="description"
              value={event.description}
              onChange={handleChange}
              placeholder="Provide a detailed description of the event agenda, keynote speakers, and what attendees will learn..."
              rows="5"
              required
            />
          </div>
        </div>

        <div className="create-form-actions">
          <Link to="/admin/manage-events" className="create-cancel-btn">
            Cancel
          </Link>

          <button
            type="submit"
            className="publish-submit-btn"
            disabled={loading}
          >
            {loading ? "Publishing Event..." : "🚀 Publish Event"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateEvent;
