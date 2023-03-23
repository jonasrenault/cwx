from datetime import datetime
from enum import Enum
from pydantic import BaseModel
from typing import Optional
from beanie import Document, Link
from .users import User
from .walls import Route


class CommentBase(BaseModel):
    user: Link[User]
    route: Link[Route]
    created_on: datetime = datetime.now()
    updated_on: Optional[datetime]


class Vote(Document, CommentBase):
    grade: str


class Comment(Document, CommentBase):
    comment: str


class TopType(str, Enum):
    TOPROPE = "TOPROPE"
    LEAD = "LEAD"
    PROJECT = "PROJECT"


class Top(Document, CommentBase):
    type: TopType
