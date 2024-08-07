import datetime
from backend.models import FlashCard
from backend.routers.flashcards import filter_flashcards_due


def test_flashcard_due_in_future():
    flashcards = []
    a = FlashCard(interval=1, last_reviewed_date=datetime.datetime(2025, 1, 1))
    flashcards.append(a)
    
    datetime_obj = datetime.datetime(2020, 1, 1)
    result = filter_flashcards_due(flashcards, datetime_obj)
    assert len(result) == 0, "Test Failed: Expected 0 flashcards to be due, got " + str(len(result))


def test_flashcard_due():
    flashcards = []
    a = FlashCard(interval=1, last_reviewed_date=datetime.datetime(2019, 1, 1))
    flashcards.append(a)
    
    datetime_obj = datetime.datetime(2020, 1, 1)
    result = filter_flashcards_due(flashcards, datetime_obj)
    assert len(result) == 0, "Test Failed: Expected 0 flashcards to be due, got " + str(len(result))
