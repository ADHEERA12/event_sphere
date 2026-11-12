import { useState, useEffect } from "react";
import api from "../services/api";
import "./ManageUsers.css";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === "All" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const toggleStatus = async (id) => {
    try {
      await api.put(`/admin/users/${id}/toggle-status`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user status.");
    }
  };

  const toggleRole = async (user) => {
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    const confirm = window.confirm(`Are you sure you want to change ${user.name}'s role to ${newRole}?`);
    if (!confirm) return;

    try {
      await api.put(`/admin/users/${user.id}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update role.");
    }
  };

  return (
    <div className="manage-users-page">
      <div className="manage-users-header">
        <div>
          <h1>Manage Users</h1>
          <p>View and manage registered users.</p>
        </div>
      </div>

      <div className="users-summary">
        <div className="user-summary-card">
          <h2>{users.length}</h2>
          <p>Total Users</p>
        </div>

        <div className="user-summary-card">
          <h2>{users.filter((u) => u.role === "USER").length}</h2>
          <p>Regular Users</p>
        </div>

        <div className="user-summary-card">
          <h2>{users.filter((u) => u.active).length}</h2>
          <p>Active Users</p>
        </div>
      </div>

      <div className="users-controls">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="All">All Roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>Loading users...</td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td><strong>{user.name}</strong></td>
                  <td>{user.email}</td>
                  <td>
                    <span 
                      className={`user-role ${user.role.toLowerCase()}`}
                      onClick={() => toggleRole(user)}
                      title="Click to toggle Role"
                      style={{ cursor: "pointer" }}
                    >
                      {user.role} 🔄
                    </span>
                  </td>
                  <td>
                    <span
                      className={`user-status ${user.active ? "active" : "inactive"}`}
                    >
                      {user.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="user-action-btn"
                      onClick={() => toggleStatus(user.id)}
                    >
                      {user.active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-users">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageUsers;
