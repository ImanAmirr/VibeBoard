import pytest
from fastapi.testclient import TestClient
from main import app 
from database import getdb
import uuid

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def board(client,token):
    response=client.post("/boards",json={
        "name":"test board",
        "description":"test desc"},headers={"Authorization":f"Bearer {token}"})
    
    assert response.status_code==201
    return response.json()["board_data"]

@pytest.fixture
def item(client,token,board):
    response=client.post("/items",json={
        "title":"test_item",
        "vibe":"cool",
        "url":"https://test.com",
        "board_id":board["id"]},headers={"Authorization":f"Bearer {token}"})
    
    assert response.status_code==201
    return response.json()["item"]

@pytest.fixture
def token(client):
    client.post("/signup",json={
        "email":"test@example.com",
        "password":"test124"
    })

    response=client.post("/login",json={
        "email": "test@example.com",
        "password": "test124"
    })

    assert response.status_code == 200

    return response.json()["token"]

@pytest.fixture
def admin_token(client):
    
    email = f"admin_{uuid.uuid4()}@example.com"

    client.post("/signup", json={
        "email": email,
        "password": "test123"
    })

    db = getdb()

    db.users.update_one(
        {"email": email},
        {"$set": {"role": "admin"}}
    )

    login = client.post("/login", json={
        "email": email,
        "password": "test123"
    })

    return login.json()["token"]

@pytest.fixture
def user(client):
    email = f"user_{uuid.uuid4()}@example.com"

    response=client.post("/signup",json={
            "email": email,
            "password": "test123"
    })

    assert response.status_code == 200
    data=response.json()

    return{
        "id":data['id'],
        "email":data["email"]
    }
    



