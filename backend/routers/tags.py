from typing import List
from fastapi import APIRouter, Depends
from requests import Session
from backend.database import get_db
from backend.models import Tag
from backend.routers.api_models import CreateTagRequest, TagBase, TagDisplay
router = APIRouter()

@router.get("/tags", response_model=List[TagBase])
def get_notes(db: Session = Depends(get_db)):
    tags = db.query(Tag).all()
    return tags


@router.post("/tags", response_model=TagDisplay)
def get_notes(request: CreateTagRequest, db: Session = Depends(get_db)):
    new_tag = Tag(name=request.name)
    db.add(new_tag)
    db.commit()
    db.refresh(new_tag)
    return new_tag