from typing import Any, List

from app import models
from app.auth.auth import (
    get_current_active_superuser,
)
from app.fixtures import fixtures
from fastapi import APIRouter, Depends
from beanie import WriteRules

router = APIRouter()


@router.get("/test-admin")
async def test_token(
    admin_user: models.User = Depends(get_current_active_superuser),
) -> Any:
    """
    Test access token
    """
    return {"message": "Current user is admin !"}


async def create_routes(routes, wall, area) -> List[models.Route]:
    for voie in routes:
        voie.area = area
        voie.wall = wall
        await voie.create()


@router.post("/fixtures", response_model=List[models.Wall])
async def create_fixtures(
    admin_user: models.User = Depends(get_current_active_superuser),
):
    """
    Populate DB with fixture data
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

    await fixtures.add_images_to_routes()

    return [croix_nivert, la_plaine]
