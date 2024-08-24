from functools import partial
from fastapi import APIRouter, Depends, Request
from requests import Session
from database import get_db
from models import User
from pydantic import BaseModel, TypeAdapter
from utils.utils import get_current_user, get_current_user_simple, save_token_usage

router = APIRouter()


class UserSchema(BaseModel):
    first_name: str
    last_name: str
    email: str
    role: str


@router.get("/questions", tags=["Util"])
def get_topics(
    request: Request,
    topic: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return request.app.state.llm_service.get_questions(
        topic, partial(save_token_usage, db, current_user.id, "suggest_questions")
    )


@router.post("/session", tags=["Auth"])
def create_session(current_user: User = Depends(get_current_user_simple)):
    ta = TypeAdapter(UserSchema)
    m = ta.validate_python(current_user.__dict__)
    return m
