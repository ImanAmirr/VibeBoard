import { NavLink, Link } from "react-router-dom";
import { FaThumbtack } from "react-icons/fa";
import "./Appnavbar.css";

export default function AppNavbar() {
  return (
    <nav className="navbar">
      <Link to="/boards" className="logo">
        <FaThumbtack className="logo-icon" />
        <h2>VibeBoard</h2>
      </Link>

      <div className="nav-links">
        <NavLink
          to="/boards"
          className={({ isActive }) => isActive ? "active-link" : ""}
        >
          Boards
        </NavLink>
      </div>

      <div className="buttons">
        <div className="user-avatar">U</div>
        <button className="btn-ghost">Logout</button>
      </div>
    </nav>
  );
}