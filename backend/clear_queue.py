from dotenv import load_dotenv
load_dotenv(".env")

from rq import Queue
from backend.redis_conn import redis_conn

q = Queue(connection=redis_conn)
q.empty()

print("Queue cleared!")