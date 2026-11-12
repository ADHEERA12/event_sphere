import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../services/api";
import "./Payment.css";

function Payment() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch user registrations to find the one matching id
    api.get("/registrations/my-registrations")
      .then((res) => {
        const found = res.data.find((r) => r.id === Number(id));
        if (found) {
          setRegistration(found);
          if (found.status === "CONFIRMED" && found.paymentStatus === "SUCCESS") {
            setPaymentSuccess(true);
          }
        } else {
          setError("Registration record not found");
        }
      })
      .catch((err) => {
        console.error("Failed to load registration for payment", err);
        setError("Failed to load registration details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handlePayment = async () => {
    setPaying(true);
    setError("");

    try {
      // Use simulatePayment endpoint to complete the payment test mode
      const res = await api.post(`/payments/simulate/${id}`);
      setPaymentSuccess(true);
    } catch (err) {
      console.error("Payment failed", err);
      setError(err.response?.data?.message || "Payment processing failed. Please try again.");
    } finally {
      setPaying(false);
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

  if (loading) {
    return (
      <div className="payment-page" style={{ textAlign: "center", padding: "60px" }}>
        <h2>Loading payment details...</h2>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="payment-page">
        <div className="payment-card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "50px", color: "#2e7d32", marginBottom: "15px" }}>✓</div>
          <h1 style={{ color: "#2e7d32" }}>Payment Completed!</h1>
          <p className="payment-subtitle">
            Your registration is fully confirmed.
          </p>

          <div className="payment-event-details">
            <h2>{registration?.eventTitle}</h2>
            <p>Ticket ID: <strong>{registration?.ticketId}</strong></p>
            <p>Amount Paid: <strong>₹{registration?.eventPrice}</strong></p>
          </div>

          <button
            className="pay-now-btn"
            onClick={() => navigate("/my-registrations")}
            style={{ marginTop: "20px" }}
          >
            Go to My Registrations
          </button>
        </div>
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div className="payment-page">
        <div className="payment-card">
          <h2>{error || "Registration Not Found"}</h2>
          <Link to="/events" className="back-payment-btn" style={{ textAlign: "center", display: "block", marginTop: "20px" }}>
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-card">
        <h1>Complete Your Registration</h1>
        <p className="payment-subtitle">
          Review your event details before proceeding.
        </p>

        <div className="payment-event-details">
          <h2>{registration.eventTitle}</h2>
          <p>Date: {formatDate(registration.eventDate)}</p>
          <p>Location: {registration.eventLocation || registration.eventVenue}</p>
          <p>Attendee: {registration.attendeeName}</p>
        </div>

        <div className="payment-price">
          <span>Total Amount</span>
          <h2>₹{registration.eventPrice}</h2>
        </div>

        {error && (
          <div style={{ color: "#c62828", background: "#ffebee", padding: "10px", borderRadius: "6px", margin: "15px 0" }}>
            {error}
          </div>
        )}

        <button className="pay-now-btn" onClick={handlePayment} disabled={paying}>
          {paying ? "Processing Payment..." : `Pay ₹${registration.eventPrice}`}
        </button>

        <button
          className="back-payment-btn"
          onClick={() => navigate(`/events/${registration.eventId}`)}
        >
          Back to Event
        </button>

        <p className="secure-payment">
          🔒 Secure payment powered by Razorpay (Test / Demo Mode Enabled)
        </p>
      </div>
    </div>
  );
}

export default Payment;
