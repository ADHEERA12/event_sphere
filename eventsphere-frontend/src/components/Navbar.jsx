import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        EventSphere
      </Link>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/events">Explore Events</Link>
        <Link to="/recommendations">AI Recommendations</Link>

        {isAuthenticated && !isAdmin && (
          <>
            <Link to="/my-registrations">My Registrations</Link>
            <Link to="/dashboard">Dashboard</Link>
          </>
        )}

        {isAuthenticated && isAdmin && (
          <>
            <Link to="/admin/dashboard">Admin Dashboard</Link>
            <Link to="/admin/manage-events">Manage Events</Link>
            <Link to="/admin/registrations">Registrations</Link>
            <Link to="/admin/manage-users">Users</Link>
          </>
        )}
      </div>

      <div className="navbar-actions">
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="user-badge" title="View Profile">
              👤 {user?.name || "User"} {isAdmin && "(Admin)"}
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-btn">
              Login
            </Link>
            <Link to="/register" className="get-started-btn">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
