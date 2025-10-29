from pathlib import Path
from urllib.parse import urlparse

from datamodel_code_generator import DataModelType, InputFileType, generate


def sync_eddi_models():
    for schema in ["journal", "fsssignaldiscovered"]:
        generate(
            urlparse(f"https://eddn.edcd.io/schemas/{schema}/1"),
            input_file_type=InputFileType.JsonSchema,
            output=Path("src/journals") / f"{schema}.py",
            output_model_type=DataModelType.PydanticV2BaseModel,
        )
