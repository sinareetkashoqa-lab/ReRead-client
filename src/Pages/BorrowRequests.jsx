import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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

      //Fetch sent requests (user as requester)
      const sentRes = await fetch("http://localhost:5000/api/borrow-requests", {
        headers: { "x-role": user.role },
      });
      const sentData = await sentRes.json();
      setSentRequests(sentData.filter((r) => r.status !== "returned"));

      //Fetch received requests (user as owner)
      const receivedRes = await fetch(
        "http://localhost:5000/api/borrow-requests/received",
        {
          headers: { "x-role": user.role },
        },
      );
      const receivedData = await receivedRes.json();
      setReceivedRequests(receivedData.filter((r) => r.status !== "returned"));

      //Fetch all requests
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
        `http://localhost:5000/api/borrow-requests/${requestId}/approve`,
        {
          method: "PUT",
          headers: { "x-role": user.role },
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
        `http://localhost:5000/api/borrow-requests/${requestId}/decline`,
        {
          method: "PUT",
          headers: { "x-role": user.role },
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
        `http://localhost:5000/api/borrow-requests/${requestId}/return`,
        {
          method: "PUT",
          headers: { "x-role": user.role },
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
        `http://localhost:5000/api/borrow-requests/${requestId}`,
        {
          method: "DELETE",
          headers: { "x-role": user.role },
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
    <div>
      <h1>Borrow Requests</h1>
      <p>Manage your borrow requests</p>

      {/* Tabs */}
      <div>
        <button onClick={() => setActiveTab("sent")}>
          Sent ({sentRequests.length})
        </button>
        <button onClick={() => setActiveTab("received")}>
          Received ({receivedRequests.length})
        </button>
        <button onClick={() => setActiveTab("completed")}>
          Completed ({completedRequests.length})
        </button>
      </div>

      {/*Sent Requests*/}
      {activeTab === "sent" && (
        <div>
          <h2>Requests You've Sent</h2>
          {sentRequests.length === 0 ? (
            <p>
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

      {/*Received Requests*/}
      {activeTab === "received" && (
        <div>
          <h2>Requests Received</h2>
          {receivedRequests.length === 0 ? (
            <p>No received requests.</p>
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

      {/*Completed Requests*/}
      {activeTab === "completed" && (
        <div>
          <h2>Completed Requests</h2>
          {completedRequests.length === 0 ? (
            <p>No completed requests yet.</p>
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

// Request Card Component
const RequestCard = ({
  request,
  type,
  onApprove,
  onDecline,
  onReturn,
  onCancel,
}) => {
  const book = request.book || {};
  const requester = request.requester || {};
  const owner = request.owner || {};

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

  return (
    <div>
      <div>
        <Link to={`/books/${book.id}`}>
          <strong>{book.title}</strong>
        </Link>
        <p>by {book.author}</p>
      </div>

      <div>
        {type === "sent" && (
          <>
            <p>
              <strong>Owner:</strong> {owner.username || "Unknown"}
            </p>
            <p>
              <strong>Status:</strong> {getStatusBadge()}
            </p>
            {request.message && (
              <p>
                <strong>Your message:</strong> {request.message}
              </p>
            )}
            {request.status === "pending" && (
              <button onClick={() => onCancel(request.id)}>
                Cancel Request
              </button>
            )}
          </>
        )}

        {type === "received" && (
          <>
            <p>
              <strong>Requester:</strong> {requester.username || "Unknown"}
            </p>
            <p>
              <strong>Status:</strong> {getStatusBadge()}
            </p>
            {request.message && (
              <p>
                <strong>Message:</strong> {request.message}
              </p>
            )}
            {request.status === "pending" && (
              <div>
                <button onClick={() => onApprove(request.id)}>Approve</button>
                <button onClick={() => onDecline(request.id)}>Decline</button>
              </div>
            )}
            {request.status === "approved" && (
              <button onClick={() => onReturn(request.id)}>
                Mark as Returned
              </button>
            )}
          </>
        )}

        {type === "completed" && (
          <>
            <p>
              <strong>Status:</strong> {getStatusBadge()}
            </p>
            {request.return_date && (
              <p>
                <strong>Returned:</strong>{" "}
                {new Date(request.return_date).toLocaleDateString()}
              </p>
            )}
          </>
        )}

        <Link to={`/books/${book.id}`}>
          <button>View Book</button>
        </Link>
      </div>
      <hr />
    </div>
  );
};

export default BorrowRequests;
