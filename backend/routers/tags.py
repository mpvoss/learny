from typing import List

from utils.utils import get_current_user
from database import get_db
from fastapi import APIRouter, Depends
from models import Tag, User
from requests import Session
from routers.api_models import CreateTagRequest, TagBase, TagDisplay

router = APIRouter()

@router.get("/tags", response_model=List[TagBase])
def get_notes(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    tags = db.query(Tag).all()
    return tags



@router.post("/tags", response_model=TagDisplay)
def get_notes(request: CreateTagRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_tag = Tag(name=request.name)
    db.add(new_tag)
    db.commit()
    db.refresh(new_tag)
    return new_tag