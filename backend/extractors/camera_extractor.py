import logging
from typing import Any

from models.response import CameraInformation, MetadataResult

logger = logging.getLogger(__name__)

def extract_camera_info(exif: MetadataResult) -> CameraInformation | None:
    if not exif.found or not exif.data:
        return None

    logger.info("Extracting camera information from EXIF")

    info = CameraInformation()
    found_any = False

    make = exif.data.get("Make")
    if make:
        info.manufacturer = str(make).strip()
        found_any = True

    model = exif.data.get("Model")
    if model:
        info.model = str(model).strip()
        found_any = True

    lens = exif.data.get("LensModel") or exif.data.get("Lens")
    if lens:
        info.lens = str(lens).strip()
        found_any = True

    iso = exif.data.get("ISOSpeedRatings")
    if iso:
        if isinstance(iso, list):
            iso = iso[0] if iso else None
        if iso:
            info.iso = str(iso)
            found_any = True

    exposure = exif.data.get("ExposureTime")
    if exposure:
        if isinstance(exposure, tuple) and len(exposure) == 2:
            num, den = exposure
            if den > 0:
                info.exposure = f"{num}/{den}s"
            else:
                info.exposure = f"{num}s"
        else:
            info.exposure = str(exposure)
        found_any = True

    focal = exif.data.get("FocalLength")
    if focal:
        if isinstance(focal, tuple) and len(focal) == 2:
            num, den = focal
            if den > 0:
                info.focal_length = f"{num/den:.1f}mm"
        else:
            info.focal_length = f"{focal}mm"
        found_any = True

    date = exif.data.get("DateTimeOriginal") or exif.data.get("DateTime")
    if date:
        info.capture_date = str(date).strip()
        found_any = True

    if found_any:
        return info
    return None
