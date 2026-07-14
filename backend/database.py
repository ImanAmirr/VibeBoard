from pymongo import MongoClient
from backend.config import DATABASE_NAME, MONGO_URI

client = MongoClient(MONGO_URI)

#database
db=client[DATABASE_NAME]

#collections
items_collection=db.items
boards_collection=db.boards
flashback_collection=db.flashbacks
users_collection=db.users


#index
flashback_collection.create_index("item_id", unique=True)
db.flashbacks.create_index(
    "created_at",
    expireAfterSeconds=86400
)

#depend functionality
def getdb():
    return db
