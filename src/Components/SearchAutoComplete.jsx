import { useState, useEffect, useRef } from "react";

const SearchAutocomplete = ({ onSelect, placeholder }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    // Close suggestions when clicking outside
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length >= 2) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const fetchSuggestions = async (searchQuery) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/books/fetch-search?q=${encodeURIComponent(searchQuery)}`,
      );
      const data = await res.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (book) => {
    setQuery(book.title);
    setShowSuggestions(false);
    onSelect(book);
  };

  return (
    <div ref={wrapperRef}>
      <input
        type="text"
        placeholder={placeholder || "Search for a book..."}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (suggestions.length > 0) setShowSuggestions(true);
        }}
      />
      {loading && <div>Loading...</div>}
      {showSuggestions && suggestions.length > 0 && (
        <div>
          {suggestions.map((book, index) => (
            <div key={index} onClick={() => handleSelect(book)}>
              <div>
                <img
                  src={
                    book.coverImage ||
                    "https://via.placeholder.com/40x60?text=No+Cover"
                  }
                  alt={book.title}
                  style={{ width: "40px", height: "60px", objectFit: "cover" }}
                />
                <div>
                  <strong>{book.title}</strong>
                  <p>by {book.author}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showSuggestions && suggestions.length === 0 && query.length >= 2 && (
        <div>
          <p>No books found.</p>
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
