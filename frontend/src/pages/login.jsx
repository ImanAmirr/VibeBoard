import { Link } from "react-router-dom";
import "./Auth.css";

export default function Login() {
    return (
        <div className="auth-page">

            <Link to="/" className="back-home">
                ← Back to Home
            </Link>

            <div className="auth-card">
                <span className="auth-eyebrow">Welcome back</span>

                <h2>Login</h2>

                <input
                    className="auth-input"
                    type="email"
                    placeholder="Email"
                />

                <input
                    className="auth-input"
                    type="password"
                    placeholder="Password"
                />

                <button className="auth-button">
                    Login
                </button>

                <p className="auth-switch">
                    Don't have an account?{" "}
                    <Link to="/signup">Register</Link>
                </p>
            </div>

        </div>
    );
}