import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BrowseBooks from "./pages/BrowseBooks";
import BookDetails from "./pages/BookDetails";
import BorrowRequests from "./pages/BorrowRequests";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onLogin={handleLogin} />} />
        <Route path="/browse" element={<BrowseBooks user={user} />} />
        <Route path="/books/:id" element={<BookDetails user={user} />} />

        <Route
          path="/dashboard"
          element={
            user ? <Dashboard user={user} /> : <Login onLogin={handleLogin} />
          }
        />

        <Route
          path="/borrow-requests"
          element={
            user ? (
              <BorrowRequests user={user} />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        <Route
          path="/profile"
          element={
            user ? (
              <Profile user={user} setUser={setUser} />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        <Route
          path="/my-books/add"
          element={
            user ? <AddBook user={user} /> : <Login onLogin={handleLogin} />
          }
        />

        <Route
          path="/my-books/edit/:id"
          element={
            user ? <EditBook user={user} /> : <Login onLogin={handleLogin} />
          }
        />

        <Route
          path="/settings"
          element={
            user ? <Settings user={user} /> : <Login onLogin={handleLogin} />
          }
        />

        <Route
          path="/admin"
          element={
            user?.role === "admin" ? (
              <AdminDashboard user={user} />
            ) : (
              <Dashboard user={user} />
            )
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <h3>Footer</h3>
    </Router>
  );
}

export default App;
