import "./board.css";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function CreateItem() {
    const { boardId } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [vibe, setVibe] = useState("");
    const [note, setNote] = useState("");

    const handleItem = async (e) => {

        e.preventDefault();

        const token = localStorage.getItem("token");

        const response = await fetch(`${import.meta.env.VITE_API_URL}/items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                title,
                url,
                vibe,
                note,
                board_id: boardId,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            navigate(`/boards/${boardId}/items`);
        } else {
            console.log(data.detail);
        }
    };

    return (
        <div className="create-item-page">
            <div className="popup">
                <h2>Create Item</h2>

                <input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <input
                    placeholder="URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />

                <input
                    placeholder="Vibe"
                    value={vibe}
                    onChange={(e) => setVibe(e.target.value)}
                />

                <input
                    placeholder="Note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />

                <button onClick={handleItem}>
                    Create
                </button>

                <button
                    onClick={() =>
                        navigate("/boards")
                    }
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}