import "./board.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateBoard() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleCreate = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        const response = await fetch(`${import.meta.env.VITE_API_URL}/boards`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name,
                description: description || null,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            navigate("/boards");
        } else {
            console.log(data.detail);
        }
    };

    return (
        <div className="create-item-page">
            <div className="popup">
                <h2>Create Board</h2>

                <form onSubmit={handleCreate}>
                    <input
                        placeholder="Board Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <input
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <button type="submit">
                        Create
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/boards")}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}