import { NavLink, Link } from "react-router-dom";
import { FaThumbtack } from "react-icons/fa";
import { useState, useEffect } from "react";
import "./Appnavbar.css";

export default function AppNavbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data);
        console.log(data);
      } else {
        console.log(data.detail);
      }
    };

    fetchUser();
  }, []);

  return (
    <nav className="navbar">
      <Link to="/boards" className="logo">
        <FaThumbtack className="logo-icon" />
        <h2>VibeBoard</h2>
      </Link>

      <div className="nav-links">
        <NavLink
          to="/boards"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Boards
        </NavLink>

        <NavLink
          to="/me"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Profile
        </NavLink>

        {user?.role==="admin" &&(
          <NavLink
          to="/admin"
          className={({ isActive }) => (isActive ? "active-link" : "")}>
            Admin
          </NavLink>

        )}

        <NavLink
        to="/flashbacks"
        className={({ isActive }) => (isActive ? "active-link" : "")}>
           Flashbacks
        </NavLink>

        <NavLink
        to="/explore"
        className={({ isActive }) => (isActive ? "active-link" : "")}>
          Explore
          </NavLink>
      </div>

      <div className="buttons">
      <div className="user-avatar">
      <Link to="/me">{user?.email ? user.email[0].toUpperCase() : "U"}</Link>
     </div>

        <Link to="/">
          <button className="btn-ghost">Logout</button>
        </Link>
      </div>
    </nav>
  );
}