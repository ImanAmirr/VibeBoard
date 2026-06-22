from datetime import datetime, timezone
from bson import ObjectId

def process_item(item_id:str):
    print(f"Processing item: {item_id}")

def process_board(board_id:str):
    print(f"Processing board: {board_id}")

def process_flashback_item(item_id:str,db):
    item = db.items.find_one({"_id": ObjectId(item_id)})

    if not item:
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