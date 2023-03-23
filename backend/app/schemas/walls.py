from typing import List, Optional, Union, Tuple, Any
from pydantic import BaseModel
from pydantic.utils import GetterDict
from datetime import datetime
from beanie import PydanticObjectId
from .users import UserProfile
from ..models import Rect, Path, TopType


class LinkGetter(GetterDict):
    def get(self, key: str, default: Any) -> Any:
        try:
            return getattr(self._obj.ref, key)
        except (AttributeError, KeyError):
            return default


class Link(BaseModel):
    id: PydanticObjectId
    collection: str

    class Config:
        orm_mode = True
        getter_dict = LinkGetter


class Area(BaseModel):
    id: PydanticObjectId
    name: Optional[str]
    paths: Optional[List[Union[Rect, Path]]]
    border: Optional[List[Tuple[int, int]]]


class Wall(BaseModel):
    id: PydanticObjectId
    key: Optional[str]
    name: Optional[str]
    city: Optional[str] = None
    description: Optional[str] = None
    areas: Optional[List[Area]]

    class Config:
        orm_mode = True


class Route(BaseModel):
    id: PydanticObjectId
    lane: str
    grade: str
    color: str
    setter: str
    set_on: datetime
    removed_on: Optional[datetime]
    img_path: Optional[str]
    area: Optional[Link]
    wall: Optional[Link]

    class Config:
        orm_mode = True


class Vote(BaseModel):
    id: PydanticObjectId
    grade: str
    user: UserProfile | Link
    route: Route | Link


class TopBase(BaseModel):
    id: PydanticObjectId
    user: UserProfile | Link
    type: TopType

    class Config:
        orm_mode = True


class Top(TopBase):
    route: Route | Link

    class Config:
        orm_mode = True


class WallWithRoutes(Wall):
    routes: Optional[List[Route]]


class RouteWithVotes(Route):
    tops: Optional[List[TopBase]]
    votes: Optional[List[Vote]]
