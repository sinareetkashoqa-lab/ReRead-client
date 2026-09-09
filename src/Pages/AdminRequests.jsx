import { useState, useEffect } from "react";
import "./AdminRequests.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminRequests = ({ user }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/admin/requests`, {
        headers: { "x-role": user.role },
      });
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (!confirm("Delete this borrow request? This cannot be undone.")) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/requests/${requestId}`,
        {
          method: "DELETE",
          headers: { "x-role": user.role },
        },
      );

      if (res.ok) {
        alert("Request deleted");
        fetchRequests();
      } else {
        alert("Failed to delete request");
      }
    } catch (error) {
      console.error("Error deleting request:", error);
      alert("Server error. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading requests...</div>;
  }

  return (
    <div className="admin-requests-page">
      <h1>All Borrow Requests</h1>
      <p className="subtitle">
        View and manage every borrow request in the system
      </p>

      <p>Showing {requests.length} requests</p>

      {requests.length === 0 ? (
        <p className="empty-state">No borrow requests yet</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Book</th>
              <th>Requester</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Requested On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.book_title}</td>
                <td>{r.requester_name}</td>
                <td>{r.owner_name}</td>
                <td>
                  <span className={`request-status ${r.status}`}>
                    {r.status}
                  </span>
                </td>
                <td>
                  {r.created_at
                    ? new Date(r.created_at).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteRequest(r.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminRequests;
