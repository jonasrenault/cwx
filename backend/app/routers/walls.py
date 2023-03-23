from typing import List, Optional

from beanie import PydanticObjectId
from fastapi import APIRouter

from .. import models, schemas

router = APIRouter()


@router.get("", response_model=List[schemas.WallWithRoutes])
async def get_walls(
    fetch_routes: bool = False,
    limit: Optional[int] = 10,
    offset: Optional[int] = 0,
):
    """
    Get list of walls
    """
    walls = (
        await models.Wall.find_all(fetch_links=True).skip(offset).limit(limit).to_list()
    )

    if not fetch_routes:
        return walls

    response = []
    for wall in walls:
        routes = await models.Route.find(models.Route.wall.id == wall.id).to_list()
        response.append(schemas.WallWithRoutes(**wall.dict(), routes=routes))
    return response


@router.get("/{id}", response_model=schemas.WallWithRoutes)
async def get_wall(
    id: PydanticObjectId,
    fetch_routes: bool = False,
):
    """
    Get a wall
    """
    wall = await models.Wall.get(id, fetch_links=True)

    if not fetch_routes:
        return wall

    routes = await models.Route.find(models.Route.wall.id == wall.id).to_list()
    response = schemas.WallWithRoutes(**wall.dict(), routes=routes)
    return response


@router.get("/{id}/routes", response_model=List[models.Route])
async def get_wall_routes(
    id: PydanticObjectId,
):
    """
    Get routes for wall
    """
    routes = await models.Route.find(models.Route.wall.id == id).to_list()
    return routes
