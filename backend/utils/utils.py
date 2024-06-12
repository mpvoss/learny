
import logging
import os
from typing import Optional
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, Request, status
from jose import JWTError, jwt
from requests import Session
from database import get_db
from models import User

SECRET_KEY = os.getenv("SUPABASE_JWT_SECRET_KEY", None)
ALGORITHM = "HS256" 

def get_current_user(request: Request, db: Session = Depends(get_db)):
    token: Optional[str] = request.headers.get('Authorization')
    
    try:
        user = get_current_user_work(token, db)

        # TODO add real rbac
        if user.email != 'matthewpvoss@gmail.com':
            logging.error("Not matthew, rejecting")
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

        # db = get_db().session
        user = db.query(User).filter(User.id == uuid).first()

        if not user:
            logging.error("User not found, creating")
            role = 'SUPER_USER' if email == 'matthewpvoss@gmail.com' else 'PENDING_USER'
            user = User(id=uuid, email=email, role=role, first_name='firstname', last_name='lastname')
            db.add(user)
            db.commit()
            db.refresh(user)

        return user
    except JWTError as e:
        logging.error("Invalid token", e)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

