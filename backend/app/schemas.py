from pydantic import BaseModel
from typing import Optional
from datetime import date

class ProfileUpdate(BaseModel):
    user_id: int
    full_name: Optional[str]
    date_of_birth: Optional[date]
    place_of_birth: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
