import redis
from rq import Queue

redis_conn = redis.Redis(host="localhost", port=6379, decode_responses=True)

from rq import Queue
from redis_conn import redis_conn

q = Queue(connection=redis_conn)