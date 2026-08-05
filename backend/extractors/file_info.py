import hashlib
import logging
from io import BytesIO

from PIL import Image, UnidentifiedImageError

from models.response import FileInfoResult

logger = logging.getLogger(__name__)
_FORMAT_TO_MIME: dict[str, str] = {
    "JPEG": "image/jpeg",
    "MPO":  "image/jpeg",   # Multi-Picture Object is a JPEG variant
    "PNG":  "image/png",
    "WEBP": "image/webp",
    "TIFF": "image/tiff",
    "HEIF": "image/heif",
    "HEIC": "image/heic",
}
_NORMALISE_FORMAT: dict[str, str] = {
    "MPO": "JPEG",  # Multi-Picture Object → JPEG
}

def extract_file_info(file_bytes: bytes, filename: str) -> FileInfoResult:
    logger.info("Extracting file info for '%s'", filename)

    sha256 = hashlib.sha256(file_bytes).hexdigest()

    try:
        with Image.open(BytesIO(file_bytes)) as img:
            raw_format = img.format or "UNKNOWN"
            width, height = img.size
    except UnidentifiedImageError as exc:
        raise ValueError(f"Cannot identify image file: {exc}") from exc
    except Exception as exc:
        raise ValueError(f"Failed to open image: {exc}") from exc
    image_format = _NORMALISE_FORMAT.get(raw_format, raw_format)
    mime_type = _FORMAT_TO_MIME.get(raw_format, "application/octet-stream")

    logger.info(
        "File info extracted: format=%s size=%dx%d bytes=%d",
        image_format, width, height, len(file_bytes),
    )

    return FileInfoResult(
        filename=filename,
        format=image_format,
        mime_type=mime_type,
        size_bytes=len(file_bytes),
        width=width,
        height=height,
        sha256=sha256,
    )
