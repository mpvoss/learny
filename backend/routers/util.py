
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

router = APIRouter()


class UserSchema(BaseModel):
    first_name: str
    last_name: str
    email: str
    role: str

@router.get("/questions")
def get_topics(request: Request, topic: str, current_user: User = Depends(get_current_user)):
    return request.app.state.llm_service.get_questions(topic)


@router.get("/conceptmap")
def get_topics(request: Request, topic: str, current_user: User = Depends(get_current_user)):
    return request.app.state.llm_service.get_concept_map(topic)


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




# @router.get("/exportFlashcards")
# def taco():
#     # ask llm for flash cards
#     topic = "Industrial Revolution"
#     # flashcard_text = llmer.chat(f"Write 10 flashcards to help a student study {topic}")["text"]
#     flash_cards = []
#     with open('./backend/flash.tsv', 'r') as file:
#         reader = csv.reader(file)
#         for row in reader:
#             flash_cards.append({'name':row[0], 'description': row[1]})
            
    
#     # # flash_cards = llmer.to_anki(flashcard_text)
#     my_model = genanki.Model(
#         random.randrange(1 << 30, 1 << 31),
#         'Simple Model',
#         fields=[
#             {'name': 'Question'},
#             {'name': 'Answer'},
#         ],
#         templates=[
#             {
#                 'name': 'Card 1',
#                 'qfmt': '{{Question}}',
#                 'afmt': '{{FrontSide}}<hr id="answer">{{Answer}}',
#             },
#         ])
#     my_deck = genanki.Deck(
#         random.randrange(1 << 30, 1 << 31),
#         "TFv2")

#     for card in flash_cards:
#         my_deck.add_note(genanki.Note(
#             model=my_model,
#             fields=[card['name'], card['description']]))

#     genanki.Package(my_deck).write_to_file('output.apkg')

#     return 'ok'
