import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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

      //Fetch stats
      const statsRes = await fetch("http://localhost:5000/api/users/stats", {
        headers: { "x-role": user.role },
      });
      const statsData = await statsRes.json();
      setStats(statsData);

      //Fetch user's books
      const booksRes = await fetch("http://localhost:5000/api/books/my-books", {
        headers: { "x-role": user.role },
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
      await fetch(`http://localhost:5000/api/books/${id}`, {
        method: "DELETE",
        headers: { "x-role": user.role },
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
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.full_name || user?.username}!</p>

      {/*Stats Cards*/}
      <div>
        <div>
          <h3>{stats.booksOwned}</h3>
          <p>Books Owned</p>
        </div>
        <div>
          <h3>{stats.booksBorrowed}</h3>
          <p>Books Borrowed</p>
        </div>
        <div>
          <h3>{stats.pendingRequests}</h3>
          <p>Pending Requests</p>
        </div>
        <div>
          <h3>{stats.reviewsWritten}</h3>
          <p>Reviews Written</p>
        </div>
      </div>

      {/*Browse*/}
      <Link to="/browse">
        <div>
          <h2>Browse Community Books</h2>
          <p>Discover books from your neighbors</p>
        </div>
      </Link>

      {/*My Books*/}
      <div>
        <h2>My Books</h2>
        <Link to="/my-books/add">
          <button>Add New Book</button>
        </Link>

        {myBooks.length === 0 ? (
          <p>You haven't added any books yet.</p>
        ) : (
          <table>
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
                  <td>
                    <Link to={`/books/${book.id}`}>{book.title}</Link>
                  </td>
                  <td>{book.author}</td>
                  <td>{book.is_available ? "Available" : "Borrowed"}</td>
                  <td>
                    <Link to={`/my-books/edit/${book.id}`}>
                      <button>Edit</button>
                    </Link>
                    <button onClick={() => deleteBook(book.id)}>Delete</button>
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
