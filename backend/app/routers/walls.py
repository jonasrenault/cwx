from typing import List, Optional, Any
from uuid import UUID

from fastapi import APIRouter, HTTPException, Body, Depends
from pymongo import errors
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
    walls = await models.Wall.find_all().skip(offset).limit(limit).to_list()
    return walls


@router.post("", response_model=List[schemas.Wall])
async def create_fixtures():
    """
    Populate walls with fixture data
    """
    await models.Wall.find_all().delete()
    la_plaine = fixtures.create_la_plaine()
    croix_niv = fixtures.create_croix_nivert()
    await croix_niv.create()
    await la_plaine.create()
    return [croix_niv, la_plaine]
