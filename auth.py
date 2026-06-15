from fastapi import APIRouter,Depends,HTTPException,status
from models import User,UserResponse
from database import users_collection,getdb
from passlib.context import CryptContext
from jose import jwt,JWTError
from datetime import datetime,timezone,timedelta
from fastapi.security import HTTPBearer,HTTPAuthorizationCredentials
from config import SECRET_KEY,ALGORITHM,token_time


auth_router=APIRouter()

security=HTTPBearer()

pwd_context=CryptContext(schemes=["bcrypt"],deprecated="auto")

#password hashing
def hash_password(password:str):
    return pwd_context.hash(password)

def verify_password(plain_password:str,hashed_password:str):
    return pwd_context.verify(plain_password,hashed_password)


#endpoints
@auth_router.post("/signup")
def signup(user:User,db=Depends(getdb)):
    existing=db.users.find_one({"email":user.email})

    if existing:
        raise HTTPException(status_code=400, detail="user already exists")
    
    user_data={
        "email":user.email,
        "password":hash_password(user.password)
    }
     
    db.users.insert_one(user_data)

    return{"message":user}


@auth_router.post("/login")
def login(user:User, db=Depends(getdb)):

    existing=db.users.find_one({"email":user.email})

    if not existing:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    if not verify_password(user.password,existing["password"]):
        raise HTTPException(status_code=400,detail="Invalid credentials")
    
    token=create_token({ "id":str(existing["_id"]), "email":existing["email"]})
    
    return{"token":token, "type":"bearer"}


#token creation
def create_token(data:dict):
    to_encode=data.copy()

    exp=datetime.now(timezone.utc)+timedelta(minutes=token_time)

    to_encode["exp"]=exp

    token=jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)
    return token

#token verification 
def verify_token(credentials:HTTPAuthorizationCredentials=Depends(security)):
    token=credentials.credentials

    try:
        payload=jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
        return payload
    
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    
    



    



