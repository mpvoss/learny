
import datetime
from typing import List

from utils.utils import get_current_user
from database import get_db
from fastapi import APIRouter, Depends, HTTPException, Query
from models import FlashCard, Tag, User
from pydantic import BaseModel
from requests import Session
from routers.api_models import (FlashcardDisplay, FlashcardReview)
from sqlalchemy.orm import joinedload

router = APIRouter()

class FlashcardBase(BaseModel):
    term: str
    description: str

class FlashcardSaveRequest(BaseModel):
    tag: str
    flashCards: List[FlashcardBase] = []


@router.get("/flashcards", response_model=List[FlashcardDisplay])
def get_flashcards(db: Session = Depends(get_db), tag: List[str] = Query(None), due_filter: bool=False, current_user: User = Depends(get_current_user)):
    if tag:
        flashcards = db.query(FlashCard).join(FlashCard.tags).filter(Tag.name.in_(tag)).options(joinedload(FlashCard.tags)).all()
    else:
        flashcards = db.query(FlashCard).options(joinedload(FlashCard.tags)).all()
    
    current_date = datetime.datetime.now(datetime.timezone.utc).date()
    
    if not due_filter:
        return flashcards
    
    to_review = []
    for flashcard in flashcards:
        # Never been reviewed
        if not flashcard.last_reviewed_date:
            to_review.append(flashcard)
        elif flashcard.last_reviewed_date + datetime.timedelta(days=flashcard.interval) <= current_date:
            to_review.append(flashcard)
        
    return to_review


@router.post("/flashcards", response_model=str)
def save_flashcards(flashcardSaveRequest: FlashcardSaveRequest, db: Session = Depends(get_db), tag: List[str] = Query(None), current_user: User = Depends(get_current_user)):
    # if tag doesn't exist, create it
    new_tag = Tag(name=flashcardSaveRequest.tag)
    db_tag = db.query(Tag).filter(Tag.name == new_tag.name).first()
    
    if not db_tag:
        db.add(new_tag)
        db.commit()
        db.refresh(new_tag)

    for flashcard in flashcardSaveRequest.flashCards:
        new_flashcard = FlashCard(description=flashcard.description, term=flashcard.term)
        new_flashcard.tags.append(new_tag)
        db.add(new_flashcard)
    db.commit()
    return {"message": "Flashcard review saved successfully"}


@router.post("/flashcards/{id}/review")
def review_flashcard(id: int, flascardReview: FlashcardReview, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    flashcard = db.query(FlashCard).filter(FlashCard.id == id).first()
    quality = flascardReview.quality
    if not flashcard:
        raise HTTPException(status_code=404, detail="Item not found")

    # todo test this, chatgpt just winged it
    flashcard.quality_of_last_review = quality
    if quality < 3:
        flashcard.repetition = 0
        flashcard.interval = 1
    else:
        flashcard.repetition += 1
        flashcard.easiness_factor = max(1.3, flashcard.easiness_factor - 0.8 + 0.28 * quality - 0.02 * quality ** 2)
        flashcard.interval = 1 if flashcard.repetition == 1 else 6 if flashcard.repetition == 2 else round(
            flashcard.interval * flashcard.easiness_factor)
    flashcard.last_reviewed_date = datetime.datetime.now(datetime.timezone.utc)

    db.commit()
    return {"message": "Flashcard review saved successfully"}

