import "./boards.css";

const mockBoards = [
  { id: 1, title: "Apartment Ideas", count: 24, tape: "coral" },
  { id: 2, title: "Summer Outfits", count: 12, tape: "mustard" },
  { id: 3, title: "Travel: Japan", count: 38, tape: "sage" },
  { id: 4, title: "Recipes to Try", count: 9, tape: "blue" },
];

export default function Boards(){
    return(
        <div className="boards-page">
            <div className="boards-header">
                <div>
                    <span className="boards-eyebrow">Your Space</span>
                    <h1>Your Boards</h1>
                </div>
                <button className="new-board-btn">+ New Board</button>
            </div>

            <div className="boards-grid">
                {mockBoards.map((board, i) => (
                    <div className={`board-card tape-${board.tape}`} key={board.id}>
                        <h3>{board.title}</h3>
                        <span className="board-count">{board.count} pins</span>
                    </div>
                ))}

                <button className="board-card add-card">
                    <span className="add-icon">+</span>
                    <span>Create a new board</span>
                </button>
            </div>
        </div>
    );
}