import json
import logging
import os
from io import BytesIO

from models.response import C2PAResult

logger = logging.getLogger(__name__)
_EXT_TO_MIME: dict[str, str] = {
    ".jpg":  "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png":  "image/png",
    ".webp": "image/webp",
    ".tiff": "image/tiff",
    ".tif":  "image/tiff",
    ".heic": "image/heic",
    ".heif": "image/heif",
}

def _mime_from_filename(filename: str) -> str:
    ext = os.path.splitext(filename)[1].lower()
    return _EXT_TO_MIME.get(ext, "image/jpeg")

def _parse_manifest_store(manifest_json: str) -> dict:
    try:
        return json.loads(manifest_json)
    except json.JSONDecodeError as exc:
        logger.warning("C2PA manifest JSON decode failed: %s", exc)
        return {}

def _extract_signature_fields(manifest_store: dict) -> tuple[str | None, str | None, bool]:
    active_label = manifest_store.get("active_manifest")
    manifests = manifest_store.get("manifests", {})
    active = manifests.get(active_label, {}) if active_label else {}

    sig_info = active.get("signature_info", {})
    signer = sig_info.get("issuer") or sig_info.get("cert_serial_number")
    signing_time = sig_info.get("time")
    validation_errors = [
        s for s in active.get("validation_status", [])
        if not s.get("code", "").startswith("claimSignature.validated")
        and s.get("url")  # entries with a URL are error entries
    ]
    verified = bool(active) and not validation_errors

    return signer, signing_time, verified

def extract_c2pa(file_bytes: bytes, filename: str) -> C2PAResult:
    logger.info("Checking C2PA Content Credentials for '%s'", filename)
    try:
        import c2pa  # type: ignore[import]
    except ImportError:
        logger.warning("c2pa-python not installed; C2PA check skipped")
        return C2PAResult(
            found=False,
            verified=False,
            status="library_error",
            manifest_present=False,
            error="C2PA library unavailable.",
        )

    mime_type = _mime_from_filename(filename)

    try:
        reader = c2pa.Reader(mime_type, BytesIO(file_bytes))
        manifest_json = reader.json()
        manifest_store = _parse_manifest_store(manifest_json)

        signer, signing_time, verified = _extract_signature_fields(manifest_store)

        logger.info(
            "C2PA manifest found: verified=%s signer=%s",
            verified, signer,
        )

        return C2PAResult(
            found=True,
            verified=verified,
            status="verified" if verified else "validation_failed",
            manifest_present=True,
            manifest=manifest_store,
            signer=signer,
            signing_time=signing_time,
        )

    except c2pa.C2paError as exc:
        if isinstance(exc, c2pa.C2paError.ManifestNotFound):
            logger.info("No C2PA manifest found in '%s'", filename)
            return C2PAResult(found=False, verified=False, status="no_manifest", manifest_present=False)
        if isinstance(exc, c2pa.C2paError.NotSupported):
            logger.info("C2PA not supported for format of '%s'", filename)
            return C2PAResult(found=False, verified=False, status="unsupported", manifest_present=False)
        if isinstance(exc, (c2pa.C2paError.Io, c2pa.C2paError.Decoding)):
            logger.info("C2PA could not read '%s': %s", filename, exc)
            return C2PAResult(found=False, verified=False, status="no_manifest", manifest_present=False)

        # Fallback: the manifest IS present, but parsing failed (e.g., CBOR decode error)
        logger.warning("C2PA extraction error (Parse Error) for '%s': %s", filename, exc)
        return C2PAResult(
            found=True,
            verified=False,
            status="parse_error",
            manifest_present=True,
            error=str(exc)
        )

    except Exception as exc:
        logger.warning("Unexpected C2PA error for '%s': %s", filename, exc, exc_info=True)
        return C2PAResult(
            found=False,
            verified=False,
            status="unknown_error",
            manifest_present=False,
            error="C2PA check failed unexpectedly."
        )
