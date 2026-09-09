import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import BrowseBooks from "./Pages/BrowseBooks";
import BookDetails from "./Pages/BookDetails";
import BorrowRequests from "./Pages/BorrowRequests";
import Profile from "./Pages/Profile";
import Settings from "./Pages/Settings";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminBooks from "./Pages/AdminBooks";
import AdminRequests from "./Pages/AdminRequests";
import NotFound from "./Pages/NotFound";
import AddBook from "./Pages/AddBook";
import EditBook from "./Pages/EditBook";

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
