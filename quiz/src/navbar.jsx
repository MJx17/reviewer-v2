import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/authContext";
import "./styles/navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setOpen(false);
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <header className="navbar">
      {/* ✅ Logo navigates to /home */}
      <Link to="/home" className="navbar-logo-link" onClick={() => setOpen(false)}>
        <h1 className="navbar-logo">Reviewer</h1>
      </Link>

      {/* Hamburger Button (mobile only) */}
      <button className="navbar-toggle" onClick={() => setOpen(!open)}>
        ☰
      </button>

      <nav className={`navbar-links ${open ? "open" : ""}`}>
        <NavLink
          to="/subjects"
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          onClick={() => setOpen(false)}
        >
          Subjects
        </NavLink>

        <NavLink
          to="/todos"
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          onClick={() => setOpen(false)}
        >
          Todo List
        </NavLink>

        <NavLink
          to="/notes"
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          onClick={() => setOpen(false)}
        >
          Notes
        </NavLink>

        <NavLink
          to="/flashcards"
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          onClick={() => setOpen(false)}
        >
          Flashcards
        </NavLink>

        {user && (
          <button className="nav-link-logout-btn mobile-logout" onClick={handleLogout}>
            Logout
          </button>
        )}
      </nav>

      {user && (
        <button className="nav-link-logout-btn desktop-logout" onClick={handleLogout}>
          Logout
        </button>
      )}
    </header>
  );
}
