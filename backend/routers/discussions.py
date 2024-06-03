
from backend.database import get_db
from backend.models import Discussion, Message
from typing import List

from fastapi import APIRouter, Depends, Query, Request
from requests import Session
from backend.models import Note, Tag
from backend.routers.api_models import ChatMessage, CreateDiscussionRequest, CreateMessageRequest, CreateNoteRequest, NoteDisplay
from sqlalchemy.orm import joinedload

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
def chat(request: Request, id:int,msg: ChatMessage,db: Session = Depends(get_db)):
    reply = request.app.state.llm_service.chat(msg.content)

    new_message = Message(content=reply, discussion_id=id, sender="ai")
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message


@router.post("/discussions/{discussion_id}/messages/{message_id}/flashcards")
def chat(request: Request, discussion_id: int, message_id: int, db: Session = Depends(get_db)):
    message = db.query(Message).filter(Message.id == message_id).first()
    reply = request.app.state.llm_service.get_flashcards(message.content)
    return reply


@router.post("/discussions/{discussion_id}/messages/{message_id}/flashcards1")
def foo():
    return {
    "cards": [
        {
            "name": "Salvador Dalí",
            "description": "A famous Spanish painter known for his surrealist works featuring dreamlike imagery and unusual perspectives."
        },
        {
            "name": "Birth Date",
            "description": "May 11, 1904"
        },
        {
            "name": "Nationality",
            "description": "Spanish"
        },
        {
            "name": "Art Style",
            "description": "Surrealism"
        },
        {
            "name": "Characteristics of his works",
            "description": "Dreamlike imagery and unusual perspectives."
        }
    ]
}