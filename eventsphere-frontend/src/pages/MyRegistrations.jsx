import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./MyRegistrations.css";

function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await api.get("/registrations/my-registrations");
      setRegistrations(res.data);
    } catch (err) {
      console.error("Failed to fetch registrations", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    const confirm = window.confirm("Are you sure you want to cancel this registration?");
    if (!confirm) return;

    try {
      await api.put(`/registrations/${id}/cancel`);
      alert("Registration cancelled successfully.");
      fetchRegistrations();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel registration.");
    }
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

  return (
    <div className="registrations-page">
      <div className="registrations-header">
        <div>
          <h1>My Registrations</h1>
          <p>View and manage all your event registrations.</p>
        </div>

        <Link to="/events" className="browse-events-btn">
          Browse Events
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>Loading your registrations...</div>
      ) : (
        <div className="registration-list">
          {registrations.map((item) => (
            <div className="registration-card" key={item.id}>
              <div className="registration-info">
                <h2>{item.eventTitle}</h2>
                <p>📅 {formatDate(item.eventDate)}</p>
                <p>📍 {item.eventLocation || item.eventVenue}</p>
                <p>🎟 Ticket ID: <strong>{item.ticketId}</strong></p>
                <p>Amount: {item.eventPrice > 0 ? `₹${item.eventPrice}` : "Free"}</p>
                <p>Payment: <strong style={{ color: item.paymentStatus === "SUCCESS" ? "#2e7d32" : "#f57c00" }}>{item.paymentStatus}</strong></p>
              </div>

              <div className="registration-actions">
                <span
                  className={
                    item.status === "CONFIRMED"
                      ? "status confirmed"
                      : item.status === "PENDING"
                      ? "status pending"
                      : "status completed"
                  }
                >
                  {item.status}
                </span>

                {item.status === "PENDING" && item.eventPrice > 0 && (
                  <Link to={`/payment/${item.id}`} style={{
                    padding: "8px 14px",
                    backgroundColor: "#712420",
                    color: "#fff",
                    borderRadius: "6px",
                    textDecoration: "none",
                    fontSize: "13px",
                    fontWeight: "600"
                  }}>
                    Pay Now
                  </Link>
                )}

                <button
                  className="ticket-btn"
                  onClick={() => alert(`🎫 Ticket Details:\n\nEvent: ${item.eventTitle}\nTicket ID: ${item.ticketId}\nAttendee: ${item.attendeeName}\nStatus: ${item.status}`)}
                >
                  View Ticket
                </button>

                {item.status === "CONFIRMED" && (
                  <button
                    onClick={() => handleCancel(item.id)}
                    style={{
                      background: "none",
                      border: "1px solid #c62828",
                      color: "#c62828",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && registrations.length === 0 && (
        <div className="empty-registrations">
          <h2>No registrations yet</h2>
          <p>Explore events and register for your first event!</p>
          <Link to="/events">Explore Events</Link>
        </div>
      )}
    </div>
  );
}

export default MyRegistrations;
