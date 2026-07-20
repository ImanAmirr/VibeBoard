import "./explore.css";
import { useState, useEffect } from "react";

export default function Explore() {

    const [boards, setBoards] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [items, setItems] = useState([]);
    const [toast, setToast] = useState("");

    useEffect(() => {

        const fetchData = async () => {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/explore`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setItems(data);
            } else {
                console.log(data.detail);
            }

            const boardsResponse = await fetch(
                `${import.meta.env.VITE_API_URL}/boards`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const boardsData = await boardsResponse.json();

            if (boardsResponse.ok) {
                setBoards(boardsData);
            } else {
                console.log(boardsData.detail);
            };
        };

        fetchData();

    }, []);

    const saveToBoard = async (boardId) => {

        const token = localStorage.getItem("token");

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/items`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: selectedItem.title,
                    url: selectedItem.url,
                    vibe: selectedItem.vibe,
                    note: selectedItem.note,
                    board_id: boardId,
                    is_saved_copy: true,
                }),
            }
        );

        const data = await response.json();

        if (response.ok) {
            setSelectedItem(null);
            setToast("Item saved!");
            setTimeout(() => setToast(""), 2500);
        } else {
            setToast(data.detail || "Couldn't save item");
            setTimeout(() => setToast(""), 2500);
        }
    };

    return (
        <div className="explore-page">

            {items.length === 0 && (
                <p>No items to explore yet.</p>
            )}

            {items.map(item => (

                <div className="explore-card" key={item.id}>

                    {item.is_image && (
                        <img
                            src={item.url}
                            alt={item.title}
                            className="explore-image"
                        />
                    )}

                    <h3>{item.title}</h3>

                    <p>{item.vibe}</p>

                    {item.note && (
                        <p>{item.note}</p>
                    )}

                    <button
                        className="save-button"
                        onClick={() => setSelectedItem(item)}
                    >
                        Save to Board
                    </button>

                    {!item.is_image && (

                        <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Visit link
                        </a>
                    )}

                </div>

            ))}

            {selectedItem && (
                <div className="popup-overlay" onClick={() => setSelectedItem(null)}>
                    <div className="popup board-picker-popup" onClick={(e) => e.stopPropagation()}>
                        <span className="popup-eyebrow">Save Item</span>
                        <h2 className="board-picker-title">Choose a board</h2>

                        {boards.map((board) => (
                            <button
                                key={board.id}
                                className="board-button"
                                onClick={() => saveToBoard(board.id)}
                            >
                                {board.name}
                            </button>
                        ))}

                        <button
                            className="cancel-button"
                            onClick={() => setSelectedItem(null)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {toast && (
                <div className="toast">
                    {toast}
                </div>
            )}

        </div>
    );
}