import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
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
import AdminBooks from "./pages/AdminBooks";
import AdminRequests from "./pages/AdminRequests";
import NotFound from "./pages/NotFound";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <Router>
      <div className="app-shell">
        <Navbar user={user} onLogout={handleLogout} />

        <div className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route
              path="/register"
              element={<Register onLogin={handleLogin} />}
            />

            <Route
              path="/browse"
              element={
                !user ? (
                  <Login onLogin={handleLogin} />
                ) : user.role === "admin" ? (
                  <AdminDashboard user={user} />
                ) : (
                  <BrowseBooks user={user} />
                )
              }
            />
            <Route
              path="/books/:id"
              element={
                !user ? (
                  <Login onLogin={handleLogin} />
                ) : user.role === "admin" ? (
                  <AdminDashboard user={user} />
                ) : (
                  <BookDetails user={user} />
                )
              }
            />

            <Route
              path="/dashboard"
              element={
                !user ? (
                  <Login onLogin={handleLogin} />
                ) : user.role === "admin" ? (
                  <AdminDashboard user={user} />
                ) : (
                  <Dashboard user={user} />
                )
              }
            />

            <Route
              path="/borrow-requests"
              element={
                !user ? (
                  <Login onLogin={handleLogin} />
                ) : user.role === "admin" ? (
                  <AdminDashboard user={user} />
                ) : (
                  <BorrowRequests user={user} />
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
                user ? (
                  <EditBook user={user} />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />

            <Route
              path="/settings"
              element={
                user ? (
                  <Settings user={user} />
                ) : (
                  <Login onLogin={handleLogin} />
                )
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

            <Route
              path="/admin/books"
              element={
                user?.role === "admin" ? (
                  <AdminBooks user={user} />
                ) : (
                  <Dashboard user={user} />
                )
              }
            />

            <Route
              path="/admin/requests"
              element={
                user?.role === "admin" ? (
                  <AdminRequests user={user} />
                ) : (
                  <Dashboard user={user} />
                )
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
