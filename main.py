from fastapi import FastAPI
from routes import router  
from auth import auth_router
import asyncio
from datetime import datetime,UTC,timedelta 
from database import db

app = FastAPI()
app.include_router(router)
app.include_router(auth_router)

#test route 
@app.get("/")
def home():
    return {"message": "FastAPI is running"}


async def flashback_job():
    while True:
        try:
            print("Running flashback job...")

            cutoff = datetime.now(UTC) - timedelta(hours=24)

            item_cursor = db.items.find({
                "$or": [
                    {"created_at": {"$gte": cutoff}},
                    {"updated_at": {"$gte": cutoff}}
                ]
            })

            for item in item_cursor:

                item_id = str(item["_id"])

                exists = db.flashbacks.find_one({
                    "item_id": item_id
                })

                if not exists:
                    db.flashbacks.insert_one({
                        "item_id": item_id,
                        "user_id":item["user_id"],
                        "title": item["title"],
                        "vibe": item["vibe"],
                        "message": "You worked on this recently",
                        "created_at": datetime.now(UTC)
                    })

        except Exception as e:
            print("Flashback job error:", e)

        await asyncio.sleep(3600)

@app.on_event("startup")
async def start_background_task():
    asyncio.create_task(flashback_job())
     

