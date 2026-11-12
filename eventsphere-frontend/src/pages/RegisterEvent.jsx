import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./RegisterEvent.css";

function RegisterEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [registrationData, setRegistrationData] = useState(null);

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    college: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }

    setLoading(true);
    api.get(`/events/${id}`)
      .then((res) => {
        setEvent(res.data);
      })
      .catch((err) => {
        console.error("Failed to load event", err);
        setError("Event not found");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, isAuthenticated]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await api.post("/registrations/register", {
        eventId: Number(id),
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        college: formData.college,
      });

      if (event.price > 0) {
        // Paid event: redirect to payment page
        navigate(`/payment/${res.data.id}`);
      } else {
        // Free event: confirmed immediately
        setRegistrationData(res.data);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 
                  (typeof err.response?.data === 'string' ? err.response?.data : null) || 
                  "Registration failed. You may already be registered or seats are full.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="registration-page" style={{ textAlign: "center", padding: "60px" }}>
        <h2>Loading event details...</h2>
      </div>
    );
  }

  if (registrationData) {
    return (
      <div className="registration-page">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h1>Registration Successful!</h1>
          <p>
            Thank you, {formData.fullName}. Your registration for{" "}
            <strong>{event?.title}</strong> is confirmed!
          </p>

          <div style={{
            background: "#f4f8f4",
            padding: "16px",
            borderRadius: "8px",
            margin: "20px 0",
            border: "1px dashed #2e7d32"
          }}>
            <p style={{ margin: "4px 0", fontSize: "14px", color: "#555" }}>Ticket ID</p>
            <h2 style={{ color: "#2e7d32", margin: "4px 0" }}>{registrationData.ticketId}</h2>
            <p style={{ margin: "4px 0", fontSize: "13px", color: "#777" }}>Status: Confirmed • Payment: Free</p>
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <Link to="/my-registrations" className="registration-btn">
              View My Registrations
            </Link>
            <Link to="/events" className="registration-btn" style={{ background: "#555" }}>
              Explore More Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="registration-page" style={{ textAlign: "center", padding: "60px" }}>
        <h2>{error || "Event Not Found"}</h2>
        <Link to="/events">Back to Events</Link>
      </div>
    );
  }

  return (
    <div className="registration-page">
      <div className="registration-form-container">
        <Link to={`/events/${id}`} className="back-link">
          ← Back to Event
        </Link>

        <div className="registration-heading">
          <span>JOIN THE EXPERIENCE</span>
          <h1>Event Registration</h1>
          <p>Complete the form below to register for this event.</p>
        </div>

        <div className="selected-event-card">
          <h2>{event.title}</h2>
          <p>📍 {event.location || event.venue}</p>
          <p>Price: <strong>{event.price > 0 ? `₹${event.price}` : "Free"}</strong></p>
        </div>

        {error && (
          <div style={{
            padding: "10px 14px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: "6px",
            marginBottom: "16px",
            fontSize: "14px"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter 10-digit phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>College / Organization</label>
            <input
              type="text"
              name="college"
              placeholder="Enter your college or company"
              value={formData.college}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="submit-registration-btn" disabled={submitting}>
            {submitting ? "Registering..." : (event.price > 0 ? `Proceed to Pay ₹${event.price}` : "Confirm Registration")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterEvent;
