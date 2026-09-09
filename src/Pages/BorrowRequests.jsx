import { useState, useEffect } from "react";
import "./BorrowRequests.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BorrowRequests = ({ user }) => {
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("sent");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const sentRes = await fetch(`${API_BASE_URL}/api/borrow-requests`, {
        headers: { "x-role": user.role, "user-id": user.id },
      });
      const sentData = await sentRes.json();
      setSentRequests(sentData.filter((r) => r.status !== "returned"));

      const receivedRes = await fetch(
        `${API_BASE_URL}/api/borrow-requests/received`,
        {
          headers: { "x-role": user.role, "user-id": user.id },
        },
      );
      const receivedData = await receivedRes.json();
      setReceivedRequests(receivedData.filter((r) => r.status !== "returned"));

      const allSent = sentData.filter((r) => r.status === "returned");
      const allReceived = receivedData.filter((r) => r.status === "returned");
      setCompletedRequests([...allSent, ...allReceived]);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    if (!confirm("Approve this borrow request?")) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/borrow-requests/${requestId}/approve`,
        {
          method: "PUT",
          headers: { "x-role": user.role, "user-id": user.id },
        },
      );

      if (res.ok) {
        alert("Request approved!");
        fetchRequests();
      } else {
        alert("Failed to approve request");
      }
    } catch (error) {
      console.error("Error approving request:", error);
      alert("Server error. Please try again.");
    }
  };

  const handleDecline = async (requestId) => {
    if (!confirm("Decline this borrow request?")) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/borrow-requests/${requestId}/decline`,
        {
          method: "PUT",
          headers: { "x-role": user.role, "user-id": user.id },
        },
      );

      if (res.ok) {
        alert("Request declined");
        fetchRequests();
      } else {
        alert("Failed to decline request");
      }
    } catch (error) {
      console.error("Error declining request:", error);
      alert("Server error. Please try again.");
    }
  };

  const handleReturn = async (requestId) => {
    if (!confirm("Mark this book as returned?")) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/borrow-requests/${requestId}/return`,
        {
          method: "PUT",
          headers: { "x-role": user.role, "user-id": user.id },
        },
      );

      if (res.ok) {
        alert("Book marked as returned!");
        fetchRequests();
      } else {
        alert("Failed to mark as returned");
      }
    } catch (error) {
      console.error("Error marking as returned:", error);
      alert("Server error. Please try again.");
    }
  };

  const handleCancel = async (requestId) => {
    if (!confirm("Cancel this request?")) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/borrow-requests/${requestId}`,
        {
          method: "DELETE",
          headers: { "x-role": user.role, "user-id": user.id },
        },
      );

      if (res.ok) {
        alert("Request cancelled");
        fetchRequests();
      } else {
        alert("Failed to cancel request");
      }
    } catch (error) {
      console.error("Error cancelling request:", error);
      alert("Server error. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading requests...</div>;
  }

  return (
    <div className="requests-page">
      <h1>Borrow Requests</h1>
      <p className="subtitle">Manage your borrow requests</p>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "sent" ? "active" : ""}`}
          onClick={() => setActiveTab("sent")}
        >
          Sent <span className="count">{sentRequests.length}</span>
        </button>
        <button
          className={`tab ${activeTab === "received" ? "active" : ""}`}
          onClick={() => setActiveTab("received")}
        >
          Received <span className="count">{receivedRequests.length}</span>
        </button>
        <button
          className={`tab ${activeTab === "completed" ? "active" : ""}`}
          onClick={() => setActiveTab("completed")}
        >
          Completed <span className="count">{completedRequests.length}</span>
        </button>
      </div>

      {activeTab === "sent" && (
        <div>
          <h2>Requests You've Sent</h2>
          {sentRequests.length === 0 ? (
            <p className="empty-state">
              No sent requests. Browse books and click a book to request it.
            </p>
          ) : (
            <div>
              {sentRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  type="sent"
                  onCancel={handleCancel}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "received" && (
        <div>
          <h2>Requests Received</h2>
          {receivedRequests.length === 0 ? (
            <p className="empty-state">No received requests.</p>
          ) : (
            <div>
              {receivedRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  type="received"
                  onApprove={handleApprove}
                  onDecline={handleDecline}
                  onReturn={handleReturn}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "completed" && (
        <div>
          <h2>Completed Requests</h2>
          {completedRequests.length === 0 ? (
            <p className="empty-state">No completed requests yet.</p>
          ) : (
            <div>
              {completedRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  type="completed"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const RequestCard = ({
  request,
  type,
  onApprove,
  onDecline,
  onReturn,
  onCancel,
}) => {
  const getStatusBadge = () => {
    switch (request.status) {
      case "pending":
        return "Pending";
      case "approved":
        return "Approved";
      case "declined":
        return "Declined";
      case "returned":
        return "Returned";
      default:
        return request.status;
    }
  };

  const counterpartLabel =
    type === "sent"
      ? "Owner"
      : type === "received"
        ? "Requester"
        : request.owner_name
          ? "Owner"
          : "Requester";
  const counterpartName =
    request.owner_name || request.requester_username || "Unknown";

  return (
    <>
      <div className="request-card">
        <div className="book-info">
          <div className="book-title">
            <strong>{request.book_title}</strong>
          </div>
          <p className="book-author">by {request.book_author}</p>

          <p className="request-details">
            <strong>{counterpartLabel}:</strong> {counterpartName}
          </p>

          <span className={`request-status ${request.status}`}>
            {getStatusBadge()}
          </span>

          {request.message && (
            <p className="request-message">
              <strong>{type === "sent" ? "Your message:" : "Message:"}</strong>{" "}
              {request.message}
            </p>
          )}

          {type === "completed" && request.return_date && (
            <p className="request-details">
              <strong>Returned:</strong>{" "}
              {new Date(request.return_date).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="actions">
          {type === "sent" && request.status === "pending" && (
            <button className="btn-cancel" onClick={() => onCancel(request.id)}>
              Cancel Request
            </button>
          )}

          {type === "received" && request.status === "pending" && (
            <>
              <button
                className="btn-approve"
                onClick={() => onApprove(request.id)}
              >
                Approve
              </button>
              <button
                className="btn-decline"
                onClick={() => onDecline(request.id)}
              >
                Decline
              </button>
            </>
          )}

          {type === "received" && request.status === "approved" && (
            <button className="btn-return" onClick={() => onReturn(request.id)}>
              Mark as Returned
            </button>
          )}
        </div>
      </div>
      <hr />
    </>
  );
};

export default BorrowRequests;
