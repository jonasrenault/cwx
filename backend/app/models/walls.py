from typing import Optional, List
from pydantic import Field
from beanie import Document, Indexed
from uuid import UUID, uuid4

from ..schemas.walls import Area, Rect, Path


class Wall(Document):
    uuid: Indexed(UUID, unique=True) = Field(default_factory=uuid4)
    key: Indexed(str, unique=True)
    name: str
    city: Optional[str] = None
    description: Optional[str] = None
    areas: Optional[List[Area]]


def createData():
    petit_devers_gauche = Area(
        **{
            "name": "petit devers gauche",
            "paths": [
                Rect(
                    **{
                        "type": "rect",
                        "x": 20,
                        "y": 45,
                        "w": 43,
                        "h": 135,
                        "color": "#FFA500",
                    }
                ),
                Rect(
                    **{
                        "type": "rect",
                        "x": 52,
                        "y": 45,
                        "w": 11,
                        "h": 97,
                        "color": "rgb(219, 233, 224)",
                    }
                ),
                Path(
                    **{
                        "type": "fill",
                        "points": [
                            [42, 45],
                            [52, 140],
                            [52, 45],
                            [42, 45],
                        ],
                        "color": "rgb(167, 181, 161)",
                    }
                ),
            ],
            "border": [
                [20, 45],
                [63, 45],
                [63, 180],
                [20, 180],
            ],
        }
    )

    la_plaine = Wall(
        **{
            "key": "laplaine",
            "name": "La Plaine",
            "city": "Paris XVe",
            "areas": [petit_devers_gauche],
        }
    )

    return la_plaine
