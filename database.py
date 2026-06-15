from pymongo import MongoClient
from config import database_name,Mongo_Url

client = MongoClient(Mongo_Url)

#database
db=client[database_name]

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
