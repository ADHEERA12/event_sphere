import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Event.css";

const categories = [
  "All",
  "Technology",
  "Arts & Design",
  "Business",
  "Music",
  "Sports",
];

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory && selectedCategory !== "All") {
        params.category = selectedCategory;
      }
      if (search.trim()) {
        params.search = search.trim();
      }

      const res = await api.get("/events", { params });
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to load events", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

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

  const formatPrice = (price) => {
    if (!price || price <= 0) return "Free";
    return `₹${price}`;
  };

  return (
    <div className="events-page">
      <section className="events-header">
        <span>DISCOVER EXPERIENCES</span>
        <h1>Explore Events</h1>
        <p>Find events, workshops, and experiences that interest you.</p>
      </section>

      <section className="events-container">
        <form className="events-toolbar" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search by event name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </form>

        <div className="events-result-heading">
          <h2>Upcoming Events</h2>
          <p>{events.length} events found</p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>Loading events...</div>
        ) : events.length > 0 ? (
          <div className="events-list-grid">
            {events.map((event) => (
              <div className="event-card" key={event.id}>
                <img
                  src={event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87"}
                  alt={event.title}
                />

                <div className="event-info">
                  <span className="event-category">
                    {event.category}
                  </span>

                  <h3>{event.title}</h3>

                  <p>📅 {formatDate(event.eventDate)}</p>
                  <p>📍 {event.location || event.venue}</p>

                  <div className="event-footer">
                    <strong>{formatPrice(event.price)}</strong>
                    <Link to={`/events/${event.id}`}>
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-events">
            <h3>No events found</h3>
            <p>Try another search or category.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Events;
