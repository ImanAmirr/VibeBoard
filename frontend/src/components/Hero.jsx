import "./Hero.css";
import { Link } from "react-router-dom";

export default function Hero()
{ return(
    <section className="hero">
        <span className="hero-eyebrow">Mood Board</span>

        <h1>Discover ideas worth saving.
        Build boards that feel like you.</h1>

        <p>
        VibeBoard is a visual space where inspiration turns into organized collections — fast, simple, and beautiful.
        </p>
        <Link to ="./signup">
        <button>Get Started</button>
        </Link>

    </section>
    );
}