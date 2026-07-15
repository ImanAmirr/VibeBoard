import "./board.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditItem() {

    const { boardId, itemId } = useParams();
    console.log("boardId:", boardId);
    console.log("itemId:", itemId);
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [vibe, setVibe] = useState("");
    const [note, setNote] = useState("");

    useEffect(() => {

        const fetchItem = async () => {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/items/${itemId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setTitle(data.title);
                setUrl(data.url);
                setVibe(data.vibe);
                setNote(data.note);
            } else {
                console.log(data.detail);
            }
        };

        fetchItem();

    }, [itemId]);

    const handleEdit = async (e) => {

        e.preventDefault();

        const token = localStorage.getItem("token");

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/items/${itemId}`,
            {
                method: "PUT",
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
            }
        );

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
                <h2>Edit Item</h2>

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

<div className="button-group">
                    <button
                        className="popup-cancel"
                        onClick={() => navigate(`/boards/${boardId}/items`)}
                    >
                        Cancel
                    </button>

                    <button className="popup-create" onClick={handleEdit}>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}