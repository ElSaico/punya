import json
import logging
import os
import zlib
from pathlib import Path
from typing import List
from urllib.parse import urlparse

import zmq
from datamodel_code_generator import DataModelType, InputFileType, generate
from geoalchemy2.shape import from_shape
from shapely import Point  # is this overkill? yes. who cares? not me.

from data import SystemMegaships
from db import create_systems, create_megaships, System
from journals.fsssignaldiscovered import Message as FSSSignalDiscovered
from journals.journal import Message as Journal

try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:
    pass

DEBUG = bool(os.getenv("DEBUG"))
EDDI_URL = "tcp://eddn.edcd.io:9500"
BATCH_SIZE_MEGASHIPS = 20
BATCH_SIZE_SYSTEMS = 100
logger = logging.getLogger(__name__)


def run():
    logging.basicConfig(level=logging.DEBUG if DEBUG else logging.INFO)
    ctx = zmq.Context()
    eddi = ctx.socket(zmq.SUB)
    megaships: List[SystemMegaships] = []
    systems: List[System] = []

    eddi.connect(EDDI_URL)
    eddi.subscribe("")
    logger.info("EDDI listener connected successfully")

    while True:
        src = eddi.recv()
        event = json.loads(zlib.decompress(src))

        # TODO drop legacy/test messages
        match event["message"].get("event"):
            case "FSSSignalDiscovered":
                fss = FSSSignalDiscovered.model_validate(event["message"])
                signals = [
                    signal.SignalName
                    for signal in fss.signals
                    if signal.SignalType == "Megaship"
                    and signal.SignalName != "System Colonisation Ship"
                ]
                if len(signals) > 0:
                    megaships.append(
                        SystemMegaships(
                            timestamp=fss.timestamp,
                            system_id=fss.SystemAddress,
                            megaships=signals,
                        )
                    )
                if len(megaships) >= BATCH_SIZE_MEGASHIPS:
                    logger.info(f"reached {BATCH_SIZE_MEGASHIPS} megaships, inserting")
                    create_megaships(megaships)
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
                if len(systems) >= BATCH_SIZE_SYSTEMS:
                    logger.info(f"reached {BATCH_SIZE_SYSTEMS} systems, inserting")
                    create_systems(systems)
                    logger.info("systems insertion successful")
                    systems.clear()


def sync_models():
    for schema in ["journal", "fsssignaldiscovered"]:
        generate(
            urlparse(f"https://eddn.edcd.io/schemas/{schema}/1"),
            input_file_type=InputFileType.JsonSchema,
            output=Path("src/journals") / f"{schema}.py",
            output_model_type=DataModelType.PydanticV2BaseModel,
        )
