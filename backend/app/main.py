from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from . import models, crud, schemas
import os

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_ORIGIN", "*")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post('/register')
def register(payload: dict, db: Session = Depends(get_db)):
    username = payload.get('username')
    password = payload.get('password')
    if not username or not password:
        raise HTTPException(400, 'username & password required')
    existing = db.query(models.User).filter(models.User.username == username).first()
    if existing:
        raise HTTPException(400, 'username exists')
    user = crud.create_user(db, username, password)
    return {"id": user.id, "username": user.username}

@app.post('/login')
def login(payload: dict, db: Session = Depends(get_db)):
    username = payload.get('username')
    password = payload.get('password')
    token = crud.authenticate(db, username, password)
    if not token:
        raise HTTPException(401, 'invalid credentials')
    return {"token": token}

@app.post('/logout')
def logout(authorization: str = Header(None), db: Session = Depends(get_db)):
    token = authorization
    if not token:
        raise HTTPException(401, 'token required')
    ok = crud.logout(db, token)
    if not ok:
        raise HTTPException(400, 'invalid token')
    return {"ok": True}

@app.get('/me')
def me(authorization: str = Header(None), db: Session = Depends(get_db)):
    token = authorization
    user = crud.get_user_by_token(db, token)
    if not user:
        raise HTTPException(401, 'invalid token')
    return {"id": user.id, "username": user.username, "count": user.count, "full_name": user.full_name, "date_of_birth": user.date_of_birth, "place_of_birth": user.place_of_birth, "latitude": user.latitude, "longitude": user.longitude}

@app.get('/users')
def users(db: Session = Depends(get_db)):
    rows = crud.list_users(db)
    return [{"id": r.id, "username": r.username, "count": r.count, "full_name": r.full_name, "date_of_birth": r.date_of_birth, "place_of_birth": r.place_of_birth, "latitude": r.latitude, "longitude": r.longitude} for r in rows]

@app.post('/users/{user_id}/increment')
def increment(user_id: int, db: Session = Depends(get_db), authorization: str = Header(None)):
    token = authorization
    if not token:
        raise HTTPException(401, 'token required')
    auth_user = crud.get_user_by_token(db, token)
    if not auth_user:
        raise HTTPException(401, 'invalid token')
    user = crud.increment_count(db, user_id)
    if not user:
        raise HTTPException(404, 'user not found')
    return {"id": user.id, "count": user.count}

@app.post('/profile/update')
def profile_update(data: schemas.ProfileUpdate, db: Session = Depends(get_db), authorization: str = Header(None)):
    token = authorization
    auth_user = crud.get_user_by_token(db, token)
    if not auth_user:
        raise HTTPException(401, 'invalid token')
    user = crud.update_profile(db, data)
    if not user:
        raise HTTPException(404, 'user not found')
    return {"id": user.id, "full_name": user.full_name, "date_of_birth": user.date_of_birth, "place_of_birth": user.place_of_birth, "latitude": user.latitude, "longitude": user.longitude}
