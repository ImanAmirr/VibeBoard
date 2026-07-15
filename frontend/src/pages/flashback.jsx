import "./flashback.css";
import { useState, useEffect } from "react";

export default function Flashback() {

    const [flashbacks, setFlashbacks] = useState([]);

    useEffect(() => {

        const fetchFlashbacks = async () => {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/flashbacks`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setFlashbacks(data);
            } else {
                console.log(data.detail);
            }
        };

        fetchFlashbacks();

    }, []);

    return (
        <div className="flashbacks-page">

        {flashbacks.length === 0 && (
    <p>No flashbacks yet.</p>
    )}

            {flashbacks.map(flashback => (
                <div className="flashback-card" key={flashback.id}>
                    <h3>{flashback.title}</h3>

                    <p>{flashback.message}</p>

                    <span>{flashback.vibe}</span>

                    <small>
                        {new Date(flashback.created_at).toLocaleDateString()}
                    </small>
                </div>
            ))}

        </div>

    );
}