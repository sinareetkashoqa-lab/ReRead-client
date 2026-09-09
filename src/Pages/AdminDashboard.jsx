import { useState, useEffect } from "react";
import "./AdminDashboard.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    totalRequests: 0,
    activeBorrows: 0,
  });
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const filtered = users.filter(
        (u) =>
          u.username.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term) ||
          (u.full_name && u.full_name.toLowerCase().includes(term)),
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      const statsRes = await fetch(`${API_BASE_URL}/api/admin/stats`, {
        headers: { "x-role": user.role },
      });
      const statsData = await statsRes.json();
      setStats(statsData);

      const usersRes = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: { "x-role": user.role },
      });
      const usersData = await usersRes.json();
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendUser = async (userId) => {
    if (!confirm("Suspend this user?")) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/users/${userId}/suspend`,
        {
          method: "PUT",
          headers: { "x-role": user.role },
        },
      );

      if (res.ok) {
        alert("User suspended");
        fetchAdminData();
      } else {
        alert("Failed to suspend user");
      }
    } catch (error) {
      console.error("Error suspending user:", error);
      alert("Server error. Please try again.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Delete this user permanently? This cannot be undone."))
      return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { "x-role": user.role },
      });

      if (res.ok) {
        alert("User deleted");
        fetchAdminData();
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Server error. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading admin dashboard...</div>;
  }

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <p className="subtitle">Welcome, Admin!</p>

      <div className="stats-grid">
        <div className="stat-card">
          <h3 className="number green">{stats.totalUsers}</h3>
          <p className="label">Total Users</p>
        </div>
        <div className="stat-card">
          <h3 className="number blue">{stats.totalBooks}</h3>
          <p className="label">Total Books</p>
        </div>
        <div className="stat-card">
          <h3 className="number orange">{stats.totalRequests}</h3>
          <p className="label">Total Requests</p>
        </div>
        <div className="stat-card">
          <h3 className="number purple">{stats.activeBorrows}</h3>
          <p className="label">Active Borrows</p>
        </div>
      </div>

      <div className="admin-section">
        <h2>Manage Users</h2>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="btn-clear" onClick={() => setSearchTerm("")}>
              Clear
            </button>
          )}
        </div>

        <p>Showing {filteredUsers.length} users</p>

        {filteredUsers.length === 0 ? (
          <p className="empty-state">No users found</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.full_name || "N/A"}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`role-badge ${u.role}`}>{u.role}</span>
                  </td>
                  <td>
                    <span
                      className={
                        u.is_suspended ? "status-suspended" : "status-active"
                      }
                    >
                      {u.is_suspended ? "Suspended" : "Active"}
                    </span>
                  </td>
                  <td>
                    {u.role !== "admin" ? (
                      <>
                        <button
                          className="btn-suspend"
                          onClick={() => handleSuspendUser(u.id)}
                        >
                          {u.is_suspended ? "Unsuspend" : "Suspend"}
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteUser(u.id)}
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <span className="no-edit">Cannot modify admin</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
