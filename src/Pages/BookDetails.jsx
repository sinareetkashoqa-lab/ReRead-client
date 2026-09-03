import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const BookDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);

      //Fetch book details
      const bookRes = await fetch(`http://localhost:5000/api/books/${id}`);
      const bookData = await bookRes.json();
      setBook(bookData);

      //Fetch reviews for this book
      const reviewsRes = await fetch(
        `http://localhost:5000/api/reviews/book/${id}`,
      );
      const reviewsData = await reviewsRes.json();
      setReviews(reviewsData);
    } catch (error) {
      console.error("Error fetching book details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestBorrow = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setRequestLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/borrow-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-role": user.role,
        },
        body: JSON.stringify({
          book_id: book.id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Request sent successfully!");
        //Refresh book details to update availability
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
      const res = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-role": user.role,
        },
        body: JSON.stringify({
          book_id: book.id,
          comment: reviewText,
        }),
      });

      if (res.ok) {
        setReviewText("");
        setShowReviewForm(false);
        //Refresh reviews
        const reviewsRes = await fetch(
          `http://localhost:5000/api/reviews/book/${id}`,
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

  const coverImage =
    book.cover_image_url || "https://via.placeholder.com/300x400?text=No+Cover";

  return (
    <div>
      <Link to="/browse">← Back to Browse</Link>

      <div>
        {/*Book Cover*/}
        <div>
          <img src={coverImage} alt={book.title} />
        </div>

        {/*Book Info*/}
        <div>
          <h1>{book.title}</h1>
          <h3>by {book.author}</h3>
          <p>
            <strong>Genre:</strong> {book.genre}
          </p>
          <p>
            <strong>ISBN:</strong> {book.isbn || "N/A"}
          </p>
          <p>
            <strong>Condition:</strong> {book.condition || "Not specified"}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {book.is_available ? "Available" : "Borrowed"}
          </p>
          <p>
            <strong>Description:</strong>
          </p>
          <p>{book.description || "No description available"}</p>

          {/*Owner Info*/}
          <div>
            <h4>Owner</h4>
            <p>
              <strong>Name:</strong> {book.owner_name || "Unknown"}
            </p>
            <p>
              <strong>Location:</strong> {book.location || "Unknown"}
            </p>
            {book.owner_notes && (
              <p>
                <strong>Owner's Notes:</strong> {book.owner_notes}
              </p>
            )}
          </div>

          {/*Request Button*/}
          {book.is_available ? (
            <button onClick={handleRequestBorrow} disabled={requestLoading}>
              {requestLoading ? "Sending..." : "Request to Borrow"}
            </button>
          ) : (
            <p>This book is currently borrowed</p>
          )}
        </div>
      </div>

      {/*Reviews Section*/}
      <div>
        <h3>Reviews</h3>

        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to leave a review!</p>
        ) : (
          <div>
            {reviews.map((review) => (
              <div key={review.id}>
                <p>
                  <strong>{review.reviewer_name || "Anonymous"}</strong>
                </p>
                <p>{review.comment}</p>
                <p>
                  {review.created_at
                    ? new Date(review.created_at).toLocaleDateString()
                    : ""}
                </p>
                <hr />
              </div>
            ))}
          </div>
        )}

        {user && (
          <>
            {!showReviewForm ? (
              <button onClick={() => setShowReviewForm(true)}>
                Write a Review
              </button>
            ) : (
              <form onSubmit={handleAddReview}>
                <textarea
                  placeholder="Share your thoughts about this book..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows="4"
                />
                <button type="submit">Submit Review</button>
                <button type="button" onClick={() => setShowReviewForm(false)}>
                  Cancel
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
