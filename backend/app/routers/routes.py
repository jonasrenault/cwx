from typing import List, Optional
from pathlib import Path
from fastapi import APIRouter, UploadFile, HTTPException
from beanie import PydanticObjectId

from ..models import Route
from ..config.config import settings

router = APIRouter()


@router.get("search", response_model=List[Route])
async def search_wall_routes(
    wall_id: PydanticObjectId | None = None,
    query: str | None = None,
    area_id: PydanticObjectId | None = None,
    color: str | None = None,
):
    search_query = Route.find(Route.wall.id == wall_id)
    if area_id is not None:
        search_query = search_query.find(Route.area.id == area_id)
    if color is not None:
        search_query = search_query.find(Route.color == color)
    search_query = search_query.find
    routes = await search_query.to_list()


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


@router.post("/{id}/upload")
async def upload_route_image(id: PydanticObjectId, file: UploadFile) -> Route:
    # Get the route first to raise an exception if route does not exist
    route = await Route.get(id)

    # Save the uploaded file to disk
    file_extension = Path(file.filename).suffix
    save_dir = Path(settings.ROUTE_IMG_DATA_DIR) / "routes"
    save_dir.mkdir(exist_ok=True)
    save_file = save_dir / str(id) + file_extension
    try:
        with open(save_file, "wb") as f:
            f.write(await file.read())
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Something went wrong when trying to save the file to disk.",
        )
    finally:
        await file.close()

    # Update route with img_path
    route.img_path = save_file.relative_to(settings.ROUTE_IMG_DATA_DIR)
    await route.save()
    return route
