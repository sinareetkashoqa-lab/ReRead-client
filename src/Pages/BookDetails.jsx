import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./BookDetails.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BookDetails = ({ user }) => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);

      const bookRes = await fetch(`${API_BASE_URL}/api/books/${id}`);
      const bookData = await bookRes.json();
      setBook(bookData);

      const reviewsRes = await fetch(`${API_BASE_URL}/api/reviews/book/${id}`);
      const reviewsData = await reviewsRes.json();
      setReviews(reviewsData);

      if (bookData.user_id !== user.id) {
        const requestsRes = await fetch(`${API_BASE_URL}/api/borrow-requests`, {
          headers: { "x-role": user.role, "user-id": user.id },
        });
        const requestsData = await requestsRes.json();
        const pending = requestsData.some(
          (r) => r.book_id === bookData.id && r.status === "pending",
        );
        setHasPendingRequest(pending);
      }
    } catch (error) {
      console.error("Error fetching book details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestBorrow = async () => {
    setRequestLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/borrow-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-role": user.role,
          "user-id": user.id,
        },
        body: JSON.stringify({
          book_id: book.id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Request sent successfully!");
        fetchBookDetails();
      } else {
        alert(data.message || "Failed to send request");
      }
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Server error. Please try again.");
    } finally {
      setRequestLoading(false);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-role": user.role,
          "user-id": user.id,
        },
        body: JSON.stringify({
          book_id: book.id,
          comment: reviewText,
        }),
      });

      if (res.ok) {
        setReviewText("");
        setShowReviewForm(false);
        const reviewsRes = await fetch(
          `${API_BASE_URL}/api/reviews/book/${id}`,
        );
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);
      } else {
        alert("Failed to add review");
      }
    } catch (error) {
      console.error("Error adding review:", error);
      alert("Server error. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading book details...</div>;
  }

  if (!book) {
    return <div>Book not found</div>;
  }

  const isOwner = book.user_id === user.id;

  const coverImage =
    book.cover_image_url || "https://via.placeholder.com/300x400?text=No+Cover";

  return (
    <div className="book-details">
      <p className="breadcrumb">
        <Link to="/browse">← Back to Browse</Link>
      </p>

      <div className="book-layout">
        <div className="cover">
          <img src={coverImage} alt={book.title} />
        </div>

        <div className="info">
          <span className="genre-badge">{book.genre}</span>
          <h1>{book.title}</h1>
          <h3 className="author">by {book.author}</h3>
          <div className="metadata">
            <p>
              <strong>ISBN:</strong> {book.isbn || "N/A"}
            </p>
          </div>
          <span className="condition">{book.condition || "Not specified"}</span>
          <span
            className={`availability ${book.is_available ? "available" : "borrowed"}`}
          >
            {book.is_available ? "Available" : "Borrowed"}
          </span>

          <p className="description">
            {book.description || "No description available"}
          </p>

          <div className="owner">
            <h4>Owner</h4>
            <p>
              <strong>Name:</strong> {book.owner_name || "Unknown"}
            </p>
            <p className="location">
              <strong>Location:</strong> {book.location || "Unknown"}
            </p>
          </div>
          {book.owner_notes && (
            <div className="owner-notes">
              <strong>Owner's Notes:</strong>
              <p>{book.owner_notes}</p>
            </div>
          )}

          {!isOwner &&
            (book.is_available ? (
              hasPendingRequest ? (
                <button className="btn-request" disabled>
                  Request Pending
                </button>
              ) : (
                <button
                  className="btn-request"
                  onClick={handleRequestBorrow}
                  disabled={requestLoading}
                >
                  {requestLoading ? "Sending..." : "Request to Borrow"}
                </button>
              )
            ) : (
              <p>This book is currently borrowed</p>
            ))}
        </div>
      </div>

      <div className="reviews-section">
        <h3>Reviews</h3>

        {reviews.length === 0 ? (
          <p className="no-reviews">
            {isOwner
              ? "No reviews yet."
              : "No reviews yet. Be the first to leave a review!"}
          </p>
        ) : (
          <div>
            {reviews.map((review) => (
              <div className="review-card" key={review.id}>
                <p className="reviewer">
                  {review.reviewer_name || "Anonymous"}
                </p>
                <p className="review-date">
                  {review.created_at
                    ? new Date(review.created_at).toLocaleDateString()
                    : ""}
                </p>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        {!isOwner && (
          <>
            {!showReviewForm ? (
              <button
                className="btn-write-review"
                onClick={() => setShowReviewForm(true)}
              >
                Write a Review
              </button>
            ) : (
              <form className="review-form" onSubmit={handleAddReview}>
                <textarea
                  placeholder="Share your thoughts about this book..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows="4"
                />
                <div>
                  <button className="btn-submit" type="submit">
                    Submit Review
                  </button>
                  <button
                    className="btn-cancel"
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
