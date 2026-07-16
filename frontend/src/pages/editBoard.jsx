import "./boards.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditBoard() {

    const { boardId } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchBoard = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/boards/${boardId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setName(data.name);
                    setDescription(data.description || "");
                } else {
                    const message = typeof data.detail === "string"
                        ? data.detail
                        : "Couldn't load board";
                    setServerError(message);
                }
            } catch (err) {
                setServerError("Something went wrong. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchBoard();
    }, [boardId]);

    const validate = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = "Board name is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEditBoard = async (e) => {

        e.preventDefault();
        setServerError("");

        if (!validate()) {
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${import.meta.env.VITE_API_URL}/boards/${boardId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name,
                    description,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                navigate("/boards");
            } else {
                const message = typeof data.detail === "string"
                    ? data.detail
                    : "Please check your input and try again";
                setServerError(message);
            }
        } catch (err) {
            setServerError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="create-item-page">
            <div className="popup">
                <h2>Edit Board</h2>

                {loading ? (
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#6b6552" }}>
                        Loading board...
                    </p>
                ) : (
                    <form onSubmit={handleEditBoard} noValidate>
                        <input
                            className={errors.name ? "input-error" : ""}
                            placeholder="Board Name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                            }}
                        />
                        {errors.name && <p className="field-error">{errors.name}</p>}

                        <input
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        {serverError && <p className="form-error">{serverError}</p>}

                        <div className="button-group">
                            <button
                                type="button"
                                className="popup-cancel"
                                onClick={() => navigate("/boards")}
                            >
                                Cancel
                            </button>

                            <button type="submit" className="popup-create">
                                Save Changes
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}