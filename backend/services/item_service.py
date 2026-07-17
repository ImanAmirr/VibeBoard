from bson import ObjectId
from fastapi import HTTPException
from datetime import datetime,timezone
from bson.errors import InvalidId
from backend.storage import save_file
from backend.cache import set_cache,delete_cache,get_cache
from backend.task import process_item,process_board
from backend.redis_conn import q
from backend.utilis import is_image_url
from backend.task import process_flashback_item

#ITEM ENDPOINTS

def create_item(item, db, user):

    try:
        board_obj_id = ObjectId(item.board_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="invalid board id")

    board = db.boards.find_one({"_id": board_obj_id, "user_id": user["id"]})
    if not board:
        raise HTTPException(status_code=404, detail="board not found")

    data_item = item.model_dump()

    # ensure URL is stored as string
    data_item["url"] = str(data_item["url"])

    data_item["user_id"] = user["id"]
    data_item["created_at"] = datetime.now(timezone.utc)
    data_item["updated_at"] = datetime.now(timezone.utc)

    # save item
    result = db.items.insert_one(data_item)

    # clear cache
    delete_cache(f"items:{user['id']}:all")

    # create flashback in background
    try:
        job = q.enqueue(process_flashback_item, str(result.inserted_id))
        print(
            f"FLASHBACK JOB QUEUED: {job.id} ITEM: {result.inserted_id}"
        )

    except Exception as e:
          print(f"WARNING: failed to enqueue flashback job: {e}")

    return {
        "message": "item created",
        "item": {
            "id": str(result.inserted_id),
            "title": data_item["title"],
            "url": data_item["url"],
            "vibe": data_item["vibe"],
            "note": data_item.get("note"),
            "board_id": data_item["board_id"],
            "created_at": data_item["created_at"],
            "updated_at": data_item["updated_at"],
            "is_image": is_image_url(data_item["url"])
        }
    }
def get_items(vibe,search, limit,skip,db,user):

    use_cache = not vibe and not search
    cache_key=f"items:{user['id']}:all"

    if use_cache:
        cache_data=get_cache(cache_key)
        if cache_data:
            return cache_data

    query={}
    if vibe:
        query["vibe"]=vibe
    
    if search:
        query["title"]={'$regex':search,'$options':'i'}
    
    items_cursor=db.items.find({**query,'user_id':user["id"]}).sort("_id",-1).skip(skip).limit(limit)

    items=[]
    for item in items_cursor:
        items.append({
    "id": str(item["_id"]),
    "title": item["title"],
    "url": item["url"],
    "vibe": item["vibe"],
    "note": item.get("note"),
    "board_id": item["board_id"],
    "created_at": item["created_at"],
    "updated_at": item["updated_at"],
    "is_image": is_image_url(item["url"])
})

    if use_cache:
        set_cache(cache_key,items)

    return items

def get_item(id,db,user):

    cache_key=f"item:{user['id']}:{id}"

    cache_data=get_cache(cache_key)
    if cache_data:
        return cache_data

    try:
        obj_id=ObjectId(id)
    except InvalidId:
        raise HTTPException(status_code=400,detail="invalid id")
    
    item=db.items.find_one({"_id":obj_id,"user_id":user["id"]})
    if not item:
        raise HTTPException(status_code=404, detail="item not found")
    
    result = {
    "id": str(item["_id"]),
    "title": item["title"],
    "url": item["url"],
    "vibe": item["vibe"],
    "note": item.get("note"),
    "board_id": item["board_id"],
    "created_at": item["created_at"],
    "updated_at": item["updated_at"],
    "is_image": is_image_url(item["url"])
}

    set_cache(cache_key,result)

    return result


def update_item(id,item,db,user):

    try:
        obj_id=ObjectId(id)
    except InvalidId:
        raise HTTPException(status_code=400,detail="invalid id")
    
    try:
        board_obj_id=ObjectId(item.board_id)
    except InvalidId:
        raise HTTPException(status_code=400,detail="invalid board id")
    
    board_data=db.boards.find_one({"_id":board_obj_id,"user_id":user["id"]})

    if not board_data:
        raise HTTPException(status_code=404,detail="board not found")
    
    data_item=item.model_dump()
    data_item["url"] = str(data_item["url"])  # <-- add this line
    data_item.pop("is_saved_copy", None)  # never let edits touch this flag
    data_item["updated_at"]=datetime.now(timezone.utc)

    result=db.items.update_one({'_id': obj_id,'user_id':user['id']},{"$set":data_item})

    if result.matched_count==0:
        raise HTTPException(status_code=404,detail="item not found")
    
    delete_cache(f"item:{user['id']}:{id}")
    delete_cache(f"items:{user['id']}:all")
    
    return {"message":"item updated successfully"}

def delete_item(id,db,user):
    try:
        obj_id=ObjectId(id)
    except InvalidId:
        raise HTTPException(status_code=400,detail="invalid id")
    
    result=db.items.delete_one({'_id':obj_id,'user_id':user["id"]})

    if result.deleted_count==0:
        raise HTTPException(status_code=404,detail="item not found")
    
    delete_cache(f"item:{user['id']}:{id}")
    delete_cache(f"items:{user['id']}:all")
    
    return{"message":"item deleted successfully"}

#BOARD ENDPOINTS

def create_board(board,db,user):

    data_board=board.model_dump()

    data_board["user_id"]=user["id"]

    data_board["created_at"]=datetime.now(timezone.utc)
    data_board["updated_at"]=datetime.now(timezone.utc)

    result = db.boards.insert_one(data_board)
    q.enqueue(process_board, str(result.inserted_id))

    delete_cache(f"boards:{user['id']}:all")
    delete_cache("admin:boards:all")

    return{
        "message":"board created!",
        "board_data": {
            "id": str(result.inserted_id),
            "name": data_board["name"],
            "description": data_board.get("description"),
            "is_private": data_board["is_private"],
            "created_at": data_board["created_at"],
            "updated_at": data_board["updated_at"]
        }
    }

def get_all_boards(db, user, limit=50, skip=0):
    print("get_all_boards called")

    cache_key = "admin:boards:all"

    cache_data = get_cache(cache_key)
    if cache_data:
        return cache_data

    board_cursor = db.boards.find({}).sort("_id", -1).skip(skip).limit(limit)

    boards = []

    for b in board_cursor:
        boards.append({
            "id": str(b["_id"]),
            "name": b["name"],
            "description": b.get("description"),
            "is_private": b.get("is_private", True),
            "created_at": b["created_at"],
            "updated_at": b["updated_at"],
        })

    set_cache(cache_key, boards)
    print("Returning", len(boards), "boards")

    return boards

def get_board(id,db,user):

    cache_key=f"board:{user['id']}:{id}"
    cache_data=get_cache(cache_key)
    if cache_data:
        return cache_data

    try:
        board_id=ObjectId(id)
    except InvalidId:
        raise HTTPException(status_code=400,detail="invalid id")
    
    board_data=db.boards.find_one({"_id":board_id,'user_id':user["id"]})
    
    if not board_data:
        raise HTTPException(status_code=404,detail="board not found")
    

    
    result={
        "id":str(board_data["_id"]),
        "name":board_data["name"],
        "description":board_data.get('description'),
        "is_private":board_data.get("is_private", True),
        "created_at":board_data["created_at"],
        "updated_at":board_data["updated_at"]
    }

    set_cache(cache_key,result)

    return result

def update_board(id,board,db,user):

    try:
        board_id=ObjectId(id)
    except InvalidId:
        raise HTTPException(status_code=400,detail="invalid id")
    
    board_data=board.model_dump()
    board_data["updated_at"]=datetime.now(timezone.utc)

    
    result=db.boards.update_one({"_id":board_id,'user_id':user["id"]},{'$set':board_data})

    if result.matched_count==0:
        raise HTTPException(status_code=404,detail="board not found")
    
    delete_cache(f"board:{user['id']}:{id}")
    delete_cache(f"boards:{user['id']}:all")
    delete_cache("admin:boards:all")
    
    return {
        "message": "board updated successfully"
    }

def delete_board(id,db,user):

    try:
        board_id=ObjectId(id)
    except InvalidId:
        raise HTTPException(status_code=400,detail="invalid id") 
    
    board_data=db.boards.delete_one({"_id":board_id,'user_id':user["id"]})

    if board_data.deleted_count==0:
        raise HTTPException(status_code=404,detail="board not found")
    
    
    delete_cache(f"board:{user['id']}:{id}")
    delete_cache(f"boards:{user['id']}:all")
    delete_cache("admin:boards:all")

    return{
        "message":"board deleted successfully!"
    }

def get_boarditems(board_id,db,user):

    try:
        board_obj_id=ObjectId(board_id)
    
    except InvalidId:
        raise HTTPException(status_code=400, detail="invalid board id")
    
    board_data=db.boards.find_one({"_id":board_obj_id,'user_id':user["id"]})

    if not board_data:
        raise HTTPException(status_code=404,detail="board not found")
    
    item_cursor=db.items.find({"board_id":board_id,'user_id':user["id"]})
    items=[]

    for item in item_cursor:
        items.append({
            "id": str(item["_id"]),
            "title": item["title"],
            "url": item["url"],
            "vibe": item["vibe"],
            "note": item.get("note"),
            "created_at": item["created_at"],
            "updated_at": item["updated_at"],
            "board_id": item["board_id"],
            "is_image": is_image_url(item["url"])
        })
    return items

#FLASHBACKS ENDPOINTS

def get_flashback(db,user):

    flashback_cursor = db.flashbacks.find({
        "user_id": user["id"]
    }).sort("_id",-1)

    flashbacks=[]

    for fb in flashback_cursor:
        flashbacks.append({
            "id": str(fb["_id"]),
            "user_id": fb["user_id"],
            "item_id": fb["item_id"],
            "title": fb["title"],
            "vibe": fb["vibe"],
            "message": fb["message"],
            "created_at": fb["created_at"]
        })

    return flashbacks
    

#ADMIN ENDPOINTS

def get_users(db, user, limit=50, skip=0):

    cache_key="admin:users:all"
    cache_data=get_cache(cache_key)
    if cache_data:
        return cache_data

    user_cursor = db.users.find({}).sort("_id",-1).skip(skip).limit(limit)
    result = []

    for u in user_cursor:
        result.append({
            "id": str(u["_id"]),
            "email": u["email"],
            "role": u.get("role", "user")
        })

    set_cache(cache_key,result)

    return result


def get_user(id, db, user):
    try:
        user_id = ObjectId(id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID")

    result = db.users.find_one({"_id": user_id})

    if not result:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": str(result["_id"]),
        "email": result["email"],
        "role": result.get("role", "user")
    }

def delete_user(id,db,user):
    try:
        user_id=ObjectId(id)
    except InvalidId:
        raise HTTPException(status_code=400,detail="Invalid ID")
    
    result=db.users.delete_one({"_id":user_id})
    
    if result.deleted_count==0:
        raise HTTPException(status_code=404,detail="user not found")
    
    delete_cache("admin:users:all")
    
    return{"message":"user deleted successfully"}
    
def make_admin(id,db,user):
    try:
        user_id=ObjectId(id)
    except InvalidId:
        raise HTTPException(status_code=400,detail="Invalid ID")
    
    result=db.users.update_one({"_id":user_id},{'$set':{'role':"admin"}})

    if result.matched_count==0:
        raise HTTPException(status_code=404,detail="User not found")
    
    delete_cache("admin:users:all")
    
    return{"message":"Updated succesfully"}
    
    
def make_user(id,db,user):
    try:
        user_id=ObjectId(id)
    except InvalidId:
        raise HTTPException(status_code=400,detail="Invalid ID")
    
    result=db.users.update_one({"_id":user_id},{'$set':{'role':"user"}})

    if result.matched_count==0:
        raise HTTPException(status_code=404,detail="User not found")
    
    delete_cache("admin:users:all")
    
    return{"message":"Updated successfully"}

def get_all_boards(db, user, limit=50, skip=0):
    print("get_all_boards called")

    cache_key = "admin:boards:all"

    cache_data = get_cache(cache_key)
    if cache_data:
        return cache_data

    board_cursor = db.boards.find({}).sort("_id", -1).skip(skip).limit(limit)

    boards = []

    for b in board_cursor:
        boards.append({
            "id": str(b["_id"]),
            "name": b["name"],
            "description": b.get("description"),
            "created_at": b["created_at"],
            "updated_at": b["updated_at"],
        })

    set_cache(cache_key, boards)
    print("Returning", len(boards), "boards")

    return boards


def delete_any_board(id,db,user):
    try:
        board_id=ObjectId(id)
    except InvalidId:
        raise HTTPException(status_code=400,detail="Invalid ID")
    
    result=db.boards.delete_one({"_id":board_id})

    if result.deleted_count==0:
        raise HTTPException(status_code=404,detail="Board not found")
    
    delete_cache("admin:boards:all")
    
    return{"message":"Board deleted successfully"}

def upload_file(file):
    if not file:
        raise HTTPException(status_code=400,detail="file not found")
    
    path=save_file(file)

    return{
        "message":"File uploaded successfully",
        "file_path": path
    }

def get_me(db,user):
    return user


def get_explore_items(limit, skip, db, user):

    public_board_ids = {
        str(b["_id"]) for b in db.boards.find({"is_private": False}, {"_id": 1})
    }

    items_cursor = db.items.find({
        "is_saved_copy": {"$ne": True},
        "board_id": {"$in": list(public_board_ids)},
    }).sort("_id", -1)

    items = []
    seen_urls = set()

    for item in items_cursor:
        if item["url"] in seen_urls:
            continue
        seen_urls.add(item["url"])

        items.append({
            "id": str(item["_id"]),
            "title": item["title"],
            "url": item["url"],
            "vibe": item["vibe"],
            "note": item.get("note"),
            "created_at": item["created_at"],
            "updated_at": item["updated_at"],
            "is_image": is_image_url(item["url"])
        })

    return items[skip:skip + limit]