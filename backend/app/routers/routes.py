from typing import List, Optional
from fastapi import APIRouter, Depends, Body, HTTPException
from beanie import PydanticObjectId
from datetime import datetime

from ..models import User, Route, Top, TopType, Vote
from .. import schemas
from ..auth.auth import get_current_active_user

router = APIRouter()


@router.get("", response_model=List[schemas.Route])
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
) -> schemas.Top:
    """
    Toggle top status for a route and current_user
    """
    route = await Route.get(id)
    if route is None:
        raise HTTPException(status_code=404, detail="Route does not exist.")

    top = await Top.find_one(
        Top.user.id == current_user.id, Top.route.id == id, Top.type == type
    )
    if top:
        await top.delete()
        top.route = route
        top.user = current_user
    else:
        top = Top(user=current_user, route=route, type=type, created_on=datetime.now())
        top = await top.save()

    return schemas.Top(**top.dict(exclude_unset=True))


@router.post("/{id}/vote", response_model=schemas.Vote)
async def vote_route(
    id: PydanticObjectId,
    grade: str = Body(..., embed=True),
    current_user: User = Depends(get_current_active_user),
):
    route = await Route.get(id)
    if route is None:
        raise HTTPException(status_code=404, detail="Route does not exist.")

    vote = await Vote.find_one(Vote.user.id == current_user.id, Vote.route.id == id)
    if vote:
        # update vote grade
        vote.grade = grade
        vote.updated_on = datetime.now()
    else:
        # create new vote
        vote = Vote(
            user=current_user, route=route, grade=grade, created_on=datetime.now()
        )

    await vote.save()
    return vote


@router.get("/{id}")
async def fetch_route(
    id: PydanticObjectId,
    type: TopType = None,
) -> schemas.RouteWithVotes:
    """
    Get route and fetch related info such as tops and votes.
    """
    route = await Route.get(id)
    if route is None:
        raise HTTPException(status_code=404, detail="Route does not exist.")

    tops = Top.find(Top.route.id == id, fetch_links=True)
    if type is not None:
        tops = tops.find(Top.type == type)
    tops = await tops.to_list()

    votes = await Vote.find(Vote.route.id == id, fetch_links=True).to_list()

    response = schemas.RouteWithVotes(
        tops=tops, votes=votes, **route.dict(exclude_unset=True)
    )
    return response
