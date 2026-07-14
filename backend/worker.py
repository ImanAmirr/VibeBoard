from dotenv import load_dotenv
load_dotenv()

from rq import SimpleWorker
from redis_conn import redis_conn

if __name__ == "__main__":
    worker = SimpleWorker(
        ["default"],
        connection=redis_conn
    )
    worker.work()