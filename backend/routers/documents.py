
import os
import tempfile
from typing import List
from llama_index.core import VectorStoreIndex, StorageContext
from llama_index.core import Settings
from utils.utils import get_current_user
from database import get_db
from fastapi import APIRouter, Depends, File, Query, Request, Response, UploadFile
from models import Document, Note, Tag, User
from requests import Session
from routers.api_models import ChatMessage, CreateNoteRequest, NoteDisplay
from sqlalchemy.orm import joinedload
from llama_index.core import SimpleDirectoryReader
router = APIRouter()

@router.get("/documents", tags=["RAG"])
def get_notes(db: Session = Depends(get_db), tag: List[str] = Query(None), current_user: User = Depends(get_current_user)):
    docs = db.query(Document).all()
    return docs




@router.post("/documents")
async def upload_document(request: Request, db: Session = Depends(get_db),  file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    # You can now access the file using the `file` parameter
    with tempfile.TemporaryDirectory() as tmpdir:
        # Write the file to the temporary directory
        file_path = os.path.join(tmpdir, file.filename)
        with open(file_path, 'wb') as f:
            contents = await file.read()
            f.write(contents)

        new_doc = Document(name=f.name)
        db.add(new_doc)
        db.commit()
        db.refresh(new_doc)
        documents = SimpleDirectoryReader(tmpdir).load_data()
        for doc in documents:
            doc.metadata = {
                "learny_id": new_doc.id,
                "user_id": current_user.id
            }

        try:
            index = VectorStoreIndex.from_documents(
                documents,
                storage_context=request.app.state.qdrant_service.storage_context,
                    embed_model=Settings.embed_model
            )
        except Exception as e:
            db.delete(new_doc)
            db.commit()
            print(e)
            return Response(content="Could not process file upload", status_code=500)


            
    return 'ok'
