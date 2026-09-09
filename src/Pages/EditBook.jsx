import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./EditBook.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditBook = ({ user }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    condition: "Good",
    owner_notes: "",
    title: "",
    author: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/books/${id}`);
      const data = await res.json();
      setFormData({
        condition: data.condition || "Good",
        owner_notes: data.owner_notes || "",
        title: data.title || "",
        author: data.author || "",
      });
    } catch (error) {
      console.error("Error fetching book:", error);
      setError("Failed to load book");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/books/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-role": user.role,
          "user-id": user.id,
        },
        body: JSON.stringify({
          condition: formData.condition,
          owner_notes: formData.owner_notes,
        }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to update book");
      }
    } catch (error) {
      console.error("Error updating book:", error);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading book...</div>;
  }

  if (success) {
    return (
      <div className="edit-book-page success-screen">
        <h1>Book Updated!</h1>
        <p className="book-info">
          <strong>{formData.title}</strong> has been updated successfully.
        </p>
        <div className="form-actions">
          <Link to="/dashboard">
            <button className="btn-update">Back to Dashboard</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-book-page">
      <h1>Edit Book</h1>
      <p className="book-info">
        Edit <strong>{formData.title}</strong> by {formData.author}
      </p>

      {error && <div className="error">{error}</div>}

      <form className="edit-book-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Condition</label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
          >
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
        </div>

        <div className="form-group">
          <label>Owner Notes</label>
          <textarea
            name="owner_notes"
            placeholder="Add any notes for potential borrowers..."
            value={formData.owner_notes}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button className="btn-update" type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Book"}
          </button>
          <Link to="/dashboard">
            <button className="btn-cancel" type="button">
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EditBook;
