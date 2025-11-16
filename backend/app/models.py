from sqlalchemy import Column, Integer, String, Date, Float
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    token = Column(String, unique=True, index=True, nullable=True)
    count = Column(Integer, default=0)
    full_name = Column(String, nullable=True)
    date_of_birth = Column(Date, nullable=True)
    place_of_birth = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
