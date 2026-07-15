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

            const response = await fetch(`${import.meta.env.VITE_API_URL}/boards`, {
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

    const handleDelete=async(boardId)=>{

        const token=localStorage.getItem("token");
        const response=await fetch(`${import.meta.env.VITE_API_URL}/boards/${boardId}`,{
            method:"DELETE",
            headers:{
                Authorization:`Bearer ${token}`,
            },
        });

        if(response.ok){
            setBoards(boards.filter(board=>board.id!==boardId));
        }

        else{
            console.log("Delete Failed");
        }
    };

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

                                <div className="card-actions">
                                    <button className="edit-btn"
                                    onClick={(e)=>{e.preventDefault();
                                    navigate(`/boards/${board.id}/edit`)}}>
                                        Edit
                                    </button>
                                    <button className="delete-btn"
                                    onClick={(e)=>{e.preventDefault();
                                    handleDelete(board.id)}}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}