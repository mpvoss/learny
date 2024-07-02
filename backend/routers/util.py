
import csv
import random
import string

import genanki
from pydantic import BaseModel, TypeAdapter
from utils.utils import get_current_user, get_current_user_simple
from database import get_db
from faker import Faker
from fastapi import APIRouter, Depends, Request
from models import FlashCard, Note, Tag, User
from requests import Session
import datetime

router = APIRouter()


class UserSchema(BaseModel):
    first_name: str
    last_name: str
    email: str
    role: str

@router.get("/questions")
def get_topics(request: Request, topic: str, current_user: User = Depends(get_current_user)):
    return request.app.state.llm_service.get_questions(topic)



# TODO re-add get_current_user
@router.get("/conceptmapv2a")
def get_catgs(request: Request, topic: str, current_user: User = Depends(get_current_user)):
    entityList = request.app.state.llm_service.get_concept_mapv2_nodes(topic)
    return request.app.state.llm_service.get_concept_mapv2_node_categories(entityList.entities)



# THIS IS THE HUGE ONE THAT TAKES FOREVER....don't like
# TODO re-add get_current_user
@router.get("/conceptmapv2")
def get_topics(request: Request, topic: str, current_user: User = Depends(get_current_user)):
    # step 2, get concept map
    # return request.app.state.llm_service.get_concept_mapv2(summary)
    entityList = request.app.state.llm_service.get_concept_mapv2_nodes(topic)

    entity_list_resp = request.app.state.llm_service.get_concept_mapv2_node_categories(entityList.entities)

    all_relationships = []

    for idx, item in enumerate(entityList.entities):
        # ','.join(entityList.entities)
        # entityList.entities
        print(f'Processing {idx} of {len(entityList.entities)}')
        sublist = entityList.entities.copy()
        sublist.remove(item)
        entities_serialized = ','.join(sublist)
        
        all_relationships.extend(request.app.state.llm_service.get_concept_mapv2_relationships(item, entities_serialized).relationships)

    return {
        'relationships': all_relationships,
        'entities': entity_list_resp.entities
    }

@router.get("/conceptmap")
def get_topics(request: Request, topic: str, current_user: User = Depends(get_current_user)):
    return request.app.state.llm_service.chat(topic)


@router.post("/session")
def create_session(current_user: User = Depends(get_current_user_simple)):
    ta = TypeAdapter(UserSchema)
    m = ta.validate_python(current_user.__dict__)
    # return TypeAdapter.validate_python(UserSchema, current_user)
    # return parse_obj_as
    return m


@router.get("/seed")
def seed(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    fake = Faker()

    # Tags
    tags = []
    for i in range(10):
        random_string = ''.join(random.choices(string.ascii_lowercase, k=10))
        t = Tag(name=random_string.title())
        tags.append(t)
    db.add_all(tags)
    db.commit()

    # Notes
    notes = []
    for i in range(10):
        note = Note(content=fake.paragraph(nb_sentences=5), title=fake.sentence(3))
        note.tags.append(random.choice(tags))
        notes.append(note)

    db.add_all(notes)
    db.commit()

    # Flashcards
    flashcards = []
    for i in range(10):
        flashcard = FlashCard(description=fake.paragraph(nb_sentences=5), term=fake.words(3))
        flashcard.tags.append(random.choice(tags))
        flashcards.append(flashcard)

    db.add_all(flashcards)
    db.commit()

    return "OK"


@router.get("/timeline")
def timeline(request: Request, topic: str, current_user: User = Depends(get_current_user)):
    events = request.app.state.llm_service.get_timeline_events(topic)
    res = []
    
    for idx,x in enumerate(events.segments):
        print(str(idx) + "/" + str(len(events.segments)) + ": "  + x)
        res.append(request.app.state.llm_service.get_timeline_item(x))
    return res
