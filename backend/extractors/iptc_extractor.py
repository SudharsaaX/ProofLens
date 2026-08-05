import logging
import warnings
from io import BytesIO
from typing import Any

from models.response import MetadataResult

logger = logging.getLogger(__name__)
_IPTC_TAG_NAMES: dict[int, str] = {
    5:   "object_name",
    7:   "edit_status",
    10:  "urgency",
    15:  "category",
    20:  "supplemental_category",
    22:  "fixture_identifier",
    25:  "keywords",
    26:  "content_location_code",
    27:  "content_location_name",
    30:  "release_date",
    35:  "release_time",
    37:  "expiration_date",
    38:  "expiration_time",
    40:  "special_instructions",
    45:  "reference_service",
    47:  "reference_date",
    50:  "reference_number",
    55:  "date_created",
    60:  "time_created",
    62:  "digital_creation_date",
    63:  "digital_creation_time",
    65:  "originating_program",
    70:  "program_version",
    75:  "object_cycle",
    80:  "by_line",
    85:  "by_line_title",
    90:  "city",
    92:  "sub_location",
    95:  "province_state",
    100: "country_primary_location_code",
    101: "country_primary_location_name",
    103: "original_transmission_reference",
    105: "headline",
    110: "credit",
    115: "source",
    116: "copyright_notice",
    118: "contact",
    120: "caption_abstract",
    122: "writer_editor",
    130: "image_type",
    131: "image_orientation",
    135: "language_identifier",
}

def _decode_iptc_value(value: Any) -> Any:
    if isinstance(value, bytes):
        try:
            return value.decode("utf-8")
        except UnicodeDecodeError:
            return value.decode("latin-1", errors="replace")
    if isinstance(value, list):
        return [_decode_iptc_value(item) for item in value]
    return value

def extract_iptc(file_bytes: bytes) -> MetadataResult:
    logger.info("Extracting IPTC metadata")

    try:
        import iptcinfo3  # type: ignore[import]
        logging.getLogger("iptcinfo").setLevel(logging.CRITICAL)
    except ImportError:
        logger.warning("iptcinfo3 not installed; IPTC extraction skipped")
        return MetadataResult(
            found=False,
            warnings=["iptcinfo3 library is not installed; IPTC metadata could not be read."],
        )

    try:
        stream = BytesIO(file_bytes)
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            info = iptcinfo3.IPTCInfo(stream, force=True)

    except Exception as exc:
        logger.warning("IPTC extraction failed: %s", exc)
        return MetadataResult(found=False, error=str(exc))

    raw_data: dict[int, Any] = getattr(info, "data", {}) or {}
    data: dict[str, Any] = {}

    for tag_num, field_name in _IPTC_TAG_NAMES.items():
        raw_value = raw_data.get(tag_num)
        if raw_value is not None:
            data[field_name] = _decode_iptc_value(raw_value)

    if not data:
        logger.info("No IPTC data found in image")
        return MetadataResult(found=False)

    logger.info("IPTC extraction complete: %d fields extracted", len(data))
    return MetadataResult(found=True, data=data)
