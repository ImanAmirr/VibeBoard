from fastapi.testclient import TestClient
from main import app

#PATH TESTS
#upload endpoint
def test_upload_file(client):    
    with open("test.txt","w") as f:
        f.write("hello")

    with open("test.txt","rb") as f:
        response=client.post("/upload",files={"file":("test.txt", f, "text/plain")})

    assert response.status_code == 200

#create item
def test_create_item(client,token,board):
    response=client.post("/items",json={
        "title":"test item",
        "url": "https://example.com",
        "vibe":"test",
        "board_id":board['id']},
        headers={"Authorization":f"Bearer {token}"})
    
    assert response.status_code==201

#get items
def test_get_items(client,item,token):
    response=client.get("/items",headers={"Authorization":f"Bearer {token}"})

    assert response.status_code==200
    data=response.json()

    assert isinstance(data,list) #correct format
    assert len(data)>=1 #data exists

#get single item
def test_get_item(client,item,token):
    response=client.get(f"/items/{item['id']}",headers={"Authorization":f"Bearer {token}"})

    assert response.status_code==200
    data=response.json()

    assert data['id']==item['id']
    assert data['title']==item['title']

#create board
def test_create_board(client,token):
    response=client.post("/boards",json={
        "name":" test board",
        "description": "testing"},
        headers={"Authorization":f"Bearer {token}"})
    
    assert response.status_code==201

#get boards
def test_get_boards(client,board,token):
    response=client.get("/boards",headers={"Authorization":f"Bearer {token}"})

    assert response.status_code==200

    data=response.json()

    assert isinstance(data,list)
    assert len(data)>=1

#get single board
def test_get_board(client,board,token):
    response=client.get(f"/boards/{board['id']}",headers={"Authorization":f"Bearer {token}"})

    assert response.status_code==200
    data=response.json()

    assert data["id"]==board["id"]
    assert data["name"]==board["name"]

#update item
def test_update_item(item,token,client):
    response=client.put(f"/items/{item['id']}",json={
    "title": "updated item",
    "url": "https://updated.com",
    "vibe": "updated vibe",
    "board_id": item["board_id"]
    } ,headers={"Authorization":f"Bearer {token}"})

    assert response.status_code==200
    data=response.json()
    assert data['message']=='item updated successfully'

#update board
def test_update_board(board,client,token):
    response=client.put(f"/boards/{board['id']}",json={
        "name":"update board",
        "description":"updated desc"},
        headers={"Authorization":f"Bearer {token}"})
    
    assert response.status_code==200
    data=response.json()

    assert data['message']=="board updated successfully"

#delete item 
def test_delete_item(item,client,token):
    response=client.delete(f"/items/{item['id']}",headers={"Authorization":f"Bearer {token}"})

    assert response.status_code==200
    data=response.json()


    assert data['message']=='item deleted successfully'

#delete board
def test_delete_board(client,board,token):
    response=client.delete(f"/boards/{board['id']}",headers={"Authorization":f"Bearer {token}"})

    assert response.status_code==200
    data=response.json()
    assert data['message']=="board deleted successfully!"

#all users
def test_get_users(client,admin_token,user):
    response=client.get("/admin/users",headers={"Authorization":f"Bearer {admin_token}"})

    assert response.status_code==200
    data=response.json()

    assert isinstance(data,list)
    assert len(data)>=1

#single user
def test_get_user(client,user,admin_token):
    response=client.get(f"/admin/user/{user['id']}",headers={"Authorization":f"Bearer {admin_token}"})

    assert response.status_code==200

    data=response.json()
    
    assert data['email']==user['email']

#delete user
def test_delete_user(client,admin_token,user):
    response=client.delete(f"/admin/user/{user['id']}",headers={"Authorization":f"Bearer {admin_token}"})

    assert response.status_code==200
    data=response.json()


    assert data['message']=="user deleted successfully"
 
#make admin
def test_make_admin(client,admin_token,user):
    response=client.put(f"/admin/user/{user['id']}/make-admin",headers={"Authorization":f"Bearer {admin_token}"})

    assert response.status_code==200
    data=response.json()

    assert data["message"]=="Updated successfully"

#make user
def test_make_user(client,admin_token,user):
    response=client.put(f"/admin/user/{user['id']}/make-user",headers={"Authorization":f"Bearer {admin_token}"})

    assert response.status_code==200
    data=response.json()

    assert data["message"]=="Updated successfully"

#ERROR TESTS
#item invalid test
def test_items_invalid_id(client,token):
    response=client.get("/items/invalid_id",headers={"Authorization":f"Bearer {token}"})

    assert response.status_code==400 

#board invalid test
def test_board_invalid_id(client,token):
    response=client.get("/boards/invalid_id",headers={"Authorization":f"Bearer {token}"})

    assert response.status_code==400

#item not found
def test_item_not_found(client,token):
    response=client.get("/items/507f1f77bcf86cd799439011",headers={"Authorization":f"Bearer {token}"})

    assert response.status_code==404

#board not found
def test_board_not_found(client,token):
    response=client.get("/boards/507f1f77bcf86cd799439011",headers={"Authorization":f"Bearer {token}"})

    assert response.status_code==404

#AUTH ERROR TESTS
#no token
def test_items_no_token(client):
    response=client.get("/items")

    assert response.status_code==401

#invalid token
def test_items_invalid_token(client):
    response=client.get("/items",headers={"Authorization":"Bearer wrongtoken"})

    assert response.status_code==401

#admin routes
def test_admin_access_denied(client,token):
    response=client.get("/admin/users",headers={"Authorization":f"Bearer {token}"})

    assert response.status_code==403

def test_admin_access(client,admin_token):
    response=client.get("/admin/users",headers={"Authorization":f"Bearer {admin_token}"})

    assert response.status_code==200









