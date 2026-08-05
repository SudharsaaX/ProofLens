from typing import Any, Dict, List, Optional
from pydantic import BaseModel

class FileInfoResult(BaseModel):
    filename: str
    format: str                  # e.g. "JPEG", "PNG"
    mime_type: str
    size_bytes: int
    width: int
    height: int
    sha256: str                  # Hex digest — lets users verify the file

class C2PAResult(BaseModel):
    found: bool
    verified: bool
    status: str = "no_manifest"                 # e.g., verified, parse_error, unsupported, no_manifest
    manifest_present: bool = False
    manifest: Optional[Dict[str, Any]] = None
    signer: Optional[str] = None
    signing_time: Optional[str] = None
    error: Optional[str] = None

class MetadataResult(BaseModel):
    found: bool
    data: Dict[str, Any] = {}
    warnings: List[str] = []
    error: Optional[str] = None

class SummaryResult(BaseModel):
    has_provenance: bool
    provenance_sources: List[str]
    human_explanation: str

class CameraInformation(BaseModel):
    manufacturer: Optional[str] = None
    model: Optional[str] = None
    lens: Optional[str] = None
    iso: Optional[str] = None
    exposure: Optional[str] = None
    focal_length: Optional[str] = None
    capture_date: Optional[str] = None

class AIGeneratorDetails(BaseModel):
    generator_name: Optional[str] = None
    software: Optional[str] = None
    model: Optional[str] = None
    workflow: Optional[str] = None
    parameters: Optional[str] = None
    prompt_found: bool = False
    negative_prompt_found: bool = False
    seed_found: bool = False
    steps_found: bool = False
    sampler_found: bool = False
    cfg_found: bool = False

class ProvenanceEvidence(BaseModel):
    score: str
    reasoning: List[str]

class AnalysisResponse(BaseModel):
    file_info: FileInfoResult
    c2pa: C2PAResult
    exif: MetadataResult
    iptc: MetadataResult
    xmp: MetadataResult
    png_metadata: Optional[MetadataResult] = None
    camera_information: Optional[CameraInformation] = None
    software_detected: Optional[str] = None
    generator_metadata: Optional[AIGeneratorDetails] = None
    editing_history: List[str] = []
    provenance: Optional[ProvenanceEvidence] = None
    summary: SummaryResult

class HealthResponse(BaseModel):
    status: str
    version: str
    app_name: str

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
    status_code: int

class CleaningReport(BaseModel):
    exif_removed: bool
    gps_removed: bool
    camera_removed: bool
    iptc_removed: bool
    xmp_removed: bool

class CleanResponse(BaseModel):
    original: AnalysisResponse
    cleaned: AnalysisResponse
    report: CleaningReport
    download_id: str
    download_filename: str
