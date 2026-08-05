import logging

from fastapi import HTTPException, status

from extractors.file_info import extract_file_info
from extractors.camera_extractor import extract_camera_info
from extractors.software_extractor import extract_software
from extractors.ai_metadata_extractor import extract_ai_metadata
from extractors.evidence_builder import build_evidence
from extractors.png_extractor import extract_png_metadata
from models.response import AnalysisResponse
from services.metadata_service import run_metadata_extraction
from services.provenance_service import check_provenance
from services.summary_service import build_summary

logger = logging.getLogger(__name__)

def _pixel_analysis_service_hook(file_bytes: bytes):
    """
    FUTURE EXTENSION POINT:
    This function is a placeholder for a future ML-based pixel analysis service
    that can detect image manipulation, deepfakes, or AI generation directly
    from the image pixels.
    """
    pass

def analyze_image(file_bytes: bytes, filename: str) -> AnalysisResponse:
    logger.info("Analysis started — filename='%s'", filename)

    try:
        file_info = extract_file_info(file_bytes, filename)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))

    # Existing metadata
    c2pa_result = check_provenance(file_bytes, filename)
    metadata = run_metadata_extraction(file_bytes)
    exif = metadata["exif"]
    iptc = metadata["iptc"]
    xmp = metadata["xmp"]

    # PNG format specifics
    png_meta = extract_png_metadata(file_bytes)

    # Forensics Detection
    camera_info = extract_camera_info(exif)
    software_detected = extract_software(exif, xmp, png_meta)
    ai_gen = extract_ai_metadata(exif, xmp, png_meta)

    # Future ML Hook
    _pixel_analysis_service_hook(file_bytes)

    # Scoring & Evidence
    evidence = build_evidence(c2pa_result, camera_info, software_detected, ai_gen, exif, xmp, iptc, png_meta)

    summary = build_summary(
        c2pa=c2pa_result,
        exif=exif,
        iptc=iptc,
        xmp=xmp,
        evidence=evidence,
        camera=camera_info,
        software=software_detected,
        ai_gen=ai_gen
    )

    return AnalysisResponse(
        file_info=file_info,
        c2pa=c2pa_result,
        exif=exif,
        iptc=iptc,
        xmp=xmp,
        png_metadata=png_meta if png_meta.found else None,
        camera_information=camera_info,
        software_detected=software_detected,
        generator_metadata=ai_gen,
        editing_history=[],
        provenance=evidence,
        summary=summary
    )
