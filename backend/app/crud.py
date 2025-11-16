from sqlalchemy.orm import Session
from . import models
import bcrypt
import uuid
from datetime import date

def create_user(db: Session, username: str, password: str):
    pw_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    user = models.User(username=username, password_hash=pw_hash)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def authenticate(db: Session, username: str, password: str):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        return None
    if bcrypt.checkpw(password.encode(), user.password_hash.encode()):
        token = str(uuid.uuid4())
        user.token = token
        db.commit()
        return token
    return None

def logout(db: Session, token: str):
    user = db.query(models.User).filter(models.User.token == token).first()
    if not user:
        return False
    user.token = None
    db.commit()
    return True

def get_user_by_token(db: Session, token: str):
    return db.query(models.User).filter(models.User.token == token).first()

def list_users(db: Session):
    return db.query(models.User).all()

def increment_count(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        return None
    user.count += 1
    db.commit()
    db.refresh(user)
    return user

def update_profile(db: Session, data):
    user = db.query(models.User).filter(models.User.id == data.user_id).first()
    if not user:
        return None
    if data.full_name is not None:
        user.full_name = data.full_name
    if data.date_of_birth is not None:
        user.date_of_birth = data.date_of_birth
    if data.place_of_birth is not None:
        user.place_of_birth = data.place_of_birth
    if data.latitude is not None:
        user.latitude = data.latitude
    if data.longitude is not None:
        user.longitude = data.longitude
    db.commit()
    db.refresh(user)
    return user
