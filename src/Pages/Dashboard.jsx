import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    booksOwned: 0,
    booksBorrowed: 0,
    pendingRequests: 0,
    reviewsWritten: 0,
  });
  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const statsRes = await fetch(`${API_BASE_URL}/api/users/stats`, {
        headers: { "x-role": user.role, "user-id": user.id },
      });
      const statsData = await statsRes.json();
      setStats(statsData);

      const booksRes = await fetch(`${API_BASE_URL}/api/books/my-books`, {
        headers: { "x-role": user.role, "user-id": user.id },
      });
      const booksData = await booksRes.json();
      setMyBooks(booksData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
      await fetch(`${API_BASE_URL}/api/books/${id}`, {
        method: "DELETE",
        headers: { "x-role": user.role, "user-id": user.id },
      });
      setMyBooks(myBooks.filter((book) => book.id !== id));
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p className="subtitle">Welcome, {user?.full_name || user?.username}!</p>

      <div className="stats-grid">
        <div className="stat-card">
          <h3 className="number green">{stats.booksOwned}</h3>
          <p className="label">Books Owned</p>
        </div>
        <div className="stat-card">
          <h3 className="number blue">{stats.booksBorrowed}</h3>
          <p className="label">Books Borrowed</p>
        </div>
        <div className="stat-card">
          <h3 className="number orange">{stats.pendingRequests}</h3>
          <p className="label">Pending Requests</p>
        </div>
        <div className="stat-card">
          <h3 className="number purple">{stats.reviewsWritten}</h3>
          <p className="label">Reviews Written</p>
        </div>
      </div>

      <Link to="/browse">
        <div className="browse-banner">
          <h2>Browse Community Books</h2>
          <p>Discover books from your neighbors</p>
        </div>
      </Link>

      <div className="my-books-section">
        <div className="my-books-header">
          <h2>My Books</h2>
          <Link to="/my-books/add">
            <button className="btn-add">Add New Book</button>
          </Link>
        </div>

        {myBooks.length === 0 ? (
          <p className="empty-state">You haven't added any books yet.</p>
        ) : (
          <table className="book-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myBooks.map((book) => (
                <tr key={book.id}>
                  <td className="book-title">
                    <Link to={`/books/${book.id}`}>{book.title}</Link>
                  </td>
                  <td>{book.author}</td>
                  <td>
                    <span
                      className={
                        book.is_available
                          ? "status-available"
                          : "status-borrowed"
                      }
                    >
                      {book.is_available ? "Available" : "Borrowed"}
                    </span>
                  </td>
                  <td>
                    <Link to={`/my-books/edit/${book.id}`}>
                      <button className="btn-edit">Edit</button>
                    </Link>
                    <button
                      className="btn-delete"
                      onClick={() => deleteBook(book.id)}
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
    </div>
  );
};

export default Dashboard;
