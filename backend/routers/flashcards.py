
from backend.models import Discussion, FlashCard, Message
from typing import List
from backend.database import get_db
from fastapi import APIRouter, Depends, Query
from requests import Session
from backend.models import Note, Tag
from backend.routers.api_models import ChatMessage, CreateDiscussionRequest, CreateMessageRequest, CreateNoteRequest, FlashcardDisplay, NoteDisplay
from sqlalchemy.orm import joinedload
from backend import llmer

router = APIRouter()


@router.get("/flashcards", response_model=List[FlashcardDisplay])
def get_flashcards(db: Session = Depends(get_db), tag: List[str] = Query(None)):
    if tag:
        flashcards = db.query(FlashCard).join(FlashCard.tags).filter(Tag.name.in_(tag)).options(joinedload(FlashCard.tags)).all()
    else:
        flashcards = db.query(FlashCard).options(joinedload(FlashCard.tags)).all()
    return flashcards



#
# @app.post("/flashcards/{id}/review")
# def review_flashcard(id: int, quality: int, db: Session = Depends(get_db)):
#     flashcard = db.query(FlashCard).filter(FlashCard.id == id).first()
#
#     if not flashcard:
#         raise HTTPException(status_code=404, detail="Item not found")
#
#     # todo test this, chatgpt just winged it
#     flashcard.quality_of_last_review = quality
#     if quality < 3:
#         flashcard.repetition = 0
#         flashcard.interval = 1
#     else:
#         flashcard.repetition += 1
#         flashcard.easiness_factor = max(1.3, flashcard.easiness_factor - 0.8 + 0.28 * quality - 0.02 * quality ** 2)
#         flashcard.interval = 1 if flashcard.repetition == 1 else 6 if flashcard.repetition == 2 else round(
#             flashcard.interval * flashcard.easiness_factor)
#     flashcard.last_reviewed_date = datetime.utcnow()
#
#     db.commit()
#     return {"Hello": "World"}
#
