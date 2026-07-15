import "./auth.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SignUp() {

    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");

    const navigate=useNavigate()

    const handleSignup = async() => {
        const response=await fetch(`${import.meta.env.VITE_API_URL}/signup`,{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                email:email,
                password:password
            }),
        });

        const data=await response.json();
        if(response.ok)
        {
            navigate("/login");
        }
        else{
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

                <input className="auth-input"
                 placeholder="Email"
                 type="email" 
                 value={email}
                 onChange={(e)=>setEmail(e.target.value)}
                 />

                <input className="auth-input" 
                 placeholder="Password"
                 type="password" 
                 value={password}
                 onChange={(e)=>setPassword(e.target.value)}
                 />

                <button className="auth-button"
                onClick={handleSignup}>
                    Register
                </button>

                <p className="auth-switch">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>

        </div>
    );
}