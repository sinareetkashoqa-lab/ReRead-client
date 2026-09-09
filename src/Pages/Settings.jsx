import { useState } from "react";
import "./Settings.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Settings = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: "DELETE",
        headers: { "x-role": user.role, "user-id": user.id },
      });

      if (res.ok) {
        localStorage.removeItem("user");
        alert("Account deleted successfully");
        window.location.href = "/";
      } else {
        const data = await res.json();
        setError(data.message || "Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <p className="subtitle">Manage your account settings</p>

      {error && <div className="error">{error}</div>}

      <div className="settings-card">
        <h2>Account Management</h2>
        <p className="warning">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>

        {!showConfirm ? (
          <button className="btn-delete" onClick={() => setShowConfirm(true)}>
            Delete Account
          </button>
        ) : (
          <div className="confirm-box">
            <p>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <button
              className="btn-confirm"
              onClick={handleDeleteAccount}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Yes, Delete My Account"}
            </button>
            <button
              className="btn-cancel"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
