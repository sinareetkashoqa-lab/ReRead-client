import { useState, useEffect } from "react";
import "./Profile.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Profile = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    location: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
        headers: { "x-role": user.role, "user-id": user.id },
      });
      const data = await res.json();
      setFormData({
        fullName: data.full_name || "",
        username: data.username || "",
        email: data.email || "",
        location: data.location || "",
        bio: data.bio || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-role": user.role,
          "user-id": user.id,
        },
        body: JSON.stringify({
          full_name: formData.fullName,
          username: formData.username,
          email: formData.email,
          location: formData.location,
          bio: formData.bio,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Profile updated successfully!");
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Server error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      <p className="subtitle">View and manage your profile information</p>

      {error && <div className="profile-form error">{error}</div>}
      {success && <div className="profile-form success">{success}</div>}

      <div className="profile-layout">
        <div className="profile-sidebar">
          <div className="avatar">
            {formData.fullName
              ? formData.fullName.charAt(0).toUpperCase()
              : "?"}
          </div>
          <div className="name">{formData.fullName}</div>
          <div className="username">@{formData.username}</div>
          {user.role === "admin" && <span className="role-badge">Admin</span>}
          {formData.location && <p className="location">{formData.location}</p>}
          <p className="member-since">
            Member since:{" "}
            {user.created_at
              ? new Date(user.created_at).toLocaleDateString()
              : "N/A"}
          </p>
          {formData.bio && <p className="bio">{formData.bio}</p>}
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              placeholder="City, Country"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              placeholder="Tell others about yourself..."
              value={formData.bio}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button className="btn-save" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
