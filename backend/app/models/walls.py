from datetime import datetime
from typing import List, Optional, Tuple, Union

from pymongo import IndexModel, TEXT
from beanie import Document, Indexed, Link
from pydantic import BaseModel


class Shape(BaseModel):
    type: str
    color: str


class Rect(Shape):
    x: int
    y: int
    w: int
    h: int


class Path(Shape):
    points: List[Tuple[int, int]]


class Area(Document):
    name: str
    paths: List[Union[Rect, Path]]
    border: List[Tuple[int, int]]


class Wall(Document):
    key: Indexed(str, unique=True)
    name: str
    city: Optional[str] = None
    description: Optional[str] = None
    areas: Optional[List[Link[Area]]]


class Route(Document):
    lane: str
    grade: str
    color: str
    setter: str
    set_on: datetime
    removed_on: Optional[datetime]
    img_path: Optional[str]
    area: Optional[Link[Area]]
    wall: Optional[Link[Wall]]

    class Settings:
        indexes = [
            IndexModel(
                [("setter", TEXT), ("grade", TEXT)],
                name="route_text_index",
            ),
        ]
