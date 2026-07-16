import "./auth.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SignUp() {
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
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setServerError("");

        if (!validate()) {
            return;
        }

        try {
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
                setServerError(data.detail || "Sign up failed");
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
                <span className="auth-eyebrow">Get started</span>
                <h2>Register</h2>

                <form onSubmit={handleSignup} noValidate>
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