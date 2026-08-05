import logging
from io import BytesIO
from typing import Any

import piexif
from PIL import Image

from config import settings
from models.response import MetadataResult

logger = logging.getLogger(__name__)
_IFD_SECTIONS = ("0th", "Exif", "GPS", "Interop", "1st")

def _decode_value(value: Any) -> Any:
    if isinstance(value, bytes):
        try:
            return value.decode("utf-8").rstrip("\x00")
        except UnicodeDecodeError:
            return value.hex()
    if isinstance(value, tuple):
        return [_decode_value(v) for v in value]
    return value

def _tag_name(ifd_section: str, tag_id: int) -> str:
    tag_info = piexif.TAGS.get(ifd_section, {}).get(tag_id, {})
    return tag_info.get("name", f"{ifd_section}_tag_{tag_id}")

def _load_exif_dict(file_bytes: bytes) -> dict | None:
    try:
        return piexif.load(file_bytes)
    except Exception:
        pass
    try:
        with Image.open(BytesIO(file_bytes)) as img:
            raw_exif = img.info.get("exif", b"")

        if not raw_exif:
            return None

        return piexif.load(raw_exif)
    except Exception:
        return None

def extract_exif(file_bytes: bytes) -> MetadataResult:
    logger.info("Extracting EXIF metadata")

    exif_dict = _load_exif_dict(file_bytes)
    if exif_dict is None:
        logger.info("No EXIF data found")
        return MetadataResult(found=False)

    data: dict[str, Any] = {}
    extraction_warnings: list[str] = []
    field_count = 0

    for section in _IFD_SECTIONS:
        section_data = exif_dict.get(section, {})
        if not isinstance(section_data, dict):
            continue

        for tag_id, raw_value in section_data.items():
            if field_count >= settings.EXIF_MAX_FIELDS:
                msg = (
                    f"EXIF field cap ({settings.EXIF_MAX_FIELDS}) reached; "
                    "remaining tags omitted."
                )
                extraction_warnings.append(msg)
                logger.warning(msg)
                break

            name = _tag_name(section, tag_id)
            try:
                data[name] = _decode_value(raw_value)
            except Exception as exc:
                extraction_warnings.append(f"Could not decode tag '{name}': {exc}")
                logger.warning("Could not decode EXIF tag '%s': %s", name, exc)

            field_count += 1

    if not data:
        logger.info("EXIF block present but contained no readable fields")
        return MetadataResult(found=False)

    logger.info("EXIF extraction complete: %d fields extracted", len(data))
    return MetadataResult(found=True, data=data, warnings=extraction_warnings)
