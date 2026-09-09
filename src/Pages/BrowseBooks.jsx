import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./BrowseBooks.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BrowseBooks = ({ user }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState(["all"]);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    let result = [...books];

    if (user) {
      result = result.filter((book) => book.user_id !== user.id);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(term) ||
          book.author.toLowerCase().includes(term),
      );
    }

    if (genreFilter !== "all") {
      result = result.filter((book) => book.genre === genreFilter);
    }

    if (availabilityFilter === "available") {
      result = result.filter((book) => book.is_available);
    } else if (availabilityFilter === "borrowed") {
      result = result.filter((book) => !book.is_available);
    }

    setFilteredBooks(result);
  }, [books, searchTerm, genreFilter, availabilityFilter, user]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/books`);
      const data = await res.json();
      setBooks(data);
      setFilteredBooks(data);

      const uniqueGenres = [
        "all",
        ...new Set(data.map((book) => book.genre).filter(Boolean)),
      ];
      setGenres(uniqueGenres);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setGenreFilter("all");
    setAvailabilityFilter("all");
  };

  if (loading) {
    return <div className="browse-page">Loading books...</div>;
  }

  return (
    <div className="browse-page">
      <div className="browse-header">
        <h1>Browse Books</h1>
        <p className="subtitle">Discover books from your community</p>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title, author, or genre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn-search" onClick={() => {}}>
          Search
        </button>
        {searchTerm && (
          <button className="btn-clear" onClick={() => setSearchTerm("")}>
            Clear
          </button>
        )}
      </div>

      <div className="filters">
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre === "all" ? "All Genres" : genre}
            </option>
          ))}
        </select>

        <select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
        >
          <option value="all">All Books</option>
          <option value="available">Available Only</option>
          <option value="borrowed">Borrowed Only</option>
        </select>

        <button className="btn-clear-filters" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      <p className="results-count">Showing {filteredBooks.length} books</p>

      {filteredBooks.length === 0 ? (
        <p className="no-results">No books found. Try adjusting your search.</p>
      ) : (
        <div className="book-grid">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

const BookCard = ({ book, user }) => {
  const coverImage =
    book.cover_image_url || "https://via.placeholder.com/180x240?text=No+Cover";

  return (
    <div className="book-card">
      <img className="cover" src={coverImage} alt={book.title} />
      <div className="info">
        <div className="title">
          <Link to={`/books/${book.id}`}>{book.title}</Link>
        </div>
        <div className="author">by {book.author}</div>
        <div>
          <span className="genre">{book.genre}</span>
          {book.is_available ? (
            <span className="status available">Available</span>
          ) : (
            <span className="status borrowed">Borrowed</span>
          )}
        </div>
        <div className="owner">
          Owner: {book.owner_name || "Unknown"} • {book.location || "Unknown"}
        </div>
        <Link to={`/books/${book.id}`}>
          <button className="btn-view">View Details</button>
        </Link>
      </div>
    </div>
  );
};

export default BrowseBooks;