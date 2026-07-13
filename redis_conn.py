import redis
from rq import Queue
from config import REDIS_URL
import os

redis_conn = redis.from_url(REDIS_URL)
q = Queue(connection=redis_conn)

REDIS_URL = os.getenv("REDIS_URL")