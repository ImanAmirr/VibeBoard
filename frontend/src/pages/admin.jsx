import { useState, useEffect } from "react";
import "./admin.css";

export default function Admin() {

    const [users, setUsers] = useState([]);
    const [boards, setBoards] = useState([]);

    useEffect(() => {

        const fetchUsers = async () => {

            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:8000/admin/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setUsers(data);
            } else {
                console.log(data.detail);
            }
        };

        const fetchBoards = async () => {

            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:8000/admin/boards", {
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

        fetchUsers();
        fetchBoards();

    }, []);

    return (
        <div className="admin-page">
            <h1>Admin Panel</h1>
        </div>
    );
}