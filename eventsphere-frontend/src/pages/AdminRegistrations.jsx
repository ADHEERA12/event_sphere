import { useState, useEffect } from "react";
import api from "../services/api";
import "./AdminRegistrations.css";

function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await api.get("/registrations/all");
      setRegistrations(res.data);
    } catch (err) {
      console.error("Failed to load registrations", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const userSearch = (reg.attendeeName || reg.userName || "").toLowerCase();
    const emailSearch = (reg.attendeeEmail || reg.userEmail || "").toLowerCase();
    const eventSearch = (reg.eventTitle || "").toLowerCase();
    const ticketSearch = (reg.ticketId || "").toLowerCase();
    const query = search.toLowerCase();

    const matchesSearch =
      userSearch.includes(query) ||
      emailSearch.includes(query) ||
      eventSearch.includes(query) ||
      ticketSearch.includes(query);

    const paymentLabel = reg.eventPrice <= 0 ? "Free" : (reg.paymentStatus === "SUCCESS" ? "Paid" : "Pending");
    const matchesFilter = filter === "All" || paymentLabel === filter;

    return matchesSearch && matchesFilter;
  });

  const cancelRegistration = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this attendee's registration? This will restore 1 available seat on the event."
    );

    if (confirmCancel) {
      try {
        await api.put(`/registrations/${id}/cancel`);
        fetchRegistrations();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to cancel registration.");
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
    <div className="admin-registrations-page">
      <div className="admin-registrations-header">
        <div>
          <h1>Manage Registrations</h1>
          <p>Monitor event bookings, ticket issues, attendee details, and payment statuses.</p>
        </div>
      </div>

      <div className="registration-summary">
        <div className="registration-summary-card">
          <h2>{registrations.length}</h2>
          <p>Total Registrations</p>
        </div>

        <div className="registration-summary-card">
          <h2 style={{ color: "#2e7d32" }}>
            {registrations.filter((r) => r.status === "CONFIRMED").length}
          </h2>
          <p>Confirmed Attendees</p>
        </div>

        <div className="registration-summary-card">
          <h2 style={{ color: "#1565c0" }}>
            {registrations.filter((r) => r.paymentStatus === "SUCCESS").length}
          </h2>
          <p>Successful Payments</p>
        </div>
      </div>

      <div className="registration-controls">
        <input
          type="text"
          placeholder="Search by ticket ID, attendee name, email, or event title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Payments</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Free">Free</option>
        </select>
      </div>

      <div className="registration-table-container">
        <table className="registration-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Attendee Info</th>
              <th>Event</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "30px" }}>Loading registrations...</td>
              </tr>
            ) : filteredRegistrations.length > 0 ? (
              filteredRegistrations.map((reg) => (
                <tr key={reg.id}>
                  <td>
                    <span className="ticket-badge">{reg.ticketId}</span>
                  </td>
                  <td>
                    <div className="attendee-name">{reg.attendeeName || reg.userName}</div>
                    <small className="attendee-email">{reg.attendeeEmail || reg.userEmail}</small>
                  </td>
                  <td><strong>{reg.eventTitle}</strong></td>
                  <td>{formatDate(reg.eventDate)}</td>
                  <td>{reg.eventPrice > 0 ? `₹${reg.eventPrice}` : "Free"}</td>
                  <td>
                    <span className={`payment-pill ${reg.paymentStatus === "SUCCESS" ? "paid" : (reg.eventPrice <= 0 ? "free" : "pending")}`}>
                      {reg.eventPrice <= 0 ? "Free" : (reg.paymentStatus === "SUCCESS" ? "Paid" : "Pending")}
                    </span>
                  </td>
                  <td>
                    <span className={`reg-pill ${reg.status.toLowerCase()}`}>
                      {reg.status}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {reg.status === "CONFIRMED" ? (
                      <button
                        className="cancel-reg-pill"
                        onClick={() => cancelRegistration(reg.id)}
                        title="Cancel this attendee's registration"
                      >
                        ✕ Cancel
                      </button>
                    ) : (
                      <span className="cancelled-pill">
                        Cancelled
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-registrations">
                  No registrations found matching your query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminRegistrations;
