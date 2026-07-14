from datetime import datetime, timezone
from bson import ObjectId
from backend.database import db


def process_item(item_id: str):
    print(f"Processing item: {item_id}")


def process_board(board_id: str):
    print(f"Processing board: {board_id}")


def process_flashback_item(item_id: str):

    item = db.items.find_one({"_id": ObjectId(item_id)})

    if not item:
        print(f"Item {item_id} not found.")
        return

    exists = db.flashbacks.find_one({"item_id": item_id})

    if exists:
        return

    db.flashbacks.insert_one({
        "item_id": item_id,
        "user_id": item["user_id"],
        "title": item["title"],
        "vibe": item["vibe"],
        "message": "You worked on this recently",
        "created_at": datetime.now(timezone.utc)
    })

    print(f"Flashback created for item {item_id}.")