from typing import List, Optional
from ..models import Wall, Route


class WallWithRoutes(Wall):
    routes: Optional[List[Route]]
