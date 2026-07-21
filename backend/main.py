from dotenv import load_dotenv
load_dotenv(".env")
from fastapi import FastAPI
from backend.routes.item_routes import router  
from backend.auth import auth_router
import asyncio
from datetime import datetime, timezone, timedelta
from backend.database import db
from fastapi.middleware.cors import CORSMiddleware
from rq import Queue
from backend.redis_conn import redis_conn
from backend.task import process_flashback_item

app = FastAPI()

q = Queue(connection=redis_conn)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://vibe-board-khaki.vercel.app",
        "http://localhost:5173", 
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)
app.include_router(auth_router)


@app.get("/")
def home():
    return {"message": "FastAPI is running"}

async def flashback_job():
    while True:
        try:
            cutoff = datetime.now(timezone.utc) - timedelta(hours=24)

            items = db.items.find({
                "created_at": {"$lte": cutoff},
                "flashback_sent": {"$ne": True},
            })

            for item in items:
                result = db.items.update_one(
                    {"_id": item["_id"], "flashback_sent": {"$ne": True}},
                    {"$set": {"flashback_sent": True}},
                )

                if result.modified_count == 1:
                    q.enqueue(process_flashback_item, str(item["_id"]))

        except Exception:
            import traceback
            print("FLASHBACK JOB ERROR:")
            traceback.print_exc()

        await asyncio.sleep(300)


@app.on_event("startup")
async def start_background_task():
    asyncio.create_task(flashback_job())