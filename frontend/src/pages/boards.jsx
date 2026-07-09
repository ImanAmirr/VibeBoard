import "./boards.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const TAPES = ["coral", "mustard", "sage", "blue"];

export default function Boards() {

    const navigate=useNavigate();

    const [boards, setBoards] = useState([]);

    useEffect(() => {

        const fetchBoards = async () => {

            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:8000/boards", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setBoards(data);
            } else {
                console.log(data.detail);
            }
        };

        fetchBoards();

    }, []);

    return (
        <div className="boards-page">
            <div className="boards-header">
                <div>
                    <span className="boards-eyebrow">Your Space</span>
                    <h1>Your Boards</h1>
                </div>

                <button className="new-board-btn"
                onClick={()=>navigate("/boards/new")}>
                    + New Board
                </button>

            </div>

            <div className="boards-grid">
                {boards.map((board, i) => {
                    const tape = TAPES[i % TAPES.length];
                    return (
                        <Link
                            to={`/boards/${board.id}/items`}
                            key={board.id}
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            <div className={`board-card tape-${tape}`}>
                                <h3>{board.name}</h3>

                                <span className="board-count">
                                    {board.description || "No description"}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}