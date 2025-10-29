# TODO define as a common resource used by both API and collector
import logging
import re
from dataclasses import dataclass
from enum import Enum
from typing import List

from pydantic import AwareDatetime

RE_SHIP_NEW = re.compile(
    r"(?P<codename>[A-Z\-.'+\d\s]+) (?P<ship_class>[A-Z][a-z]+)-class (?P<category>[A-Z][a-z]+)"
)
RE_SHIP_OLD = re.compile(
    r"(?P<ship_class>[A-Z][a-z]+) Class (?P<category>[A-Za-z\s]+) (?P<codename>[A-Z]+-\d+)"
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
logger = logging.getLogger(__name__)


def parse_megaship(megaship: str):
    logger.debug("parse_megaship %s", megaship)
    result = {}
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


@dataclass(frozen=True)
class SystemMegaships:
    timestamp: AwareDatetime
    system_id: int
    megaships: List[str]
