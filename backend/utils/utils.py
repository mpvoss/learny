
import logging
import os
from typing import Optional
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, Request, status
from jose import JWTError, jwt
from requests import Session
from database import get_db
from models import TokenUsage, User

SECRET_KEY = os.getenv("SUPABASE_JWT_SECRET_KEY", None)
ALGORITHM = "HS256" 

def get_current_user(request: Request, db: Session = Depends(get_db)):
    token: Optional[str] = request.headers.get('Authorization')
    
    try:
        user = get_current_user_work(token, db)

        if user.role != 'USER' and user.role != 'SUPER_USER':
            logging.error("Invalid role, rejecting")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Insufficient permissions",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return user
    except JWTError or HTTPException as e:
        logging.error("Invalid token", e)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user_simple(request: Request, db: Session = Depends(get_db)):
    token: Optional[str] = request.headers.get('Authorization')
    return get_current_user_work(token,db)


def get_current_user_work( token: Optional[str], db: Session):
    if token is None:
        logging.error("No token found")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        token = token.split(' ')[1].strip()
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], audience="authenticated")

        email = payload['email']
        uuid = payload['sub']

        user = db.query(User).filter(User.id == uuid).first()

        # If there are no users, create a super user (otherwise create a pending user)
        if not user:
            total_count = db.query(User).count()
            role = 'SUPER_USER' if total_count == 0 else 'PENDING_USER'
            user = User(id=uuid, email=email, role=role, first_name='firstname', last_name='lastname')
            db.add(user)
            db.commit()
            db.refresh(user)

        return user
    except JWTError as e:
        logging.error("Invalid token: %s", e)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def capitalize_and_remove_period(txt: str):
    txt = txt[0].upper() + txt[1:]  # Capitalize only the first letter
    if txt.endswith('.'):
        txt = txt[:-1]
    return txt


def save_token_usage(db: Session, user_id: str, activity:str, usage:dict):
    tc = TokenUsage(user_id=user_id, prompt_tokens=usage.prompt_tokens, completion_tokens=usage.completion_tokens, activity=activity)
    db.add(tc)
    db.commit()