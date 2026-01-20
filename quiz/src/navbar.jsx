import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
      <h1 className="navbar-logo">Reviewer</h1>

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

        {/* ✅ Logout (only shown inside mobile menu) */}
        {user && (
          <button className="nav-link-logout-btn mobile-logout" onClick={handleLogout}>
            Logout
          </button>
        )}
      </nav>

      {/* Logout button for desktop */}
      {user && <button className="nav-link-logout-btn desktop-logout" onClick={handleLogout}>Logout</button>}
    </header>


  );
}
