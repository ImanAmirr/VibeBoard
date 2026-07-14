import "./Navbar.css";
import { FaThumbtack } from "react-icons/fa";
import {Link} from "react-router-dom";
import { Router } from "react-router-dom";

export default function Navbar()
{ return(
    <nav className="navbar">
        <div className="logo">
        <FaThumbtack className="logo-icon" />
        <h1>VibeBoard</h1>   
        </div>

        <div className="buttons">
            <Link to ="/login">
            <button className="btn-ghost">Login</button>
            </Link>
            <Link to ="/signup">
            <button className="btn-solid">Register</button>
            </Link>
        </div>
    </nav>
    );
}