import json
import logging
import re
import zlib
from typing import Any, List

import zmq
from geoalchemy2.shape import from_shape
from shapely import Point  # is this overkill? yes. who cares? not me.
from sqlalchemy.dialects.postgresql import insert
from sqlmodel import and_, column, or_
from taskiq import TaskiqDepends

from .broker import broker
from .db import Megaship, System
from .dependencies import get_session
from .journals.fsssignaldiscovered import Message as FSSSignalDiscovered
from .journals.journal import Message as Journal
from .settings import settings

RE_SHIP_NEW = re.compile(
    r"(?P<codename>[A-Z\-.'+\d\s]+?)\s+(?P<ship_class>[A-Z][a-z]+)-class (?P<category>[A-Z][a-z]+)"
)
RE_SHIP_OLD = re.compile(
    r"(?P<ship_class>[A-Z][a-z]+)\s+Class (?P<category>[A-Za-z\s]+?)\s+(?P<codename>[A-Z]+-\d+)"
)
MEGASHIP_CATEGORY_REMAP = {  # old type -> new type
    "Agricultural Vessel": "Cropper",
    "Cargo Ship": "Hauler",  # only ALL-4659 according to Inara
    "Bulk Cargo Ship": "Hauler",
    "Prison Ship": "Reformatory",
    "Science Vessel": "Researcher",
    "Survey Vessel": "Surveyor",
    "Tanker": "Tanker",
    "Tourist Ship": "Traveller",
}

EDDI_URL = "tcp://eddn.edcd.io:9500"
BATCH_SIZE_MEGASHIPS = 20
BATCH_SIZE_SYSTEMS = 100
logger = logging.getLogger(__name__)


def parse_megaship(megaship: str) -> dict[str, Any]:
    logger.debug("parse_megaship %s", megaship)
    result = {"ship_class": None, "category": None, "codename": None}
    match = RE_SHIP_OLD.match(megaship)
    if match:
        result = match.groupdict()
        result["category"] = MEGASHIP_CATEGORY_REMAP[result["category"]]
        logger.debug("old %s", result)
    match = RE_SHIP_NEW.match(megaship)
    if match:
        result = match.groupdict()
        logger.debug("new %s", result)
    return result


@broker.task
async def create_megaships(
    megaships: List[Megaship], session=TaskiqDepends(get_session)
):
    logger.debug("insert megaships %s", megaships)
    stmt = insert(Megaship).values(megaships)
    stmt = stmt.on_conflict_do_update(  # TODO RETURNING old.name, new.timestamp, new.system_id
        index_elements=["name"],
        index_where=and_(
            column("timestamp") < stmt.excluded.timestamp,
            column("system_id") != stmt.excluded.system_id,
        ),
        set_={
            "timestamp": stmt.excluded.timestamp,
            "system_id": stmt.excluded.system_id,
        },
    )
    # TODO insert MegashipRoute entries where old.name isn't null
    session.exec(stmt)


@broker.task
async def create_systems(systems: List[System], session=TaskiqDepends(get_session)):
    logger.debug("insert systems %s", systems)
    stmt = insert(System).values(systems)
    stmt = stmt.on_conflict_do_update(
        index_elements=["id64"],
        index_where=and_(
            column("timestamp") < stmt.excluded.timestamp,
            or_(
                column("power") != stmt.excluded.power,
                column("power_state") != stmt.excluded.power_state,
            ),
        ),
        set_={
            "timestamp": stmt.excluded.timestamp,
            "power": stmt.excluded.power,
            "power_state": stmt.excluded.power_state,
        },
    )
    session.exec(stmt)


@broker.task
async def collector():
    logging.basicConfig(level=logging.DEBUG if settings.env == "dev" else logging.INFO)
    ctx = zmq.Context()
    eddi = ctx.socket(zmq.SUB)
    megaships: List[Megaship] = []
    systems: List[System] = []

    eddi.connect(EDDI_URL)
    eddi.subscribe("")
    logger.info("EDDI listener connected successfully")

    while True:
        src = eddi.recv()
        event = json.loads(zlib.decompress(src))

        # TODO drop legacy and test messages
        match event["message"].get("event"):
            case "FSSSignalDiscovered":
                fss = FSSSignalDiscovered.model_validate(event["message"])
                system_megaships = [
                    Megaship(
                        name=signal.SignalName,
                        system_id=fss.SystemAddress,
                        timestamp=fss.timestamp,
                        **parse_megaship(signal.SignalName),
                    )
                    for signal in fss.signals
                    if signal.SignalType == "Megaship"
                    # TODO should we filter out trailblazer ships?
                    and signal.SignalName != "System Colonisation Ship"
                ]
                if len(system_megaships) > 0:
                    megaships.extend(system_megaships)
                # TODO ensure each megaship only appears once
                if len(megaships) >= BATCH_SIZE_MEGASHIPS:
                    logger.info(f"reached {len(megaships)} megaships, inserting")
                    await create_megaships.kiq(megaships)
                    logger.info("megaships insertion successful")
                    megaships.clear()
            case "FSDJump":
                fsd = Journal.model_validate(event["message"])
                systems.append(
                    System(
                        id64=fsd.SystemAddress,
                        name=fsd.StarSystem,
                        timestamp=fsd.timestamp,
                        pos=from_shape(Point(fsd.StarPos)),
                        power=fsd.model_extra.get("ControllingPower"),
                        power_state=fsd.model_extra.get("PowerplayState"),
                        megaships=[],
                        megaship_routes=[],
                    )
                )
                # TODO ensure each system only appears once
                if len(systems) >= BATCH_SIZE_SYSTEMS:
                    logger.info(f"reached {len(systems)} systems, inserting")
                    await create_systems.kiq(systems)
                    logger.info("systems insertion successful")
                    systems.clear()
