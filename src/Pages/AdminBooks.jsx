import { useState, useEffect } from "react";
import "./AdminBooks.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminBooks = ({ user }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const filtered = books.filter(
        (b) =>
          b.title.toLowerCase().includes(term) ||
          b.author.toLowerCase().includes(term) ||
          (b.owner_name && b.owner_name.toLowerCase().includes(term)),
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks(books);
    }
  }, [searchTerm, books]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/admin/books`, {
        headers: { "x-role": user.role },
      });
      const data = await res.json();
      setBooks(data);
      setFilteredBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!confirm("Delete this book permanently? This cannot be undone."))
      return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/books/${bookId}`, {
        method: "DELETE",
        headers: { "x-role": user.role },
      });

      if (res.ok) {
        alert("Book deleted");
        fetchBooks();
      } else {
        alert("Failed to delete book");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Server error. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading books...</div>;
  }

  return (
    <div className="admin-books-page">
      <h1>All Books</h1>
      <p className="subtitle">View and manage every book in the system</p>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title, author, or owner..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button className="btn-clear" onClick={() => setSearchTerm("")}>
            Clear
          </button>
        )}
      </div>

      <p>Showing {filteredBooks.length} books</p>

      {filteredBooks.length === 0 ? (
        <p className="empty-state">No books found</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.owner_name}</td>
                <td>
                  <span
                    className={
                      b.is_available ? "status-available" : "status-borrowed"
                    }
                  >
                    {b.is_available ? "Available" : "Borrowed"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteBook(b.id)}
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

export default AdminBooks;
