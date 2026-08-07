import logging

from models.response import (
    AIGeneratorDetails,
    C2PAResult,
    CameraInformation,
    MetadataResult,
    ProvenanceEvidence,
)

logger = logging.getLogger(__name__)

def build_evidence(
    c2pa: C2PAResult,
    camera: CameraInformation | None,
    software: str | None,
    ai_gen: AIGeneratorDetails | None,
    exif: MetadataResult,
    xmp: MetadataResult,
    iptc: MetadataResult,
    png_meta: MetadataResult | None
) -> ProvenanceEvidence:
    logger.info("Building provenance evidence timeline")

    reasoning = []

    # 1. C2PA
    if c2pa.status == "verified":
        reasoning.append("✓ Content Credentials (C2PA) detected and verified")
    elif c2pa.status == "parse_error":
        reasoning.append("⚠ Content Credentials present but could not be parsed (unsupported format)")
    elif c2pa.status == "unsupported":
        reasoning.append("! Content Credentials found but file format not fully supported")
    elif c2pa.status == "validation_failed":
        reasoning.append("! Content Credentials found but validation failed")
    elif c2pa.manifest_present:
        reasoning.append("! Content Credentials present but could not be fully verified")
    else:
        reasoning.append("✗ Content Credentials not found")

    # 2. Camera
    if camera:
        reasoning.append("✓ Camera metadata detected")
    else:
        reasoning.append("✗ Camera metadata not found")

    # 3. Software
    if software:
        reasoning.append(f"✓ Editing software detected: {software}")

    # 4. AI
    if ai_gen:
        name = ai_gen.generator_name or "Unknown AI Generator"
        reasoning.append(f"✓ AI generator metadata detected: {name}")
    else:
        reasoning.append("✗ AI generator metadata not found")

    # 5. General metadata
    if exif.found and not camera:
        reasoning.append("✓ EXIF metadata found")
    if xmp.found:
        reasoning.append("✓ XMP metadata found")
    if iptc.found:
        reasoning.append("✓ IPTC metadata found")
    if png_meta and png_meta.found:
        reasoning.append("✓ PNG-specific metadata found")

    # Scoring Logic
    if c2pa.found and c2pa.verified:
        score = "Verified Provenance"
    elif c2pa.found or c2pa.manifest_present:
        score = "Partial Provenance"
    elif camera and not ai_gen:
        score = "Partial Provenance"
    elif ai_gen:
        score = "Metadata Present"
    elif exif.found or xmp.found or iptc.found or (png_meta and png_meta.found):
        score = "Metadata Present"
    else:
        score = "No Provenance"

    return ProvenanceEvidence(
        score=score,
        reasoning=reasoning
    )
