import logging

from extractors.c2pa_extractor import extract_c2pa
from models.response import C2PAResult

logger = logging.getLogger(__name__)

def check_provenance(file_bytes: bytes, filename: str) -> C2PAResult:
    logger.info("Running provenance check for '%s'", filename)

    result = extract_c2pa(file_bytes, filename)

    logger.info(
        "Provenance check complete — found=%s verified=%s",
        result.found, result.verified,
    )

    return result
