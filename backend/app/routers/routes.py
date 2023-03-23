from typing import List, Optional
from fastapi import APIRouter, Depends, Body
from beanie import PydanticObjectId
from datetime import datetime

from ..models import User, Route, Top, TopType
from ..auth.auth import get_current_active_user

router = APIRouter()


@router.get("", response_model=List[Route])
async def get_routes(
    limit: Optional[int] = 100,
    offset: Optional[int] = 0,
):
    """
    Get list of routes
    """
    routes = await Route.find_all(fetch_links=True).skip(offset).limit(limit).to_list()
    return routes


@router.post("/{id}/top")
async def top_route(
    id: PydanticObjectId,
    type: TopType = Body(..., embed=True),
    current_user: User = Depends(get_current_active_user),
) -> Route:
    route = await Route.get(id)

    top = (
        [t for t in current_user.tops if t.route.id == id and t.type == type]
        if current_user.tops
        else None
    )
    if top:
        # remove existing top
        current_user.tops[:] = [
            t for t in current_user.tops if t.route.id != id or t.type != type
        ]
        if not current_user.tops:
            current_user.tops = None
    else:
        # create new top
        tops = [] if not current_user.tops else current_user.tops
        tops.append(Top(route=route, type=type, created_on=datetime.now()))
        current_user.tops = tops

    await current_user.save()

    # TODO: dispatch event
    return route


@router.get("/{id}/tops")
async def get_route_toppers(
    id: PydanticObjectId,
    type: TopType = None,
    current_user: User = Depends(get_current_active_user),
) -> List[User]:
    if type is not None:
        users = await User.find(
            {"tops": {"$elemMatch": {"route._id": id, "type": type}}}
        ).to_list()
    else:
        users = await User.find({"tops.route._id": id}).to_list()
    return users
