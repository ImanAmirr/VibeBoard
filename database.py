from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")

#database
db=client.vibe_board

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