import { useState } from "react";
import { Link } from "react-router-dom";
import SearchAutocomplete from "../components/SearchAutoComplete";
import "./AddBook.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddBook = ({ user }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    cover_image_url: "",
    isbn: "",
    condition: "Good",
    owner_notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSelect = (book) => {
    setFormData({
      ...formData,
      title: book.title || "",
      author: book.author || "",
      genre: book.genre || "",
      description: book.description || "",
      cover_image_url: book.coverImage || "",
      isbn: book.isbn || "",
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.title || !formData.author) {
      setError("Please select a book from the search results");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-role": user.role,
          "user-id": user.id,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.message || "Failed to add book");
      }
    } catch (error) {
      console.error("Error adding book:", error);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="add-book-page success-screen">
        <h1>Book Added!</h1>
        <p>
          <strong>{formData.title}</strong> has been added to your library.
        </p>
        <div className="form-actions">
          <Link to="/dashboard">
            <button className="btn-submit">Back to Dashboard</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="add-book-page">
      <h1>Add New Book</h1>
      <p className="subtitle">Search for a book and add it to your library</p>

      {error && <div className="error">{error}</div>}

      <form className="add-book-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Search for a Book</label>
          <SearchAutocomplete
            onSelect={handleSelect}
            placeholder="Type a book title..."
          />
          <small className="hint">
            Search by title to auto-fill book details
          </small>
        </div>

        <div className="form-group">
          <label>Title</label>
          <input type="text" value={formData.title} readOnly disabled />
        </div>

        <div className="form-group">
          <label>Author</label>
          <input type="text" value={formData.author} readOnly disabled />
        </div>

        <div className="form-group">
          <label>Genre</label>
          <input type="text" value={formData.genre} readOnly disabled />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea value={formData.description} readOnly disabled rows="3" />
        </div>

        <div className="form-group">
          <label>Cover Image</label>
          {formData.cover_image_url ? (
            <div>
              <img
                className="cover-preview"
                src={formData.cover_image_url}
                alt={formData.title}
              />
            </div>
          ) : (
            <p>No cover image available</p>
          )}
        </div>

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
          <small className="hint">
            Optional: Add condition details or borrowing instructions
          </small>
        </div>

        <div className="form-actions">
          <button className="btn-submit" type="submit" disabled={loading}>
            {loading ? "Adding Book..." : "Add Book"}
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

export default AddBook;
