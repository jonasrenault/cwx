from typing import List, Tuple, Optional, Union
from pydantic import BaseModel
from uuid import UUID


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


class Area(BaseModel):
    name: str
    paths: List[Union[Rect, Path]]
    border: List[Tuple[int, int]]


class Wall(BaseModel):
    uuid: UUID
    key: str
    name: str
    city: Optional[str] = None
    description: Optional[str] = None
    areas: Optional[List[Area]]
