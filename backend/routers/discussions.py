
from backend.database import get_db
from backend.models import Discussion, Message
from typing import List

from fastapi import APIRouter, Depends, Query
from requests import Session
from backend.models import Note, Tag
from backend.routers.api_models import ChatMessage, CreateDiscussionRequest, CreateMessageRequest, CreateNoteRequest, NoteDisplay
from sqlalchemy.orm import joinedload
from backend import llmer

router = APIRouter()

@router.get("/discussions")
def chat(db: Session = Depends(get_db)):
    return db.query(Discussion).all()


@router.post("/discussions", response_model=CreateDiscussionRequest)
def create_discussion(request: CreateDiscussionRequest, db: Session = Depends(get_db)):
    # Create a new discussion
    new_discussion = Discussion(topic=request.topic)
    db.add(new_discussion)
    db.commit()
    db.refresh(new_discussion)
    return new_discussion


@router.post("/discussions/{id}/messages", response_model=CreateMessageRequest)
def create_message(id: int,request: CreateMessageRequest, db: Session = Depends(get_db)):
    # Create a new discussion
    new_message = Message(content=request.content, discussion_id=request.discussion_id, sender=request.sender)
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message


@router.get("/discussions/{id}/messages")
def get_msgs(id: int,db: Session = Depends(get_db)):
    messages = db.query(Message).filter(Message.discussion_id == id).all()
    return messages


@router.post("/discussions/{id}/chat")
def chat(id:int,msg: ChatMessage,db: Session = Depends(get_db)):
    reply = llmer.chat(msg.content)

    new_message = Message(content=reply['text'], discussion_id=id, sender="ai")
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message


@router.post("/discussions/{discussion_id}/messages/{message_id}/flashcards")
def chat(discussion_id: int, message_id: int, db: Session = Depends(get_db)):
    message = db.query(Message).filter(Message.id == message_id).first()
    reply = llmer.get_flashcards(message.content)
    return reply