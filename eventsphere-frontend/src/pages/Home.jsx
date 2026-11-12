import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import heroImg from "../assets/hero.png";
import "./Home.css";

function Home() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/events")
      .then((res) => {
        setEvents(res.data.slice(0, 3));
      })
      .catch((err) => console.error("Failed to load featured events", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/events?search=${encodeURIComponent(search.trim())}`);
    } else {
      navigate("/events");
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/events?category=${encodeURIComponent(category)}`);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Upcoming";
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

  const formatPrice = (price) => {
    if (!price || price <= 0) return "Free";
    return `₹${price}`;
  };

  const categories = [
    { name: "Technology", icon: "💻", count: "120+ Events", color: "#eef2ff", iconBg: "#4338ca" },
    { name: "Arts & Design", icon: "🎨", count: "85+ Events", color: "#fdf2f8", iconBg: "#db2777" },
    { name: "Music", icon: "🎵", count: "60+ Events", color: "#faf5ff", iconBg: "#7e22ce" },
    { name: "Business", icon: "💼", count: "95+ Events", color: "#ecfdf5", iconBg: "#059669" },
    { name: "Sports", icon: "🏆", count: "50+ Events", color: "#fffbeb", iconBg: "#d97706" },
    { name: "Education", icon: "📚", count: "70+ Events", color: "#eff6ff", iconBg: "#2563eb" },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <span className="hero-badge">✨ THE PREMIER EVENT PLATFORM</span>

            <h1 className="hero-title">
              Find Events That <br />
              <span className="hero-highlight">Inspire & Connect</span> You
            </h1>

            <p className="hero-subtitle">
              Discover conferences, creative workshops, hackathons, and festivals.
              Book your tickets in seconds and create unforgettable memories.
            </p>

            <form className="hero-search-box" onSubmit={handleSearch}>
              <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search conferences, workshops, cities..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button type="submit" className="search-submit-btn">
                Find Events
              </button>
            </form>

            <div className="hero-popular-tags">
              <span>Popular:</span>
              <button type="button" onClick={() => handleCategoryClick("Technology")}>AI & Tech</button>
              <button type="button" onClick={() => handleCategoryClick("Business")}>Startups</button>
              <button type="button" onClick={() => handleCategoryClick("Music")}>Live Music</button>
              <button type="button" onClick={() => handleCategoryClick("Arts & Design")}>Design</button>
            </div>

            <div className="hero-metrics">
              <div className="metric-item">
                <h3>500+</h3>
                <p>Events Hosted</p>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-item">
                <h3>25K+</h3>
                <p>Happy Attendees</p>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-item">
                <h3>150+</h3>
                <p>Top Venues</p>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-visual-card">
              <img src={heroImg} alt="EventSphere Experience" className="hero-main-image" />
              <div className="floating-card live-badge">
                <span className="live-dot"></span>
                <div>
                  <strong>Live Registrations</strong>
                  <p>Over 1.2k today</p>
                </div>
              </div>
              <div className="floating-card rating-badge">
                <span className="star-icon">⭐</span>
                <div>
                  <strong>4.9 / 5.0</strong>
                  <p>From 8,000+ reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-header-block">
          <div>
            <span className="section-label">EXPLORE CATEGORIES</span>
            <h2 className="section-main-title">Browse by Interest</h2>
          </div>
          <Link to="/events" className="view-all-link">
            Explore All Categories <span>→</span>
          </Link>
        </div>

        <div className="categories-cards-grid">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="category-pill-card"
              onClick={() => handleCategoryClick(cat.name)}
            >
              <div className="category-icon-wrapper" style={{ backgroundColor: cat.color }}>
                <span className="cat-emoji">{cat.icon}</span>
              </div>
              <div className="category-card-text">
                <h3>{cat.name}</h3>
                <p>{cat.count}</p>
              </div>
              <span className="cat-arrow">↗</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="featured-events-section">
        <div className="section-header-block">
          <div>
            <span className="section-label">HANDPICKED EXPERIENCES</span>
            <h2 className="section-main-title">Featured Events</h2>
          </div>
          <Link to="/events" className="view-all-link">
            View All Events <span>→</span>
          </Link>
        </div>

        {loading ? (
          <div className="events-loading-spinner">Loading featured events...</div>
        ) : events.length > 0 ? (
          <div className="featured-events-grid">
            {events.map((event) => (
              <div className="premium-event-card" key={event.id}>
                <div className="event-media-wrapper">
                  <img
                    src={event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87"}
                    alt={event.title}
                    className="event-card-banner"
                  />
                  <div className="event-date-chip">
                    📅 {formatDate(event.eventDate)}
                  </div>
                  <div className="event-price-chip">
                    {formatPrice(event.price)}
                  </div>
                </div>

                <div className="event-card-body">
                  <div className="event-meta-tags">
                    <span className="category-badge">{event.category}</span>
                    <span className="seat-badge">
                      {event.availableSeats > 0 ? `🎟️ ${event.availableSeats} seats` : "Sold Out"}
                    </span>
                  </div>

                  <h3 className="event-card-title">{event.title}</h3>

                  <p className="event-card-location">
                    📍 {event.location || event.venue || "Venue details inside"}
                  </p>

                  <div className="event-card-footer">
                    <div className="price-tag">
                      <span>Price</span>
                      <strong>{formatPrice(event.price)}</strong>
                    </div>
                    <Link to={`/events/${event.id}`} className="event-details-btn">
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-events-notice">
            <p>No featured events currently available. Check back soon!</p>
          </div>
        )}
      </section>

      {/* Features / Why Choose Us */}
      <section className="why-us-section">
        <div className="why-us-container">
          <div className="why-card">
            <div className="why-icon">⚡</div>
            <h3>Instant Booking</h3>
            <p>Instant confirmation with unique QR-ready Ticket IDs for frictionless venue entry.</p>
          </div>
          <div className="why-card">
            <div className="why-icon">🛡️</div>
            <h3>Verified Organizers</h3>
            <p>Every event is audited and verified to guarantee genuine and high-quality experiences.</p>
          </div>
          <div className="why-card">
            <div className="why-icon">🎯</div>
            <h3>AI Recommendations</h3>
            <p>Personalized event suggestions mapped specifically to your skills and interests.</p>
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="cta-banner-section">
        <div className="cta-banner-card">
          <div className="cta-banner-content">
            <span className="cta-mini-tag">ORGANIZERS & ATTENDEES</span>
            <h2>Ready to Experience or Host Events?</h2>
            <p>
              Join thousands of creators and attendees on EventSphere.
              Launch your own event or reserve your seat for the next big experience.
            </p>
            <div className="cta-buttons-row">
              <Link to="/events" className="cta-btn-primary">
                Explore All Events
              </Link>
              <Link to="/admin/create-event" className="cta-btn-secondary">
                + Create An Event
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
