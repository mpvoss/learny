import datetime
import os

from sqlalchemy import JSON, Boolean, Column, Integer, String, DateTime, ForeignKey, create_engine, Table, Float, Date, func
from sqlalchemy.orm import relationship, declarative_base, sessionmaker
from utils.env_init import build_db_url



DATABASE_URL = build_db_url()

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Discussion(Base):
    __tablename__ = "discussions"
    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.datetime.now(datetime.UTC))
    messages = relationship("Message", back_populates="discussion")
    user_id = Column(String, ForeignKey('users.id'), nullable=False)
    user = relationship("User", back_populates="discussions")


class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    discussion_id = Column(Integer, ForeignKey("discussions.id"))
    sender = Column(String)  # "user" or "ai"
    content = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.UTC))
    show_actions = Column(Boolean, default=False, nullable=False)
    discussion = relationship("Discussion", back_populates="messages")
    diagrams = relationship("MessageDiagram", back_populates="message")
    rag_snippets = relationship("RagSnippet", back_populates="message")


class MessageDiagram(Base):
    __tablename__ = "message_diagrams"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    type = Column(String)
    data = Column(JSON)
    message_id = Column(Integer, ForeignKey("messages.id"))
    message = relationship("Message", back_populates="diagrams")

note_tag_association_table = Table(
    'note_tag_association', Base.metadata,
    Column('note_id', Integer, ForeignKey('notes.id')),
    Column('tag_id', Integer, ForeignKey('tags.id'))
)

# Additional association table for the FlashCard and Tag relationship
flashcard_tag_association_table = Table(
    'flashcard_tag_association', Base.metadata,
    Column('flashcard_id', Integer, ForeignKey('flashcards.id')),
    Column('tag_id', Integer, ForeignKey('tags.id'))
)


class Note(Base):
    __tablename__ = 'notes'
    id = Column(Integer, primary_key=True)
    content = Column(String, nullable=False)
    title = Column(String, nullable=False)
    tags = relationship("Tag", secondary=note_tag_association_table, back_populates="notes", lazy='select')
    created_date = Column(Date, default=datetime.datetime.now(datetime.UTC))
    user_id = Column(String, ForeignKey('users.id'), nullable=False)
    user = relationship("User", back_populates="notes")


class FlashCard(Base):
    __tablename__ = 'flashcards'
    id = Column(Integer, primary_key=True)
    term = Column(String, nullable=False)
    description = Column(String, nullable=False)
    tags = relationship("Tag", secondary=flashcard_tag_association_table, back_populates="flashcards", lazy='select')
    repetition = Column(Integer, default=0)
    easiness_factor = Column(Float, default=2.5)
    interval = Column(Integer, default=1)
    last_reviewed_date = Column(Date)
    quality_of_last_review = Column(Integer, default=0)
    created_date = Column(Date, default=datetime.datetime.now(datetime.UTC))
    user_id = Column(String, ForeignKey('users.id'), nullable=False)
    user = relationship("User", back_populates="flashcards")


class Tag(Base):
    __tablename__ = 'tags'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    notes = relationship("Note", secondary=note_tag_association_table, back_populates="tags", lazy='select')
    flashcards = relationship("FlashCard", secondary=flashcard_tag_association_table, back_populates="tags", lazy='select')
    user_id = Column(String, ForeignKey('users.id'), nullable=False)
    user = relationship("User", back_populates="tags")

    # How to cinldue lazy stuff in select
    # flashcard = db.query(Flashcard).options(selectinload(Flashcard.tags)).filter(Flashcard.id == flashcard_id).first()


class User(Base):
    __tablename__ = 'users'
    id = Column(String, nullable=False,unique=True, primary_key=True)
    role = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    discussions = relationship("Discussion", back_populates="user")
    notes = relationship("Note", back_populates="user")
    documents = relationship("Document", back_populates="user")
    flashcards = relationship("FlashCard", back_populates="user")
    tags = relationship("Tag", back_populates="user")
    token_usages = relationship("TokenUsage", back_populates="user")


class Document(Base):
    __tablename__ = 'documents'
    id = Column(Integer, primary_key=True)
    # user = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    created_date = Column(DateTime, default=lambda: datetime.datetime.now(datetime.UTC))
    user_id = Column(String, ForeignKey('users.id'), nullable=False)
    user = relationship("User", back_populates="documents")


class RagSnippet(Base):
    __tablename__ = 'rag_snippets'
    id = Column(Integer, primary_key=True)
    message_id = Column(Integer, ForeignKey('messages.id'))
    snippet = Column(String)
    page_id = Column(String)
    document_name = Column(String)
    message = relationship("Message", back_populates="rag_snippets")


class TokenUsage(Base):
    __tablename__ = 'token_usages'
    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey('users.id'), nullable=False)
    prompt_tokens = Column(Integer, nullable=False)
    completion_tokens = Column(Integer, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    activity = Column(String, nullable=False)

    user = relationship("User", back_populates="token_usages")