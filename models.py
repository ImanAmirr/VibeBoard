from pydantic import BaseModel,Field
from typing import Optional
from datetime import datetime

#request model
class Item(BaseModel):
    board_id:str
    title:str=Field(...,min_length=2,max_length=50)
    url:str=Field(...,min_length=5)
    vibe:str=Field(...,min_length=2,max_length=50)
    note:Optional[str]=Field(None,max_length=100)


#pydantic model(response)
class ItemResponse(BaseModel):
    id:str
    board_id:str
    user_id:str
    title:str
    url:str
    vibe:str
    note:Optional[str]=None
    created_at:datetime
    updated_at:datetime

#request model    
class Board(BaseModel):
    name:str=Field(...,min_length=2,max_length=30)
    description:Optional[str]=Field(None,min_length=2,max_length=50)

#response model
class BoardResponse(BaseModel):
    id:str
    user_id:str
    name:str
    description:Optional[str]=None
    created_at:datetime
    updated_at:datetime


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
    email:str
    password:str=Field(...,max_length=72)

class UserResponse(BaseModel):
    id:str
    email:str