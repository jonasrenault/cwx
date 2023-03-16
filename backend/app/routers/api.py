from fastapi import APIRouter

from . import login, users, walls, routes, admin

api_router = APIRouter()
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(login.router, prefix="/login", tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(walls.router, prefix="/walls", tags=["walls"])
# Router for routes is not used and untested.
# api_router.include_router(routes.router, prefix="/routes", tags=["routes"])


@api_router.get("/")
async def root():
    return {"message": "Backend API for CWX operational !"}
