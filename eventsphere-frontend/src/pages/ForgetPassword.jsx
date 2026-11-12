import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./ForgetPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setError("");
    setLoading(true);

    try {
      await api.post("/users/forgot-password", { email: email.trim() });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "No account found with this email address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <div className="forgot-icon">🔐</div>

        <h1>Forgot Password?</h1>
        <p>
          Enter your registered email address. We'll help you reset
          your password.
        </p>

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

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="forgot-success">
            <h3>Request Submitted!</h3>
            <p>
              If an account exists for {email}, password reset
              instructions have been sent to that address.
            </p>
          </div>
        )}

        <Link to="/login" className="back-login">
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}

export default ForgotPassword;
