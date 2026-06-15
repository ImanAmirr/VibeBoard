from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY=os.getenv("SECRET_KEY")
ALGORITHM=os.getenv("ALGORITHM")
token_time=int(os.getenv("token_time",60))
Mongo_Url=os.getenv("Mongo_Url")
database_name=os.getenv("database_name")

