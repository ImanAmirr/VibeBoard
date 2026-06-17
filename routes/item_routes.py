from fastapi import APIRouter,status,HTTPException,Depends,UploadFile,File
from bson import ObjectId
from database import items_collection,boards_collection,flashback_collection,users_collection,getdb
from models import Item,ItemResponse,Board,BoardResponse,FlashbackResponse,User,UserResponse
from bson.errors import InvalidId
from datetime import datetime, timezone
from storage import save_file
from auth import verify_token,admin_required
from services.item_service import (
    create_item as create_item_service,
    get_items as get_items_service,
    get_item as get_item_service,
    create_board as create_board_service,
    get_boards as get_boards_service,
    get_board as get_board_service,
    update_board as update_board_service,
    update_item as update_item_service,
    delete_board as delete_board_service,
    delete_item as delete_item_service,
    get_flashback as get_flashback_service,
    get_boarditems as get_boarditems_service,
    get_users as get_users_service,
    get_user as get_user_service,
    delete_user as delete_user_service,
    make_admin as make_admin_service,
    make_user as make_user_service,
    get_all_boards as get_all_boards_service,
    delete_any_board as delete_any_board_service,
    upload_file as upload_file_service
    )

router = APIRouter()

#create an item(save to board)
@router.post("/items",status_code=status.HTTP_201_CREATED)
def create_item(item:Item,db=Depends(getdb),user=Depends(verify_token)):
    return create_item_service(item,db,user)

#get all items(see board)
@router.get("/items",response_model=list[ItemResponse])
def get_items(vibe:str=None,search:str=None, limit:int=5,skip:int=0,db=Depends(getdb),user=Depends(verify_token)):
    return get_items_service(vibe,search,limit,skip,db,user)

#get a single item(from board)
@router.get("/items/{id}",response_model=ItemResponse)
def get_item(id:str,db=Depends(getdb),user=Depends(verify_token)):
    return get_item_service(id,db,user)

#update an item
@router.put("/items/{id}")
def update_item(id:str,item:Item,db=Depends(getdb),user=Depends(verify_token)):
    return update_item_service(id,item,db,user)

#delete item 
@router.delete("/items/{id}")
def delete_item(id:str,db=Depends(getdb),user=Depends(verify_token)):
    return delete_item_service(id,db,user)

#create board
@router.post("/boards",status_code=status.HTTP_201_CREATED)
def create_board(board:Board,db=Depends(getdb),user=Depends(verify_token)):
    return create_board_service(board,db,user)

#get all boards
@router.get("/boards",response_model=list[BoardResponse])
def get_boards(search:str=None,limit:int=3,skip:int=0,db=Depends(getdb),user=Depends(verify_token)):
    return get_boards_service(search,limit,skip,db,user)
    
#see a single board
@router.get("/boards/{id}",response_model=BoardResponse)
def get_board(id:str,db=Depends(getdb),user=Depends(verify_token)):
    return get_board_service(id,db,user)

#update board
@router.put("/boards/{id}")
def update_board(id:str,board:Board,db=Depends(getdb),user=Depends(verify_token)):
    return update_board_service(id,board,db,user)

#delete a board
@router.delete("/boards/{id}")
def delete_board(id:str,db=Depends(getdb),user=Depends(verify_token)):
    return delete_board_service(id,db,user)

@router.get("/boards/{board_id}/items",response_model=list[ItemResponse])
def get_boarditems(board_id:str,db=Depends(getdb),user=Depends(verify_token)):
    return get_boarditems_service(board_id,db,user)

#flashback response
@router.get("/flashbacks",response_model=list[FlashbackResponse])
def get_flashback(db=Depends(getdb),user=Depends(verify_token)):
    return get_flashback_service(db,user)

#see all users
@router.get("/admin/users",response_model=list[UserResponse])
def get_users(db=Depends(getdb), user=Depends(admin_required)):
    return get_users_service(db,user)

#see single user
@router.get("/admin/user/{id}",response_model=UserResponse)
def get_user(id:str,db=Depends(getdb),user=Depends(admin_required)):
    return get_user_service(id,db,user)

#delete a user
@router.delete("/admin/user/{id}")
def delete_user(id:str,db=Depends(getdb),user=Depends(admin_required)):
    return delete_user_service(id,db,user)

#make admin
@router.put("/admin/user/{id}/make-admin")
def make_admin(id:str,db=Depends(getdb),user=Depends(admin_required)):
    return make_admin_service(id,db,user)

#make user
@router.put("/admin/user/{id}/make-user")
def make_user(id:str,db=Depends(getdb),user=Depends(admin_required)):
    return make_user_service(id,db,user)

#see all boards
@router.get("/admin/boards",response_model=list[BoardResponse])
def get_all_boards(db=Depends(getdb),user=Depends(admin_required)):
    return get_all_boards_service(db,user)

#delete any board
@router.delete("/admin/boards/{id}")
def delete_any_board(id:str,db=Depends(getdb),user=Depends(admin_required)):
    return delete_any_board_service(id,db,user)

#upload file 
@router.post("/upload")
def upload_file(file:UploadFile=File(...)):
    return upload_file_service(file)
