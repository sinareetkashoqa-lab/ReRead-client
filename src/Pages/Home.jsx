import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>ReRead</h1>
      <p>Share Books. Build Community. Read Together.</p>
      <Link to="/browse">Browse Books</Link>
      <Link to="/register">Get Started</Link>
    </div>
  );
};

export default Home;
