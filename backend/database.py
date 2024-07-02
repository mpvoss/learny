from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import json
import pydantic.json

from models import DATABASE_URL

def _custom_json_serializer(*args, **kwargs) -> str:
    """
    Encodes json in the same way that pydantic does.
    """
    return json.dumps(*args, default=pydantic.json.pydantic_encoder, **kwargs)

engine = create_engine(DATABASE_URL, json_serializer=_custom_json_serializer)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
        
    finally:
        db.close()