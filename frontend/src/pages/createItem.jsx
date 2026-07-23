import "./board.css";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function CreateItem() {
    const { boardId } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [vibe, setVibe] = useState("");
    const [note, setNote] = useState("");
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const[isGenerating,setIsGenerating]=useState(false);

    const validate = () => {
        const newErrors = {};

        if (!title.trim()) {
            newErrors.title = "Title is required";
        }

        if (!url.trim()) {
            newErrors.url = "URL is required";
        } else {
            try {
                const parsed = new URL(url);
                if (!["http:", "https:"].includes(parsed.protocol)) {
                    newErrors.url = "URL must start with http:// or https://";
                }
            } catch {
                newErrors.url = "Enter a valid URL";
            }
        }

        if (!vibe.trim()) {
            newErrors.vibe = "Vibe is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleGenerateNote = async () => {
        setServerError("");
    
        if (!validate()) {
            return;
        }
    
        try {
            setIsGenerating(true);
    
            const token = localStorage.getItem("token");
    
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/items/generate-note`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title,
                        url,
                        vibe,
                    }),
                }
            );
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.detail || "Failed to generate note.");
            }
    
            setNote(data.note);
        } catch (err) {
            setServerError(err.message || "Something went wrong.");
        } finally {
            setIsGenerating(false);
        }
    };


    const handleItem = async (e) => {
        e.preventDefault();
        setServerError("");

        if (!validate()) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${import.meta.env.VITE_API_URL}/items`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    url,
                    vibe,
                    note: note || null,
                    board_id: boardId,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                navigate(`/boards/${boardId}/items`);
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
                <h2>Create Item</h2>

                <form onSubmit={handleItem} noValidate>
                    <input
                        className={errors.title ? "input-error" : ""}
                        placeholder="Title"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
                        }}
                    />
                    {errors.title && <p className="field-error">{errors.title}</p>}

                    <input
                        className={errors.url ? "input-error" : ""}
                        type="url"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => {
                            setUrl(e.target.value);
                            if (errors.url) setErrors((prev) => ({ ...prev, url: "" }));
                        }}
                    />
                    {errors.url && <p className="field-error">{errors.url}</p>}

                    <input
                        className={errors.vibe ? "input-error" : ""}
                        placeholder="Vibe"
                        value={vibe}
                        onChange={(e) => {
                            setVibe(e.target.value);
                            if (errors.vibe) setErrors((prev) => ({ ...prev, vibe: "" }));
                        }}
                    />
                    {errors.vibe && <p className="field-error">{errors.vibe}</p>}

                    <input
                        placeholder="Note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />

                    {serverError && <p className="form-error">{serverError}</p>}

                    <button
                    type="button"
                    className="generate-btn"
                    onClick={handleGenerateNote}
                    disabled={isGenerating}>
                   {isGenerating ? "Generating..." : "✨ Generate with AI"}
                   </button>

                    <div className="button-group">
                        <button
                            type="button"
                            className="popup-cancel"
                            onClick={() => navigate(`/boards/${boardId}/items`)}
                        >
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