import datetime

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, create_engine, Table, Float, Date
from sqlalchemy.orm import relationship, declarative_base, sessionmaker

DATABASE_URL = "postgresql://postgres:postgres@localhost:5433/learny"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Discussion(Base):
    __tablename__ = "discussions"
    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.datetime.now(datetime.UTC))
    messages = relationship("Message", back_populates="discussion")


class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    discussion_id = Column(Integer, ForeignKey("discussions.id"))
    sender = Column(String)  # "user" or "ai"
    content = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.now(datetime.UTC))

    discussion = relationship("Discussion", back_populates="messages")


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


class FlashCard(Base):
    __tablename__ = 'flashcards'
    id = Column(Integer, primary_key=True)
    term = Column(String, nullable=False)
    description = Column(String, nullable=False)
    tags = relationship("Tag", secondary=flashcard_tag_association_table, back_populates="flashcards", lazy='select')
    repetition = Column(Integer, default=0)
    easiness_factor = Column(Float, default=2.5)
    interval = Column(Integer, default=1)
    last_reviewed_date = Column(Date, default=datetime.datetime.now(datetime.UTC))
    quality_of_last_review = Column(Integer, default=0)
    created_date = Column(Date, default=datetime.datetime.now(datetime.UTC))


class Tag(Base):
    __tablename__ = 'tags'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    notes = relationship("Note", secondary=note_tag_association_table, back_populates="tags", lazy='select')
    flashcards = relationship("FlashCard", secondary=flashcard_tag_association_table, back_populates="tags", lazy='select')

    # How to cinldue lazy stuff in select
    # flashcard = db.query(Flashcard).options(selectinload(Flashcard.tags)).filter(Flashcard.id == flashcard_id).first()


