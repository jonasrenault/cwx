from typing import List, Optional, Any
from uuid import UUID

from fastapi import APIRouter, HTTPException, Body, Depends
from pymongo import errors
from pydantic.networks import EmailStr

from .. import schemas, models

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
    la_plaine, croix_niv = models.walls.createData()
    await la_plaine.create()
    await croix_niv.create()
    return [la_plaine, croix_niv]
