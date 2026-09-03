import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditBook = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    condition: "Good",
    owner_notes: "",
    title: "",
    author: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/books/${id}`);
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
      const res = await fetch(`http://localhost:5000/api/books/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-role": user.role,
        },
        body: JSON.stringify({
          condition: formData.condition,
          owner_notes: formData.owner_notes,
        }),
      });

      if (res.ok) {
        alert("Book updated successfully!");
        navigate("/dashboard");
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

  return (
    <div>
      <h1>Edit Book</h1>
      <p>
        Edit <strong>{formData.title}</strong> by {formData.author}
      </p>

      {error && <div>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <div>
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

          <div>
            <label>Owner Notes</label>
            <textarea
              name="owner_notes"
              placeholder="Add any notes for potential borrowers..."
              value={formData.owner_notes}
              onChange={handleChange}
              rows="3"
            />
          </div>
        </div>

        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Book"}
          </button>
          <button type="button" onClick={() => navigate("/dashboard")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBook;
