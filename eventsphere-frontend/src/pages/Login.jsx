import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: email.trim(),
        password: password,
      });

      login(response.data);

      const redirectPath = location.state?.from?.pathname || 
        (response.data.role === "ADMIN" ? "/admin/dashboard" : "/dashboard");
      navigate(redirectPath, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 
                  (typeof err.response?.data === 'string' ? err.response?.data : null) || 
                  "Login failed. Please check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">EventSphere</div>

        <h1>Welcome Back!</h1>
        <p className="auth-subtitle">
          Login to discover and manage your events.
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

        <form onSubmit={handleSubmit}>
          <div className="auth-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="auth-options">
            <label>
              <input type="checkbox" />
              Remember me
            </label>

            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
