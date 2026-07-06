import "./auth.css";

export default function SignUp()
{
    return(
    <div className="auth-page">
        <div className="auth-card">
            <span className="auth-eyebrow">Get started</span>
            <h2>Register</h2>

            <input className="auth-input" placeholder="Email"/>
            <input className="auth-input" placeholder="Password" type="password"/>
            <button className="auth-button">Register</button>

            <p className="auth-switch">
                Already have an account? <a href="/login">Login</a>
            </p>
        </div>
    </div>
    );
}