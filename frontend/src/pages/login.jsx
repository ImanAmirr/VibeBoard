import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./auth.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
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
            localStorage.setItem("token", data.token);
            navigate("/boards");
        } else {
            alert(data.detail);
        }
    };

    return (
        <div className="auth-page">
            <Link to="/" className="back-home">
                ← Back to Home
            </Link>

            <div className="auth-card">
                <span className="auth-eyebrow">Welcome back</span>

                <h2>Login</h2>

                <form onSubmit={handleLogin}>
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
                        Login
                    </button>
                </form>

                <p className="auth-switch">
                    Don't have an account?{" "}
                    <Link to="/signup">Register</Link>
                </p>
            </div>
        </div>
    );
}