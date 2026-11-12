import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ManageEvents.css";

function ManageEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/events/all");
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to load events", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    const status = event.published ? "Published" : "Draft";
    const matchesSearch =
      (event.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (event.category || "").toLowerCase().includes(search.toLowerCase()) ||
      (event.location || "").toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "All" || status === filter;

    return matchesSearch && matchesFilter;
  });

  const toggleStatus = async (event) => {
    try {
      await api.put(`/events/${event.id}`, {
        ...event,
        published: !event.published,
      });
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to toggle status.");
    }
  };

  const deleteEvent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (confirmDelete) {
      try {
        await api.delete(`/events/${id}`);
        fetchEvents();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete event.");
      }
    }
  };

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
    <div className="manage-events-page">
      <div className="manage-events-header">
        <div>
          <h1>Manage Events</h1>
          <p>View, update publication status, and manage all your events.</p>
        </div>

        <button
          className="add-event-btn"
          onClick={() => navigate("/admin/create-event")}
        >
          + Create Event
        </button>
      </div>

      <div className="events-controls">
        <input
          type="text"
          placeholder="Search by title, category, or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Published">Published Only</option>
          <option value="Draft">Drafts Only</option>
        </select>
      </div>

      <div className="events-table-wrapper">
        <table className="events-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Location</th>
              <th>Seats</th>
              <th>Status</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "30px" }}>Loading events...</td>
              </tr>
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <tr key={event.id}>
                  <td><strong>{event.title}</strong></td>
                  <td>
                    <span className="event-cat-tag">{event.category}</span>
                  </td>
                  <td>{formatDate(event.eventDate)}</td>
                  <td>{event.location || event.venue}</td>
                  <td>
                    <span className="seats-count">{event.availableSeats}</span> / {event.capacity}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        event.published ? "published" : "draft"
                      }`}
                    >
                      {event.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions-group">
                      <button
                        className={`action-pill ${
                          event.published ? "unpublish-pill" : "publish-pill"
                        }`}
                        onClick={() => toggleStatus(event)}
                        title={event.published ? "Click to set as Draft" : "Click to Publish"}
                      >
                        {event.published ? "⏸ Unpublish" : "▶ Publish"}
                      </button>

                      <button
                        className="action-pill delete-pill"
                        onClick={() => deleteEvent(event.id)}
                        title="Delete this event"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "30px" }}>No events found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageEvents;
