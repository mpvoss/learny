
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
from fastapi import UploadFile, File
from supermemo2 import first_review, review
import time

router = APIRouter()

class FlashcardBase(BaseModel):
    term: str
    description: str

class FlashcardSaveRequest(BaseModel):
    tag: str
    flashCards: List[FlashcardBase] = []


@router.get("/flashcards", response_model=List[FlashcardDisplay], tags=["Flashcards"])
def get_flashcards(db: Session = Depends(get_db), tag: List[str] = Query(None), due_filter: bool=False, current_user: User = Depends(get_current_user)):
    if tag:
        flashcards = db.query(FlashCard).join(FlashCard.tags).filter(Tag.name.in_(tag)).filter(FlashCard.user_id == current_user.id).options(joinedload(FlashCard.tags)).all()
    else:
        flashcards = db.query(FlashCard).filter(FlashCard.user_id == current_user.id).options(joinedload(FlashCard.tags)).all()
    
    current_date = datetime.datetime.now(datetime.timezone.utc).date()
    
    if not due_filter:
        return flashcards
    
    return filter_flashcards_due(flashcards, current_date)


def filter_flashcards_due(flashcards:List[FlashCard], current_date: datetime.date):
    to_review = []
    for flashcard in flashcards:
        if not flashcard.last_reviewed_date:
            to_review.append(flashcard)
        elif flashcard.last_reviewed_date + datetime.timedelta(days=flashcard.interval) <= current_date:
            to_review.append(flashcard)
    return to_review    


@router.post("/flashcards", tags=["Flashcards"])
def save_flashcards(flashcardSaveRequest: FlashcardSaveRequest, db: Session = Depends(get_db), tag: List[str] = Query(None), current_user: User = Depends(get_current_user)):
    # if tag doesn't exist, create it
    new_tag = Tag(name=flashcardSaveRequest.tag, user_id=current_user.id)
    
    db_tag = db.query(Tag).filter(Tag.name == new_tag.name, Tag.user_id==current_user.id).first()
    
    if not db_tag:
        db.add(new_tag)
        db.commit()
        db.refresh(new_tag)
    else:
        new_tag = db_tag

    for flashcard in flashcardSaveRequest.flashCards:
        new_flashcard = FlashCard(description=flashcard.description, term=flashcard.term, user_id=current_user.id)
        new_flashcard.tags.append(new_tag)
        db.add(new_flashcard)
    db.commit()
    return {"message": "Flashcard review saved successfully"}


@router.post("/flashcards/{id}/review", tags=["Flashcards"])
def review_flashcard(id: int, flascardReview: FlashcardReview, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    flashcard = db.query(FlashCard).filter(FlashCard.id == id, FlashCard.user_id==current_user.id).first()
    quality = flascardReview.quality
    if not flashcard:
        raise HTTPException(status_code=404, detail="Item not found")

    # 0: complete blackout,    -
    # 1: incorrect response;    -
    # 2: correct response after a hesitation; 
    # 3: correct response recalled with serious difficulty;   -
    # 4: correct response after a hesitation; 
    # 5: perfect response   -
    # if quality < 3:
    #     flashcard.repetition = 0
    #     flashcard.interval = 0
    # else:
    #     flashcard.repetition += 1
    #     flashcard.easiness_factor = max(1.3, flashcard.easiness_factor - 0.8 + 0.28 * quality - 0.02 * quality ** 2)
    #     flashcard.interval = 1 if flashcard.repetition == 1 else 6 if flashcard.repetition == 2 else round(
    #         flashcard.interval * flashcard.easiness_factor)
    


    if not flashcard.last_reviewed_date:
        stats = first_review(quality)
    else:
        stats = review(quality, flashcard.easiness_factor,flashcard.interval, flashcard.repetition)

    flashcard.repetition = stats["repetitions"]
    flashcard.easiness_factor = stats["easiness"]
    flashcard.interval = stats["interval"]
    flashcard.last_reviewed_date = datetime.datetime.now(datetime.timezone.utc)
    flashcard.quality_of_last_review = quality

    db.commit()
    return {"message": "Flashcard review saved successfully"}


# @router.post("/flashcards/upload", tags=["Flashcards"])
# def upload_flashcards(file: UploadFile = File(...), db: Session = Depends(get_db)):
#     # Read the contents of the uploaded file
#     contents = file.file.read().decode("utf-8")
    
#     # Split the contents into lines
#     lines = contents.split("\n")
    
#     # Remove any empty lines
#     lines = [line for line in lines if line.strip()]


    
#     # Create the "prod" tag if it doesn't exist
#     tag_name = "prod"
#     db_tag = db.query(Tag).filter(Tag.name == tag_name).first()
#     if not db_tag:
#         new_tag = Tag(name=tag_name)
#         db.add(new_tag)
#         db.commit()
#         db.refresh(new_tag)
#     else:
#         new_tag = db_tag
    
#     # Parse the flashcards and save them to the database
#     for line in lines:
#         term, description = line.split("\t")
#         existing_flashcard = db.query(FlashCard).filter(FlashCard.term == term).first()
#         if existing_flashcard:
#             continue  # Skip this flashcard if it already exists
#         flashcard = FlashCard(term=term, description=description, user_id='000262e7-84ad-4a35-ad64-282d0f031123')
#         flashcard.tags.append(new_tag)
#         db.add(flashcard)
    
#     db.commit()
    
#     return {"message": "Flashcards uploaded successfully"}

