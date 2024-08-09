import datetime
from datetime import datetime
from backend.models import FlashCard
from backend.routers.flashcards import filter_flashcards_due
from supermemo2 import first_review, review



def test_supermemo2():

    fr = first_review(0, "2024-01-01")
    for x in range(10):
        second_review = review(4, **fr)
        print(second_review["review_datetime"])
        
    # assert "2024-06-23" in fr["review_datetime"]

    # fr = first_review(4, "2024-06-22")
    # assert "2024-06-23" in fr["review_datetime"]

    # print(fr["review_datetime"])

    assert True

    # second review
    # second_review = review(4, first_review["easiness"], first_review["interval"], first_review["repetitions"], first_review["review_datetime"])
    # # or just unpack the first review dictionary
    # second_review = review(4, **first_review)
    # # second_review prints similar to example above.
    # pass


# def test_flashcard_due_in_future():
#     flashcards = []
#     a = FlashCard(interval=1, last_reviewed_date=datetime.datetime(2025, 1, 1))
#     flashcards.append(a)
    
#     datetime_obj = datetime.datetime(2020, 1, 1)
#     result = filter_flashcards_due(flashcards, datetime_obj)
#     assert len(result) == 0, "Test Failed: Expected 0 flashcards to be due, got " + str(len(result))


# def test_flashcard_due():
#     flashcards = []
#     a = FlashCard(interval=1, last_reviewed_date=datetime.datetime(2019, 1, 1))
#     flashcards.append(a)
    
#     datetime_obj = datetime.datetime(2020, 1, 1)
#     result = filter_flashcards_due(flashcards, datetime_obj)
#     assert len(result) == 0, "Test Failed: Expected 0 flashcards to be due, got " + str(len(result))


