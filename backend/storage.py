import os
from uuid import uuid4

UPLOAD_DIR="uploads"

def save_file(file):
    
    os.makedirs(UPLOAD_DIR,exist_ok=True)
    ext=file.filename.split(".")[-1]
    filename=f"{uuid4()}.{ext}"
    filepath=os.path.join(UPLOAD_DIR,filename)

    #open file as binary file
    with open(filepath,"wb") as buffer: 
        #write data in it
        buffer.write(file.file.read())

    return filepath