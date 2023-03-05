from typing import Optional, List
from pydantic import Field
from beanie import Document, Indexed
from uuid import UUID, uuid4

from ..schemas.walls import Area, Rect, Path


class Wall(Document):
    uuid: Indexed(UUID, unique=True) = Field(default_factory=uuid4)
    key: Indexed(str, unique=True)
    name: str
    city: Optional[str] = None
    description: Optional[str] = None
    areas: Optional[List[Area]]
