from typing import Optional, List
from enum import Enum
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from beanie import Document, Indexed
from uuid import UUID, uuid4
from .walls import Route


class TopType(str, Enum):
    TOPROPE = "TOPROPE"
    LEAD = "LEAD"
    PROJECT = "PROJECT"


class Top(BaseModel):
    route: Route
    created_on: datetime
    type: TopType


class User(Document):
    uuid: Indexed(UUID, unique=True) = Field(default_factory=uuid4)
    email: Indexed(EmailStr, unique=True)
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    hashed_password: Optional[str] = None
    provider: Optional[str] = None
    picture: Optional[str] = None
    is_active: bool = True
    is_superuser: bool = False
    tops: Optional[List[Top]]
