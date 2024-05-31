
from typing import List
from backend.database import get_db
from fastapi import APIRouter, Depends, Query
from requests import Session
from backend.models import Note, Tag
from backend.routers.api_models import CreateNoteRequest, NoteDisplay
from sqlalchemy.orm import joinedload
from backend import llmer

router = APIRouter()

@router.get("/notes", response_model=List[NoteDisplay])
def get_notes(db: Session = Depends(get_db), tag: List[str] = Query(None)):
    if tag:
        notes = db.query(Note).join(Note.tags).filter(Tag.name.in_(tag)).options(joinedload(Note.tags)).all()
    else:
        notes = db.query(Note).options(joinedload(Note.tags)).all()
    return notes



@router.post("/notes", response_model=NoteDisplay)
def get_notes(request: CreateNoteRequest, db: Session = Depends(get_db)):
    # Create a new note
    title = llmer.summarize(request.content)


    new_note = Note(content=request.content, title=title)
    for tag_id in request.tags:
        tag = db.query(Tag).filter(Tag.id == tag_id).first()
        if tag:
            new_note.tags.append(tag)
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note


