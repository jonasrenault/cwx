from typing import List, Optional, Any

from fastapi import APIRouter, Body, Depends
from pymongo import errors
from beanie import WriteRules
from pydantic.networks import EmailStr

from .. import schemas, models
from ..fixtures import fixtures

router = APIRouter()


@router.get("", response_model=List[schemas.Wall])
async def get_walls(
    limit: Optional[int] = 10,
    offset: Optional[int] = 0,
):
    """
    Get list of walls
    """
    walls = (
        await models.Wall.find_all(fetch_links=True).skip(offset).limit(limit).to_list()
    )
    return walls


@router.get("/routes", response_model=List[schemas.Route])
async def get_routes(
    limit: Optional[int] = 10,
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
    print(routes)
    return routes


@router.post("", response_model=List[schemas.Wall])
async def create_fixtures():
    """
    Populate walls with fixture data
    """
    await models.Wall.find_all().delete()
    la_plaine = fixtures.create_la_plaine()
    croix_niv = fixtures.create_croix_nivert()
    croix_nivert = await croix_niv.insert(link_rule=WriteRules.WRITE)
    await la_plaine.insert(link_rule=WriteRules.WRITE)

    voies_CG = fixtures.voies_CN_cirque_gauche()
    area = croix_nivert.areas[1]
    routes = []
    for voie in voies_CG:
        voie.area = area
        routes.append(await voie.create())

    croix_nivert.routes = routes
    croix_nivert = croix_nivert.save(link_rule=WriteRules.WRITE)

    return [croix_niv, la_plaine]
