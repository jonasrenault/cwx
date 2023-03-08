from __future__ import annotations

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


class AreaBase(Document):
    """
    Base model for Area, with `id` and `name` fields required
    """

    name: str


class Area(AreaBase):
    """
    Area model in DB with all fields.
    """

    paths: List[Union[Rect, Path]]
    border: List[Tuple[int, int]]


class WallBase(Document):
    """
    Base model for Wall, with `id`, `key` and `name` required fields.
    """

    key: Indexed(str, unique=True)
    name: str


class Wall(WallBase):
    city: Optional[str] = None
    description: Optional[str] = None
    areas: Optional[List[Link[Area]]]


class RouteBase(Document):
    """
    Base Route model.
    """

    lane: str
    grade: str
    color: str
    setter: str
    set_on: datetime
    removed_on: Optional[datetime]

    class Settings:
        indexes = [
            IndexModel(
                [("setter", TEXT), ("grade", TEXT)],
                name="route_text_index",
            ),
        ]


class Route(RouteBase):
    area: Optional[Link[Area]]
    wall: Optional[Link[Wall]]
