from datetime import datetime
from typing import Optional, List, Union, Tuple
from beanie import Document, Indexed, Link

from ..schemas.walls import Area, Rect, Path


class Area(Document):
    name: str
    paths: List[Union[Rect, Path]]
    border: List[Tuple[int, int]]


class Route(Document):
    lane: str
    grade: str
    color: str
    setter: str
    set_on: datetime
    removed_on: Optional[datetime]
    area: Optional[Link[Area]]


class Wall(Document):
    key: Indexed(str, unique=True)
    name: str
    city: Optional[str] = None
    description: Optional[str] = None
    areas: Optional[List[Link[Area]]]
    routes: Optional[List[Link[Route]]]
