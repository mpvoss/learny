
from utils.utils import get_current_user
from database import get_db
from models import Discussion, Message, MessageDiagram, User
from typing import List

from fastapi import APIRouter, Depends, Query, Request
from requests import Session
from models import Note, Tag
from routers.api_models import ChatMessage, CreateDiscussionRequest, CreateMessageRequest, CreateNoteRequest, NoteDisplay
from sqlalchemy.orm import joinedload

router = APIRouter()

@router.get("/discussions")
def chat(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Discussion).all()


@router.post("/discussions",  response_model=CreateDiscussionRequest)
def create_discussion(request: CreateDiscussionRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_discussion = Discussion(topic=request.topic)
    db.add(new_discussion)
    db.commit()
    db.refresh(new_discussion)
    return new_discussion


@router.post("/discussions/{id}/messages", response_model=CreateMessageRequest)
def create_message(id: int,request: CreateMessageRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Create a new discussion

    # Continue with creating the new message
    new_message = Message(content=request.content, discussion_id=request.discussion_id, sender=request.sender)
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message


@router.get("/discussions/{id}/messages")
def get_msgs(request: Request, id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    messages = db.query(Message).options(joinedload(Message.diagrams)).filter(Message.discussion_id == id).order_by(Message.created_at).all()
    return messages


@router.post("/discussions/{id}/chat")
def chat(request: Request, id:int,msg: ChatMessage,db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    reply = request.app.state.llm_service.chat(msg.content)

    new_message = Message(content=reply, discussion_id=id, sender="ai", show_actions=True)
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message


@router.post("/discussions/{discussion_id}/messages/{message_id}/flashcards")
def chat(request: Request, discussion_id: int, message_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    message = db.query(Message).filter(Message.id == message_id).first()
    reply = request.app.state.llm_service.get_flashcards(message.content)
    asdf = []
    for x in reply.cards:
        asdf.append({'term':x.question,'description':x.answer})


    return {'cards':asdf}


@router.post("/discussions/{discussion_id}/timeline")
def timeline(request: Request,msg: ChatMessage,  discussion_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    events = request.app.state.llm_service.get_timeline_events(msg.content)
    res = []
    
    for idx,x in enumerate(events.segments):
        print(str(idx) + "/" + str(len(events.segments)) + ": "  + x)
        res.append(request.app.state.llm_service.get_timeline_item(x).model_dump(mode='json'))   
    

    new_message = Message(content=f"Sure, here's a timeline for the topic '{msg.content}'", discussion_id=discussion_id, sender="ai")
    db.add(new_message)
    db.commit()

    msg_diagram = MessageDiagram(name = msg.content,type = 'timeline',data = res, message_id = new_message.id)
    db.add(msg_diagram)
    db.commit()

    new_message = db.query(Message).options(joinedload(Message.diagrams)).filter(Message.id == new_message.id).first()
    return new_message


@router.post("/discussions/{discussion_id}/concept_map")
def timeline(request: Request,msg: ChatMessage,  discussion_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    entityList = request.app.state.llm_service.get_concept_mapv2_nodes(msg.content)
    entity_object_list = request.app.state.llm_service.get_concept_mapv2_node_categories(entityList.entities)
    
    
    new_message = Message(content=f"Sure, here's a concept map for the topic '{msg.content}'. Click any subtopic to learn more.", discussion_id=discussion_id, sender="ai")
    db.add(new_message)
    db.commit()

    msg_diagram = MessageDiagram(name = msg.content,type = 'concept_map',data = entity_object_list, message_id = new_message.id)
    db.add(msg_diagram)
    db.commit()

    new_message = db.query(Message).options(joinedload(Message.diagrams)).filter(Message.id == new_message.id).first()
    return new_message
