from typing import List, Optional

from fastapi import APIRouter
from beanie import WriteRules, PydanticObjectId

from .. import schemas, models
from ..fixtures import fixtures

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


@router.get("/{id}/routes", response_model=List[models.Route])
async def get_wall_routes(
    id: PydanticObjectId,
):
    """
    Get routes for wall
    """
    routes = await models.Route.find(models.Route.wall.id == id).to_list()
    return routes


async def create_routes(routes, wall, area) -> List[models.Route]:
    for voie in routes:
        voie.area = area
        voie.wall = wall
        await voie.create()


@router.post("", response_model=List[models.Wall])
async def create_fixtures():
    """
    Populate walls with fixture data
    """
    await models.Route.find_all().delete()
    await models.Area.find_all().delete()
    await models.Wall.find_all().delete()
    la_plaine = fixtures.create_la_plaine()
    croix_nivert = fixtures.create_croix_nivert()
    croix_nivert = await croix_nivert.insert(link_rule=WriteRules.WRITE)
    la_plaine = await la_plaine.insert(link_rule=WriteRules.WRITE)

    ## Create LP routes
    lp_routes = [
        fixtures.voies_LP_devers_gauche,
        fixtures.voies_LP_cirque_gauche,
        fixtures.voies_LP_proue,
        fixtures.voies_LP_cirque_droit,
        fixtures.voies_LP_petit_toit,
        fixtures.voies_LP_DD,
    ]
    for idx, r_func in enumerate(lp_routes):
        await create_routes(r_func(), la_plaine, la_plaine.areas[idx])

    # Create CN routes
    cn_routes = [
        fixtures.voies_CN_cirque_gauche,
        fixtures.voies_CN_proue,
        fixtures.voies_CN_cirque_droit,
        fixtures.voies_CN_dalle,
        fixtures.voies_CN_vertical_droit,
    ]
    for idx, r_func in enumerate(cn_routes):
        await create_routes(r_func(), croix_nivert, croix_nivert.areas[idx + 1])

    return [croix_nivert, la_plaine]
