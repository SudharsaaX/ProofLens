import logging
from typing import Optional, TypedDict

from extractors.exif_extractor import extract_exif
from extractors.iptc_extractor import extract_iptc
from extractors.xmp_extractor import extract_xmp
from models.response import MetadataResult

logger = logging.getLogger(__name__)

class MetadataPayload(TypedDict):
    exif: MetadataResult
    iptc: MetadataResult
    xmp: MetadataResult

def run_metadata_extraction(file_bytes: bytes) -> MetadataPayload:
    logger.info("Starting metadata extraction pipeline")

    exif_res = extract_exif(file_bytes)
    iptc_res = extract_iptc(file_bytes)
    xmp_res = extract_xmp(file_bytes)

    logger.info(
        "Metadata extraction complete — exif=%s iptc=%s xmp=%s",
        exif_res.found, iptc_res.found, xmp_res.found
    )

    return {
        "exif": exif_res,
        "iptc": iptc_res,
        "xmp": xmp_res
    }
