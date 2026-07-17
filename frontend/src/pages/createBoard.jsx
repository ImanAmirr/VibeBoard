import "./boards.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateBoard() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isPrivate, setIsPrivate] = useState(true);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");

    const validate = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = "Board name is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setServerError("");

        if (!validate()) return;

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${import.meta.env.VITE_API_URL}/boards`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name,
                    description: description || null,
                    is_private: isPrivate,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                navigate("/boards");
            } else {
                const message = typeof data.detail === "string" ? data.detail : "Please check your input and try again";
                setServerError(message);
            }
        } catch (err) {
            setServerError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="create-item-page">
            <div className="popup">
                <h2>Create Board</h2>

                <form onSubmit={handleCreate} noValidate>
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

                    <label className="visibility-toggle">
                        <input
                            type="checkbox"
                            checked={!isPrivate}
                            onChange={(e) => setIsPrivate(!e.target.checked)}
                        />
                        Make this board public (visible in Explore)
                    </label>

                    {serverError && <p className="form-error">{serverError}</p>}

                    <div className="button-group">
                        <button type="button" className="popup-cancel" onClick={() => navigate("/boards")}>
                            Cancel
                        </button>
                        <button type="submit" className="popup-create">
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}