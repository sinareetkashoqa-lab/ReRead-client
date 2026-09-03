import { useState, useEffect } from "react";

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
    // Filter users based on search term
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

      //Fetch stats
      const statsRes = await fetch("http://localhost:5000/api/admin/stats", {
        headers: { "x-role": user.role },
      });
      const statsData = await statsRes.json();
      setStats(statsData);

      //Fetch all users
      const usersRes = await fetch("http://localhost:5000/api/admin/users", {
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
        `http://localhost:5000/api/admin/users/${userId}/suspend`,
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
      const res = await fetch(
        `http://localhost:5000/api/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: { "x-role": user.role },
        },
      );

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
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.full_name || user?.username}!</p>

      {/*Stats Cards*/}
      <div>
        <div>
          <h3>{stats.totalUsers}</h3>
          <p>Total Users</p>
        </div>
        <div>
          <h3>{stats.totalBooks}</h3>
          <p>Total Books</p>
        </div>
        <div>
          <h3>{stats.totalRequests}</h3>
          <p>Total Requests</p>
        </div>
        <div>
          <h3>{stats.activeBorrows}</h3>
          <p>Active Borrows</p>
        </div>
      </div>

      {/*Users Table*/}
      <div>
        <h2>Manage Users</h2>

        {/*Search Bar*/}
        <div>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")}>Clear</button>
          )}
        </div>

        <p>Showing {filteredUsers.length} users</p>

        {filteredUsers.length === 0 ? (
          <p>No users found</p>
        ) : (
          <table>
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
                  <td>{u.role}</td>
                  <td>{u.is_suspended ? "Suspended" : "Active"}</td>
                  <td>
                    {u.role !== "admin" && (
                      <>
                        <button onClick={() => handleSuspendUser(u.id)}>
                          {u.is_suspended ? "Unsuspend" : "Suspend"}
                        </button>
                        <button onClick={() => handleDeleteUser(u.id)}>
                          Delete
                        </button>
                      </>
                    )}
                    {u.role === "admin" && <span>Cannot modify admin</span>}
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
