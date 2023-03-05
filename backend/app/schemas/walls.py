from datetime import datetime
from typing import List, Tuple, Optional, Union
from pydantic import BaseModel, Field
from beanie import PydanticObjectId, Link


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


class AreaBase(BaseModel):
    id: PydanticObjectId = Field(..., alias="_id")
    name: str


class Area(AreaBase):
    paths: List[Union[Rect, Path]]
    border: List[Tuple[int, int]]


class Route(BaseModel):
    id: PydanticObjectId = Field(..., alias="_id")
    lane: str
    grade: str
    color: str
    setter: str
    set_on: datetime
    removed_on: Optional[datetime]
    area: Optional[Union[AreaBase, Link]]


class Wall(BaseModel):
    id: PydanticObjectId = Field(..., alias="_id")
    key: str
    name: str
    city: Optional[str] = None
    description: Optional[str] = None
    areas: Optional[List[Area]]
    routes: Optional[List[Route]]
