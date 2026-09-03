import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Settings = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/users/profile", {
        method: "DELETE",
        headers: { "x-role": user.role },
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
    <div>
      <h1>Settings</h1>
      <p>Manage your account settings</p>

      {error && <div>{error}</div>}

      <div>
        <h2>Account Management</h2>
        <p>
          Once you delete your account, there is no going back. Please be
          certain.
        </p>

        {!showConfirm ? (
          <button onClick={() => setShowConfirm(true)}>Delete Account</button>
        ) : (
          <div>
            <p>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <button onClick={handleDeleteAccount} disabled={loading}>
              {loading ? "Deleting..." : "Yes, Delete My Account"}
            </button>
            <button onClick={() => setShowConfirm(false)}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
