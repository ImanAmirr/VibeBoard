import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./auth.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");

    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Enter a valid email address";
        }

        if (!password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setServerError("");

        if (!validate()) {
            return;
        }

        try {
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
                setServerError(data.detail || "Login failed");
            }
        } catch (err) {
            setServerError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="auth-page">
            <Link to="/" className="back-home">
                <span className="arrow">←</span> Back to Home
            </Link>

            <div className="auth-card">
                <span className="auth-eyebrow">Welcome back</span>

                <h2>Login</h2>

                <form onSubmit={handleLogin} noValidate>
                    <input
                        className={`auth-input ${errors.email ? "auth-input-error" : ""}`}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                        }}
                    />
                    {errors.email && <p className="auth-error">{errors.email}</p>}

                    <input
                        className={`auth-input ${errors.password ? "auth-input-error" : ""}`}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                        }}
                    />
                    {errors.password && <p className="auth-error">{errors.password}</p>}

                    {serverError && <p className="auth-server-error">{serverError}</p>}

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