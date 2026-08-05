import logging
from models.response import C2PAResult, MetadataResult, SummaryResult, ProvenanceEvidence, CameraInformation, AIGeneratorDetails

logger = logging.getLogger(__name__)

def build_summary(
    c2pa: C2PAResult,
    exif: MetadataResult,
    iptc: MetadataResult,
    xmp: MetadataResult,
    evidence: ProvenanceEvidence,
    camera: CameraInformation | None,
    software: str | None,
    ai_gen: AIGeneratorDetails | None
) -> SummaryResult:
    provenance_sources = _collect_sources(c2pa, exif, iptc, xmp)
    has_provenance = bool(provenance_sources)
    human_explanation = _build_explanation(c2pa, evidence, camera, software, ai_gen)

    logger.info("Summary built — has_provenance=%s", has_provenance)

    return SummaryResult(
        has_provenance=has_provenance,
        provenance_sources=provenance_sources,
        human_explanation=human_explanation
    )

def _collect_sources(c2pa, exif, iptc, xmp) -> list[str]:
    sources = []
    if c2pa.found: sources.append("c2pa")
    if exif.found: sources.append("exif")
    if iptc.found: sources.append("iptc")
    if xmp.found: sources.append("xmp")
    return sources

def _build_explanation(
    c2pa: C2PAResult,
    evidence: ProvenanceEvidence,
    camera: CameraInformation | None,
    software: str | None,
    ai_gen: AIGeneratorDetails | None
) -> str:
    if c2pa.found and c2pa.verified:
        return "Content Credentials were found and successfully verified. This confirms the image was processed by a compatible tool and the recorded provenance has not been tampered with."

    parts = []
    if ai_gen:
        name = ai_gen.generator_name or "an AI generator"
        parts.append(f"Metadata indicates this image was created or processed using {name}.")
    elif camera:
        parts.append(f"Camera metadata was detected ({camera.manufacturer or 'Unknown Make'} {camera.model or 'Unknown Model'}).")

    if software:
        parts.append(f"Evidence of editing software ({software}) was found.")

    if not parts:
        if evidence.score == "No Provenance":
            return "No verifiable provenance or metadata was found in this image. This does not prove the image is AI-generated or manipulated — it only indicates that no metadata is available."
        return "Metadata was found, but no explicit camera, software, or AI generator signatures were detected."

    return " ".join(parts)
