import logging
from io import BytesIO
from typing import Any

from PIL import Image, ImageCms, UnidentifiedImageError

from models.response import MetadataResult

logger = logging.getLogger(__name__)
_PIL_INTERNAL_KEYS = frozenset([
    "dpi", "jfif", "jfif_version", "jfif_density", "jfif_unit",
    "adobe", "adobe_transform", "progressive", "progression",
    "exif", "icc_profile", "appN",
])
_JPEG_APP_NAMES: dict[int, str] = {
    0xE0: "APP0 (JFIF)",
    0xE1: "APP1 (EXIF/XMP)",
    0xE2: "APP2 (ICC Profile / FlashPix)",
    0xE8: "APP8 (SPIFF)",
    0xEC: "APP12 (Picture Info)",
    0xED: "APP13 (IPTC-NAA / Photoshop)",
    0xEE: "APP14 (Adobe DCT)",
}

def _extract_icc_info(file_bytes: bytes) -> dict[str, Any]:
    try:
        with Image.open(BytesIO(file_bytes)) as img:
            raw_icc = img.info.get("icc_profile")

        if not raw_icc:
            return {}

        profile = ImageCms.ImageCmsProfile(BytesIO(raw_icc))
        name = ImageCms.getProfileName(profile).strip()
        description = ImageCms.getProfileDescription(profile).strip()

        result: dict[str, Any] = {}
        if name:
            result["icc_profile_name"] = name
        if description and description != name:
            result["icc_profile_description"] = description

        return result

    except Exception as exc:
        logger.debug("ICC profile parse failed: %s", exc)
        return {}

def _extract_jpeg_app_segments(file_bytes: bytes) -> dict[str, Any]:
    segments: dict[str, Any] = {}
    scan_limit = min(len(file_bytes), 65536)
    offset = 2  # Skip SOI (FF D8)

    while offset + 4 <= scan_limit:
        if file_bytes[offset] != 0xFF:
            break

        marker = file_bytes[offset + 1]
        if marker in (0xD8, 0xD9):
            offset += 2
            continue
        if marker == 0xDA:
            break

        if offset + 4 > scan_limit:
            break

        length = int.from_bytes(file_bytes[offset + 2: offset + 4], "big")
        segment_data = file_bytes[offset + 4: offset + 2 + length]

        if 0xE0 <= marker <= 0xEF:
            app_num = marker - 0xE0
            label = _JPEG_APP_NAMES.get(marker, f"APP{app_num}")
            identifier = segment_data[:10].split(b"\x00")[0]
            try:
                id_str = identifier.decode("ascii", errors="replace").rstrip("\x00")
            except Exception:
                id_str = identifier.hex()

            segments[f"APP{app_num}"] = id_str or label

        elif marker == 0xFE:  # COM — JPEG comment
            try:
                comment = segment_data.decode("utf-8", errors="replace")
                segments["comment"] = comment
            except Exception:
                pass

        offset += 2 + length

    return segments

def extract_png_metadata(file_bytes: bytes) -> MetadataResult:
    logger.info("Extracting PNG/format-specific metadata")

    try:
        with Image.open(BytesIO(file_bytes)) as img:
            image_format = img.format or "UNKNOWN"
            info_dict: dict = dict(img.info)
    except (UnidentifiedImageError, Exception) as exc:
        logger.debug("Could not open image for PNG extraction: %s", exc)
        return MetadataResult(found=False)

    data: dict[str, Any] = {}
    if image_format in ("PNG",):
        for key, value in info_dict.items():
            if key in _PIL_INTERNAL_KEYS:
                continue
            if isinstance(value, bytes):
                try:
                    data[key] = value.decode("utf-8", errors="replace")
                except Exception:
                    data[key] = value.hex()
            elif isinstance(value, str):
                data[key] = value
    if image_format in ("JPEG", "MPO"):
        app_segments = _extract_jpeg_app_segments(file_bytes)
        if app_segments:
            data["jpeg_app_segments"] = app_segments
    icc_info = _extract_icc_info(file_bytes)
    data.update(icc_info)

    if not data:
        logger.info("No PNG/format-specific metadata found (format=%s)", image_format)
        return MetadataResult(found=False)

    logger.info(
        "PNG/format-specific metadata extracted: %d fields (format=%s)",
        len(data), image_format,
    )
    return MetadataResult(found=True, data=data)
