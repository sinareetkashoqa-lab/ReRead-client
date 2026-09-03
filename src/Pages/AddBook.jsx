import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchAutocomplete from "../components/SearchAutocomplete";

const AddBook = ({ user }) => {
  const navigate = useNavigate();
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

    // Validate required fields
    if (!formData.title || !formData.author) {
      setError("Please select a book from the search results");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-role": user.role,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Book added successfully!");
        navigate("/dashboard");
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

  return (
    <div>
      <h1>Add New Book</h1>
      <p>Search for a book and add it to your library</p>

      {error && <div>{error}</div>}

      <form onSubmit={handleSubmit}>
        {/*Search/Autocomplete*/}
        <div>
          <label>Search for a Book</label>
          <SearchAutocomplete
            onSelect={handleSelect}
            placeholder="Type a book title..."
          />
          <small>Search by title to auto-fill book details</small>
        </div>

        {/*Auto-filled fields (read-only)*/}
        <div>
          <div>
            <label>Title</label>
            <input type="text" value={formData.title} readOnly disabled />
          </div>

          <div>
            <label>Author</label>
            <input type="text" value={formData.author} readOnly disabled />
          </div>

          <div>
            <label>Genre</label>
            <input type="text" value={formData.genre} readOnly disabled />
          </div>

          <div>
            <label>Description</label>
            <textarea value={formData.description} readOnly disabled rows="3" />
          </div>

          <div>
            <label>Cover Image</label>
            {formData.cover_image_url ? (
              <div>
                <img
                  src={formData.cover_image_url}
                  alt={formData.title}
                  style={{
                    width: "100px",
                    height: "140px",
                    objectFit: "cover",
                  }}
                />
              </div>
            ) : (
              <p>No cover image available</p>
            )}
          </div>
        </div>

        {/*Editable fields*/}
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
            <small>
              Optional: Add condition details or borrowing instructions
            </small>
          </div>
        </div>

        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Adding Book..." : "Add Book"}
          </button>
          <button type="button" onClick={() => navigate("/dashboard")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;
