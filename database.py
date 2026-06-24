from pymongo import MongoClient
from config import DATABASE_NAME, MONGO_URI

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

#depend functionality
def getdb():
    return db
