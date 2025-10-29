# TODO define as a common resource used by both API and collector
import logging
import os
from datetime import datetime
from typing import List

from geoalchemy2 import Geometry, WKBElement
from sqlalchemy import create_engine, ForeignKey, and_, or_, BigInteger
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    mapped_column,
    relationship,
    MappedAsDataclass,
    Session,
)

from data import Power, PowerState, SystemMegaships, parse_megaship

try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:
    pass

DEBUG = bool(os.getenv("DEBUG"))
engine = create_engine(os.getenv("DATABASE_URI"), plugins=["geoalchemy2"], echo=DEBUG)
logger = logging.getLogger(__name__)


class Base(DeclarativeBase): ...


class System(MappedAsDataclass, Base):
    __tablename__ = "system"
    id64: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    name: Mapped[str] = mapped_column(index=True)
    timestamp: Mapped[datetime]
    pos: Mapped[WKBElement] = mapped_column(Geometry("POINT"))
    power: Mapped[Power | None]
    power_state: Mapped[PowerState | None]
    megaships: Mapped[List["Megaship"]] = relationship(back_populates="system")
    megaship_routes: Mapped[List["MegashipRoute"]] = relationship(
        back_populates="system"
    )


class MegashipRoute(Base):
    __tablename__ = "megaship_route"
    megaship_name: Mapped[str] = mapped_column(
        ForeignKey("megaship.name"), primary_key=True
    )
    megaship: Mapped["Megaship"] = relationship(back_populates="routes")
    timestamp: Mapped[datetime] = mapped_column(primary_key=True)
    system_id = mapped_column(ForeignKey("system.id64"))
    system: Mapped[System] = relationship(back_populates="megaship_routes")


class Megaship(Base):
    __tablename__ = "megaship"
    name: Mapped[str] = mapped_column(primary_key=True)
    category: Mapped[str | None]  # TODO index or make enum
    ship_class: Mapped[str | None]  # TODO index or make enum
    codename: Mapped[str | None]
    timestamp: Mapped[datetime]
    system_id = mapped_column(ForeignKey("system.id64"))
    system: Mapped[System] = relationship(back_populates="megaships")
    routes: Mapped[List[MegashipRoute]] = relationship(back_populates="megaship")


def create_megaships(megaships: List[SystemMegaships]):
    values = [
        parse_megaship(megaship)
        | {"system_id": system.system_id, "timestamp": system.timestamp}
        for system in megaships
        for megaship in system.megaships
    ]
    stmt = insert(Megaship).values(values)
    stmt = stmt.on_conflict_do_update(  # TODO RETURNING old.name, new.timestamp, new.system_id
        index_elements=[Megaship.name],
        where=and_(
            Megaship.timestamp < stmt.excluded.timestamp,
            Megaship.system_id != stmt.excluded.system_id,
        ),
        set_={
            "timestamp": stmt.excluded.timestamp,
            "system_id": stmt.excluded.system_id,
        },
    )
    with Session(engine) as session:
        session.execute(stmt)


def create_systems(systems: List[System]):
    stmt = insert(System).values(systems)
    stmt = stmt.on_conflict_do_update(
        index_elements=[System.id64],
        index_where=and_(
            System.timestamp < stmt.excluded.timestamp,
            or_(
                System.power != stmt.excluded.power,
                System.power_state != stmt.excluded.power_state,
            ),
        ),
        set_={
            "timestamp": stmt.excluded.timestamp,
            "power": stmt.excluded.power,
            "power_state": stmt.excluded.power_state,
        },
    )
    with Session(engine) as session:
        session.execute(stmt)
