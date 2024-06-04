
import random
import string
from faker import Faker
from fastapi import APIRouter, Depends, Request
from requests import Session

from backend.database import get_db
from backend.models import FlashCard, Note, Tag
router = APIRouter()


@router.get("/questions")
def get_topics(request: Request, topic: str):
    return request.app.state.llm_service.get_questions(topic)


@router.get("/conceptmap")
def get_topics(request: Request, topic: str):
    return request.app.state.llm_service.get_concept_map(topic)



@router.get("/seed")
def seed(db: Session = Depends(get_db)):
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
#     flashcard_text = llmer.chat(f"Write 10 flashcards to help a student study {topic}")["text"]
#     flash_cards = llmer.to_anki(flashcard_text)
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
#         topic)

#     for card in flash_cards.cards:
#         my_deck.add_note(genanki.Note(
#             model=my_model,
#             fields=[card.name, card.description]))

#     genanki.Package(my_deck).write_to_file('output.apkg')

#     return 'ok'
