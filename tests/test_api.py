from fastapi.testclient import TestClient
from main import app

client=TestClient(app)

#upload endpoint
def test_upload_file():    
    with open("test.txt","w") as f:
        f.write("hello")

    with open("test.txt","rb") as f:
        response=client.post("/upload",files={"file":("test.txt", f, "text/plain")})

    assert response.status_code == 200

#get items
def test_get_items(client,item,token):
    response=client.get("/items",headers={"Authorization":f"Bearer {token}"})

    assert response.status_code==200
    data=response.json()

    assert isinstance(data,list) #correct format
    assert len(data)>=1 #data exists

#get certain item
def test_get_item(client,item,token):
    response=client.get(f"/items/{item['id']}",headers={"Authorization":f"Bearer {token}"})

    assert response.status_code==200
    data=response.json()

    assert data['id']==item['id']
    assert data['title']==item['title']


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