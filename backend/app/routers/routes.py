from typing import List, Optional

from fastapi import APIRouter
from beanie import PydanticObjectId

from .. import models

router = APIRouter()


@router.get("search", response_model=List[models.Route])
async def search_wall_routes(
    wall_id: PydanticObjectId | None = None,
    query: str | None = None,
    area_id: PydanticObjectId | None = None,
    color: str | None = None,
):
    search_query = models.Route.find(models.Route.wall.id == wall_id)
    if area_id is not None:
        search_query = search_query.find(models.Route.area.id == area_id)
    if color is not None:
        search_query = search_query.find(models.Route.color == color)
    search_query = search_query.find
    routes = await search_query.to_list()


@router.get("", response_model=List[models.Route])
async def get_routes(
    limit: Optional[int] = 100,
    offset: Optional[int] = 0,
):
    """
    Get list of routes
    """
    routes = (
        await models.Route.find_all(fetch_links=True)
        .skip(offset)
        .limit(limit)
        .to_list()
    )
    return routes
