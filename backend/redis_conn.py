import redis
from rq import Queue
from backend.config import REDIS_URL

redis_conn = redis.from_url(
    REDIS_URL,
    decode_responses=False
)

q = Queue(connection=redis_conn)