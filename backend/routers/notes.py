from functools import partial
from typing import List

from utils.utils import get_current_user, save_token_usage
from database import get_db
from fastapi import APIRouter, Depends, Query, Request
from models import Note, Tag, User
from requests import Session
from routers.api_models import CreateNoteRequest, NoteDisplay
from sqlalchemy.orm import joinedload

router = APIRouter()


@router.get("/notes", response_model=List[NoteDisplay], tags=["Notes"])
def get_notes(
    db: Session = Depends(get_db),
    tag: List[str] = Query(None),
    current_user: User = Depends(get_current_user),
):
    if tag:
        notes = (
            db.query(Note)
            .join(Note.tags)
            .filter(Tag.name.in_(tag), Tag.user_id == current_user.id)
            .options(joinedload(Note.tags))
            .all()
        )
    else:
        notes = (
            db.query(Note)
            .filter(Note.user_id == current_user.id)
            .options(joinedload(Note.tags))
            .all()
        )
    return notes


@router.post("/notes", response_model=NoteDisplay, tags=["Notes"])
def create_notes(
    request: Request,
    create_note_request: CreateNoteRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    title = request.app.state.llm_service.summarize(
        create_note_request.content,
        partial(save_token_usage, db, current_user.id, "notes_summarize"),
    )

    new_note = Note(
        content=create_note_request.content, title=title, user_id=current_user.id
    )
    tag = (
        db.query(Tag)
        .filter(Tag.name == create_note_request.tag, Tag.user_id == current_user.id)
        .first()
    )
    if not tag:
        tag = Tag(name=create_note_request.tag, user_id=current_user.id)
        db.add(tag)
        db.commit()
        db.refresh(tag)

    new_note.tags.append(tag)
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note
