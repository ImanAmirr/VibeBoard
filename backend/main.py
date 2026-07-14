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
import os
import uvicorn
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

q = Queue(connection=redis_conn)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
            print("Running flashback job...")

            cutoff = datetime.now(timezone.utc) - timedelta(hours=24)

            items = db.items.find({
                "$or": [
                    {"created_at": {"$gte": cutoff}},
                    {"updated_at": {"$gte": cutoff}}
                ]
            })

            for item in items:
                print(f"\nFOUND ITEM: {item['title']} ({item['_id']})")

                print("ABOUT TO QUEUE...")
                q.enqueue(process_flashback_item, str(item["_id"]))
                print("QUEUED SUCCESSFULLY")

        except Exception as e:
            import traceback
            print("\nFLASHBACK JOB ERROR:")
            traceback.print_exc()

        await asyncio.sleep(30)


@app.on_event("startup")
async def start_background_task():
    asyncio.create_task(flashback_job())

if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000))
    )