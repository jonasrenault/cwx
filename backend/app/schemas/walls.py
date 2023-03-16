from datetime import datetime
from typing import List, Tuple, Optional, Union
from ..models import Wall, Route


class WallWithRoutes(Wall):
    routes: Optional[List[Route]]
