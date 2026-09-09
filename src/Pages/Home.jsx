import { Link } from "react-router-dom";
import booksHero from "../assets/books-hero.jpg";
import "./Home.css";

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="home-hero">
        <div
          className="hero-bg"
          style={{ backgroundImage: `url(${booksHero})` }}
        ></div>
        <div className="hero-content">
          <h1>ReRead</h1>
          <p>Share Books. Build Community. Read Together.</p>
          <div className="btn-group">
            <Link to="/browse">
              <button className="btn btn-outline">Browse Books</button>
            </Link>
            <Link to="/register">
              <button className="btn btn-primary">Get Started</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="home-features">
        <div className="feature">
          <div className="icon">📖</div>
          <h3>Borrow Books</h3>
          <p>Discover thousands of books from neighbors in your community.</p>
        </div>
        <div className="feature">
          <div className="icon">📚</div>
          <h3>Lend Your Books</h3>
          <p>Share your personal book collection with the community.</p>
        </div>
        <div className="feature">
          <div className="icon">🌍</div>
          <h3>Build Community</h3>
          <p>Connect with fellow book lovers and share recommendations.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
