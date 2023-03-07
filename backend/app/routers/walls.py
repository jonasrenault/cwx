from typing import List, Optional, Any

from fastapi import APIRouter, Body, Depends
from pymongo import errors
from beanie import WriteRules, PydanticObjectId
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


@router.get("/{id}/routes", response_model=List[schemas.Route])
async def get_wall_routes(
    id: PydanticObjectId,
):
    """
    Get routes for wall
    """
    wall = await models.Wall.get(id, fetch_links=True)
    return wall.routes


@router.get("/routes", response_model=List[schemas.Route])
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

    voies_DG = fixtures.voies_LP_devers_gauche()
    area = la_plaine.areas[0]
    routes = []
    for voie in voies_DG:
        voie.area = area
        routes.append(await voie.create())

    voies_LP_CG = fixtures.voies_LP_cirque_gauche()
    area = la_plaine.areas[1]
    for voie in voies_LP_CG:
        voie.area = area
        routes.append(await voie.create())

    voies_LP_proue = fixtures.voies_LP_proue()
    area = la_plaine.areas[2]
    for voie in voies_LP_proue:
        voie.area = area
        routes.append(await voie.create())

    voies_CD = fixtures.voies_LP_cirque_droit()
    area = la_plaine.areas[3]
    for voie in voies_CD:
        voie.area = area
        routes.append(await voie.create())

    voies_LP_petit_toit = fixtures.voies_LP_petit_toit()
    area = la_plaine.areas[4]
    for voie in voies_LP_petit_toit:
        voie.area = area
        routes.append(await voie.create())

    voies_LP_DD = fixtures.voies_LP_DD()
    area = la_plaine.areas[5]
    for voie in voies_LP_DD:
        voie.area = area
        routes.append(await voie.create())

    la_plaine.routes = routes
    la_plaine = await la_plaine.save(link_rule=WriteRules.WRITE)

    voies_CG = fixtures.voies_CN_cirque_gauche()
    area = croix_nivert.areas[1]
    routes = []
    for voie in voies_CG:
        voie.area = area
        routes.append(await voie.create())

    voies_CN_proue = fixtures.voies_CN_proue()
    area = croix_nivert.areas[2]
    for voie in voies_CN_proue:
        voie.area = area
        routes.append(await voie.create())

    voies_CN_CD = fixtures.voies_CN_cirque_droit()
    area = croix_nivert.areas[3]
    for voie in voies_CN_CD:
        voie.area = area
        routes.append(await voie.create())

    voies_dalle = fixtures.voies_CN_dalle()
    area = croix_nivert.areas[4]
    for voie in voies_dalle:
        voie.area = area
        routes.append(await voie.create())

    voies_VD = fixtures.voies_CN_vertical_droit()
    area = croix_nivert.areas[5]
    for voie in voies_VD:
        voie.area = area
        routes.append(await voie.create())

    croix_nivert.routes = routes
    croix_nivert = await croix_nivert.save(link_rule=WriteRules.WRITE)

    return [croix_niv, la_plaine]
