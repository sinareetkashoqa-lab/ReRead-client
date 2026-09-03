import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BrowseBooks = ({ user }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Get unique genres from books
  const genres = [
    "all",
    ...new Set(books.map((book) => book.genre).filter(Boolean)),
  ];

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    //Apply filters whenever books, searchTerm, genreFilter, or availabilityFilter change
    let result = [...books];

    //Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(term) ||
          book.author.toLowerCase().includes(term),
      );
    }

    // Genre filter
    if (genreFilter !== "all") {
      result = result.filter((book) => book.genre === genreFilter);
    }

    // Availability filter
    if (availabilityFilter === "available") {
      result = result.filter((book) => book.is_available);
    } else if (availabilityFilter === "borrowed") {
      result = result.filter((book) => !book.is_available);
    }

    setFilteredBooks(result);
  }, [books, searchTerm, genreFilter, availabilityFilter]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/books");
      const data = await res.json();
      setBooks(data);
      setFilteredBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading books...</div>;
  }

  return (
    <div>
      <h1>Browse Books</h1>
      <p>Discover books from your community</p>

      {/* Search Bar */}
      <div>
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => setSearchTerm("")}>Clear</button>
      </div>

      {/* Filters */}
      <div>
        <div>
          <label>Genre:</label>
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
        </div>

        <div>
          <label>Availability:</label>
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
          >
            <option value="all">All Books</option>
            <option value="available">Available Only</option>
            <option value="borrowed">Borrowed Only</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <p>Showing {filteredBooks.length} books</p>

      {/* Book Grid */}
      {filteredBooks.length === 0 ? (
        <p>No books found. Try adjusting your search.</p>
      ) : (
        <div>
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

// Book Card Component
const BookCard = ({ book, user }) => {
  const coverImage =
    book.cover_image_url || "https://via.placeholder.com/180x240?text=No+Cover";

  return (
    <div>
      <img src={coverImage} alt={book.title} />
      <div>
        <h3>
          <Link to={`/books/${book.id}`}>{book.title}</Link>
        </h3>
        <p>by {book.author}</p>
        <p>{book.genre}</p>
        <p>{book.is_available ? "Available" : "Borrowed"}</p>
        <p>Owner: {book.owner_name || "Unknown"}</p>
        <p>Location: {book.location || "Unknown"}</p>
        <Link to={`/books/${book.id}`}>
          <button>View Details</button>
        </Link>
      </div>
    </div>
  );
};

export default BrowseBooks;
