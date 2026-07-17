from pydantic import BaseModel,Field,HttpUrl,EmailStr
from typing import Optional
from datetime import datetime

#request model
class Item(BaseModel):
    board_id:str
    title:str=Field(...,min_length=2,max_length=50)
    url:HttpUrl
    vibe:str=Field(...,min_length=2,max_length=50)
    note:Optional[str]=Field(None,max_length=100)
    is_saved_copy:bool=False


#pydantic model(response)
class ItemResponse(BaseModel):
    id:str
    board_id:str
    title:str
    url:HttpUrl
    vibe:str
    note:Optional[str]=None
    created_at:datetime
    updated_at:datetime
    is_image:bool

#request model    
class Board(BaseModel):
    name:str=Field(...,min_length=2,max_length=30)
    description:Optional[str]=None
    is_private:bool=True


#response model
class BoardResponse(BaseModel):
    id:str
    name:str
    description:Optional[str]=None
    created_at:datetime
    updated_at:datetime
    is_private:bool


#flashback model
class FlashbackResponse(BaseModel):
    id:str
    item_id:str
    user_id:str
    created_at:datetime
    title:str
    vibe:str
    message:str

#user model
class User(BaseModel):
    email:EmailStr
    password:str=Field(...,max_length=72)
    role:str="user"

class UserResponse(BaseModel):
    id:str
    email:EmailStr
    role:str