import "./boards.css";
import { useState,useEffect } from "react";
import { Link,useNavigate,useParams } from "react-router-dom";

export default function EditBoard(){

   const{boardId}=useParams();
   const navigate = useNavigate();
   const[name,setName]=useState("");
   const[description,setDescription]=useState("");

   useEffect(()=>{

    const fetchBoard = async()=>{
        const token=localStorage.getItem("token");

        const response= await fetch(`${import.meta.env.VITE_API_URL}/boards/${boardId}`,{
            headers:{
                Authorization:`Bearer ${token}`,
            },

        });

        const data= await response.json()

        if(response.ok){
            setName(data.name);
            setDescription(data.description);
        }

        else{
            console.log(data.detail);

        }


    };

    fetchBoard();
   },[boardId]);

   const handleEditBoard= async(e)=>{

    e.preventDefault();

    const token=localStorage.getItem("token");
    const response=await fetch(`${import.meta.env.VITE_API_URL}/boards/${boardId}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`,
        },
        body:JSON.stringify({
            name,
            description,

        }),

    });

    const data=await response.json();

    if(response.ok){
        navigate("/boards");
    }
    else{
        console.log(data.detail);
    }
   }
   return (
    <div className="create-item-page">
        <div className="popup">
            <h2>Edit Board</h2>

            <input
                placeholder="Board Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <button onClick={handleEditBoard}>
                Save Changes
            </button>

            <button onClick={() => navigate("/boards")}>
                Cancel
            </button>
        </div>
    </div>
);
}
