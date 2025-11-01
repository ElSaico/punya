import json
import logging
from datetime import datetime
from enum import Enum
from typing import List

from geoalchemy2 import Geometry, WKBElement
from geojson_pydantic import Point
from pydantic import field_validator
from sqlmodel import (
    BigInteger,
    Column,
    Field,
    Relationship,
    Session,
    SQLModel,
    create_engine,
    func,
)

from .settings import settings

engine = create_engine(
    settings.postgres_url, plugins=["geoalchemy2"], echo=settings.env == "dev"
)
logger = logging.getLogger(__name__)


class Power(Enum):
    ARISSA = "A. Lavigny-Duval"
    AISLING = "Aisling Duval"
    DELAINE = "Archon Delaine"
    PATREUS = "Denton Patreus"
    MAHON = "Edmund Mahon"
    WINTERS = "Felicia Winters"
    ARCHER = "Jerome Archer"
    LI = "Li Yong-Rui"
    KAINE = "Nakato Kaine"
    ANTAL = "Pranav Antal"
    GROM = "Yuri Grom"
    TORVAL = "Zemina Torval"


class PowerState(Enum):
    EXPLOITED = "Exploited"
    CONTESTED = "Contested"
    FORTIFIED = "Fortified"
    STRONGHOLD = "Stronghold"


class System(SQLModel, table=True):
    id64: int = Field(sa_column=Column(BigInteger, primary_key=True))
    name: str = Field(index=True)
    timestamp: datetime
    pos: Point = Field(sa_column=Column(Geometry("POINT")))
    power: Power | None
    power_state: PowerState | None
    megaships: List["Megaship"] = Relationship(back_populates="system")
    megaship_routes: List["MegashipRoute"] = Relationship(back_populates="system")

    @field_validator("pos", mode="before")
    def deserialize_pos(self, pos):
        if isinstance(pos, WKBElement):
            pos = func.ST_AsGeoJSON(pos)
        elif not isinstance(pos, func.ST_AsGeoJSON):
            raise TypeError(type(pos))

        with Session(engine) as session:
            return json.loads(session.scalar(pos))


class MegashipRoute(SQLModel, table=True):
    megaship_name: str = Field(foreign_key="megaship.name", primary_key=True)
    megaship: "Megaship" = Relationship(back_populates="routes")
    timestamp: datetime = Field(primary_key=True)
    system_id: int | None = Field(foreign_key="system.id64")
    system: System | None = Relationship(back_populates="megaship_routes")


class Megaship(SQLModel, table=True):
    name: str = Field(primary_key=True)
    category: str | None  # TODO index or make enum
    ship_class: str | None  # TODO index or make enum
    codename: str | None
    timestamp: datetime
    system_id: int | None = Field(foreign_key="system.id64")
    system: System = Relationship(back_populates="megaships")
    routes: List[MegashipRoute] = Relationship(back_populates="megaship")
