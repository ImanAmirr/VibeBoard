from datetime import datetime, timezone
from bson import ObjectId
from database import db


def process_item(item_id: str):
    print(f"Processing item: {item_id}")


def process_board(board_id: str):
    print(f"Processing board: {board_id}")


def process_flashback_item(item_id: str):

    print("FLASHBACK JOB STARTED:", item_id)

    item = db.items.find_one({"_id": ObjectId(item_id)})

    print("FOUND ITEM:", item)

    if not item:
        print("ITEM NOT FOUND")
        return

    exists = db.flashbacks.find_one({"item_id": item_id})

    print("EXISTING FLASHBACK:", exists)

    if exists:
        print("FLASHBACK ALREADY EXISTS")
        return

    result = db.flashbacks.insert_one({
        "item_id": item_id,
        "user_id": item["user_id"],
        "title": item["title"],
        "vibe": item["vibe"],
        "message": "You worked on this recently",
        "created_at": datetime.now(timezone.utc)
    })

    print("INSERTED FLASHBACK:", result.inserted_id)