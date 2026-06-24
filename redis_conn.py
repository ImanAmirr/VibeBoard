import os
import redis
from rq import Queue

redis_conn = redis.from_url(os.getenv("REDIS_URL"))
q = Queue(connection=redis_conn)