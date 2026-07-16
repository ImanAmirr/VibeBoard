import "./auth.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        const response = await fetch(`${import.meta.env.VITE_API_URL}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            navigate("/login");
        } else {
            alert(data.detail);
        }
    };

    return (
        <div className="auth-page">
            <Link to="/" className="back-home">
                <span className="arrow">←</span> Back to Home
            </Link>

            <div className="auth-card">
                <span className="auth-eyebrow">Get started</span>
                <h2>Register</h2>

                <form onSubmit={handleSignup}>
                    <input
                        className="auth-input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        className="auth-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button className="auth-button" type="submit">
                        Register
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}