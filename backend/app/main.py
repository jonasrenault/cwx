from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from .routers.api import api_router
from .config.config import settings
from .models import User, Wall, Area, Route
from .auth.auth import get_hashed_password

app = FastAPI(
    title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Serve route images as static files
app.mount(
    f"{settings.API_V1_STR}/static",
    StaticFiles(directory=settings.ROUTE_IMG_DATA_DIR),
    name="static",
)


@app.on_event("startup")
async def start_database():
    app.client = AsyncIOMotorClient(
        settings.MONGO_HOST,
        settings.MONGO_PORT,
        username=settings.MONGO_USER,
        password=settings.MONGO_PASSWORD,
    )
    # await app.client.drop_database(settings.MONGO_DB)
    await init_beanie(
        database=app.client[settings.MONGO_DB],
        document_models=[User, Wall, Area, Route],
    )

    user = await User.find_one({"email": settings.FIRST_SUPERUSER})
    if not user:
        user = User(
            email=settings.FIRST_SUPERUSER,
            hashed_password=get_hashed_password(settings.FIRST_SUPERUSER_PASSWORD),
            is_superuser=True,
        )
        await user.create()


app.include_router(api_router, prefix=settings.API_V1_STR)
