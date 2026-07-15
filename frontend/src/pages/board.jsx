import "./board.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const TAPES = ["coral", "mustard", "sage", "blue"];

export default function Board() {
    const { boardId } = useParams();
    const navigate = useNavigate();

    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/boards/${boardId}/items`,
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
        };

        fetchItems();
    }, [boardId]);


    const handleDelete=async(itemId)=>{
        const token=localStorage.getItem("token");

        const response=await fetch(`${import.meta.env.VITE_API_URL}/items/${itemId}`,{

        
            method:"DELETE",
            headers:{
                Authorization:`Bearer ${token}`,
            },
    })

    if(response.ok){
        setItems(items.filter(item=>item.id!==itemId));
    }
    else
    {
        console.log("Delete Failed");
    }
        

    };

    return (
        <div className="board-page">
            <h1>Board Items</h1>

            <div className="items-grid">
                {items.map((item, i) => {
                    const tape = TAPES[i % TAPES.length];

                    return (
                        <div
                            className={`item-card tape-${tape}`}
                            key={item.id}
                            style={{ animationDelay: `${i * 0.06}s` }}
                        >
                            <div className="item-swatch" />

                            <div className="item-body">
                                <h3>{item.title}</h3>

                                <p className="item-note">
                                    {item.note || "No note"}
                                </p>

                                <span className="vibe-badge">
                                    {item.vibe}
                                </span>

                                <a
                                    className="open-link"
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Open <span className="arrow">↗</span>
                                </a>
                                <button className= "delete-btn"
                                onClick={()=>handleDelete(item.id)}>
                                    Delete
                                </button>

                                <button className="edit-btn"
                                onClick={()=> navigate(`/boards/${boardId}/items/${item.id}/edit`)}>
                                    EDIT
                                </button>
                            </div>
                        </div>
                    );
                })}

                <button
                    className="item-card add-card"
                    onClick={() => navigate(`/boards/${boardId}/items/new`)}
                >
                    <span className="add-icon">+</span>
                    <span>Add Item</span>
                </button>
            </div>
        </div>
    );
}