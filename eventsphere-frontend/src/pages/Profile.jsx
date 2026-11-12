import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./Profile.css";

function Profile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    department: "",
  });
  const [savedProfile, setSavedProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/users/profile")
      .then((res) => {
        const data = {
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          college: res.data.college || "",
          department: res.data.department || "",
        };
        setProfile(data);
        setSavedProfile(data);
      })
      .catch((err) => {
        console.error("Failed to load user profile", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await api.put("/users/profile", {
        name: profile.name,
        phone: profile.phone,
        college: profile.college,
        department: profile.department,
      });

      const updated = {
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone,
        college: res.data.college,
        department: res.data.department,
      };

      setProfile(updated);
      setSavedProfile(updated);
      updateUser({ name: updated.name });
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setProfile(savedProfile);
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="profile-page" style={{ textAlign: "center", padding: "60px" }}>
        <h2>Loading profile...</h2>
      </div>
    );
  }

  const initial = profile.name ? profile.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>View and manage your personal information.</p>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">{initial}</div>

        <h2>{profile.name}</h2>
        <p>{profile.email}</p>

        {!editing && (
          <button
            type="button"
            className="edit-profile-btn"
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </button>
        )}

        <form onSubmit={handleSave}>
          <div className="profile-form-grid">
            <div className="profile-field">
              <label>Full Name</label>
              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
                disabled={!editing}
                required
              />
            </div>

            <div className="profile-field">
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={profile.email}
                disabled={true}
              />
            </div>

            <div className="profile-field">
              <label>Phone Number</label>
              <input
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Add phone number"
              />
            </div>

            <div className="profile-field">
              <label>College / Company</label>
              <input
                name="college"
                value={profile.college}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Add college or company"
              />
            </div>

            <div className="profile-field">
              <label>Department</label>
              <input
                name="department"
                value={profile.department}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Add department"
              />
            </div>
          </div>

          {editing && (
            <div className="profile-buttons">
              <button type="submit" className="save-profile-btn" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                className="cancel-profile-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Profile;
