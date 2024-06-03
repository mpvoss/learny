

from typing import List
from pydantic import BaseModel


class CreateDiscussionRequest(BaseModel):
    topic: str

class CreateNoteRequest(BaseModel):
    content: str
    tag: str 

class ChatMessage(BaseModel):
    content: str


class CreateMessageRequest(BaseModel):
    content: str
    discussion_id: int
    sender: str

class CreateTagRequest(BaseModel):
    name: str


class TagBase(BaseModel):
    id: int
    name: str

class FlashcardBase(BaseModel):
    id: int
    question: str
    answer: str

class NoteBase(BaseModel):
    id: int
    content: str

# Nested Pydantic models for API output
class FlashcardDisplay(BaseModel):
    id: int
    term: str
    description: str
    tags: List[TagBase] = []

class NoteDisplay(BaseModel):
    id: int
    content: str
    title: str
    tags: List[TagBase] = []

    class Config:
        from_attributes=True
        orm_mode=True

class TagDisplay(BaseModel):
    id: int
    name: str
    flashcards: List[FlashcardBase] = []
    notes: List[NoteBase] = []

