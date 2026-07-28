import { useState, useEffect } from "react";
import "./admin.css";

function ConfirmModal({ open, title, message, confirmLabel = "Delete", onConfirm, onCancel }) {
    if (!open) return null;

    return (
        <div className="confirm-overlay" onClick={onCancel}>
            <div className="confirm-card" onClick={(e) => e.stopPropagation()}>
                <span className="confirm-eyebrow">{title}</span>
                <p className="confirm-message">{message}</p>
                <div className="confirm-actions">
                    <button className="confirm-cancel-btn" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="confirm-delete-btn" onClick={onConfirm}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Admin() {

    const [users, setUsers] = useState([]);
    const [boards, setBoards] = useState([]);
    const [pendingDelete, setPendingDelete] = useState(null);

    const handleDeleteUser = async (userId) => {

        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/user/${userId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },

        });

        const data = await response.json();

        if (response.ok) {
            setUsers(users.filter(user => user.id !== userId))
        }

        else {
            console.log("Delete failed")
        }
    }

    const handleRoleChange = async (user) => {

        const token = localStorage.getItem("token");
        const endpoint =
            user.role === "admin" ? `${import.meta.env.VITE_API_URL}/admin/user/${user.id}/make-user` : `${import.meta.env.VITE_API_URL}/admin/user/${user.id}/make-admin`

        const response = await fetch(endpoint, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`
            },

        });

        const data = await response.json();
        if (response.ok) {
            setUsers(users.map(
                u => u.id === user.id ? {
                    ...u,
                    role: user.role === "admin" ? "user" : "admin",
                } :
                    u

            ));
        }
        else {
            console.log(data.detail);
        }


    }

    const handleDeleteBoard = async (boardId) => {

        const token = localStorage.getItem("token");

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/admin/boards/${boardId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        if (response.ok) {
            setBoards(prev =>
                prev.filter(board => board.id !== boardId)
            );
        } else {
            console.log(data.detail);
        }
    };

    const requestDelete = (type, id) => {
        setPendingDelete({ type, id });
    };

    const handleConfirmDelete = () => {
        if (!pendingDelete) return;

        if (pendingDelete.type === "user") {
            handleDeleteUser(pendingDelete.id);
        } else if (pendingDelete.type === "board") {
            handleDeleteBoard(pendingDelete.id);
        }

        setPendingDelete(null);
    };

    useEffect(() => {

        const fetchUsers = async () => {

            const token = localStorage.getItem("token");

            const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
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

            const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/boards`, {
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

            <section className="admin-section">
                <div className="admin-header">
                    <span className="admin-eyebrow">Control Room</span>
                    <h2>Users</h2>
                </div>

                <div className="users-list">
                    <div className="users-header">
                        <span>Email</span>
                        <span>Role</span>
                        <span>Actions</span>
                    </div>

                    {users.map((user) => (
                        <div className="user-row" key={user.id}>
                            <span>{user.email}</span>

                            <span className={`role-badge ${user.role}`}>
                                {user.role}
                            </span>

                            <div className="user-actions">
                                <button
                                    className="role-btn"
                                    onClick={() => handleRoleChange(user)}
                                >
                                    {user.role === "admin"
                                        ? "Make User"
                                        : "Make Admin"}
                                </button>

                                <button
                                    className="delete-btn"
                                    onClick={() => requestDelete("user", user.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="admin-section">
                <div className="admin-header">
                    <h2>Boards</h2>
                </div>

                <div className="users-list">
                    <div className="users-header">
                        <span>Name</span>
                        <span>Description</span>
                        <span>Actions</span>
                    </div>

                    {boards.map((board) => (
                        <div className="user-row" key={board.id}>
                            <span>{board.name}</span>

                            <span>{board.description || "-"}</span>

                            <div className="user-actions">
                                <button
                                    className="delete-btn"
                                    onClick={() => requestDelete("board", board.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <ConfirmModal
                open={!!pendingDelete}
                title={pendingDelete?.type === "user" ? "Delete user?" : "Delete board?"}
                message={
                    pendingDelete?.type === "user"
                        ? "This will permanently remove the user account. This can't be undone."
                        : "This will permanently remove the board. This can't be undone."
                }
                confirmLabel="Delete"
                onConfirm={handleConfirmDelete}
                onCancel={() => setPendingDelete(null)}
            />

        </div>
    );
}