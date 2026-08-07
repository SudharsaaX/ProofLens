import logging
import os
import time
import uuid
from io import BytesIO

from fastapi import APIRouter, HTTPException, UploadFile, File, Form, status, Response
from PIL import Image, UnidentifiedImageError
from starlette.concurrency import run_in_threadpool

from config import settings
from models.response import AnalysisResponse, ErrorResponse, HealthResponse, CleanResponse, CleaningReport
from services.analyzer import analyze_image
from services.metadata_cleaner import clean_image

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health check",
    tags=["System"],
)
async def health_check():
    return HealthResponse(
        status="ok",
        version=settings.APP_VERSION,
        app_name=settings.APP_NAME,
    )

@router.post(
    "/analyze",
    response_model=AnalysisResponse,
    summary="Analyze image provenance",
    tags=["Analysis"],
    responses={
        400: {"model": ErrorResponse, "description": "Invalid file or format"},
        413: {"model": ErrorResponse, "description": "File too large"},
        500: {"model": ErrorResponse, "description": "Internal server error"},
    },
)
async def analyze_image_endpoint(file: UploadFile = File(...)):
    logger.info(
        "Analyze request received — filename='%s' content_type='%s'",
        file.filename, file.content_type,
    )
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Unsupported file extension '{ext}'. "
                f"Allowed: {', '.join(settings.ALLOWED_EXTENSIONS)}"
            ),
        )
    if file.content_type not in settings.ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported MIME type '{file.content_type}'.",
        )
    file_bytes = await file.read()
    if len(file_bytes) > settings.MAX_UPLOAD_SIZE_BYTES:
        size_mb = settings.MAX_UPLOAD_SIZE_BYTES // (1024 * 1024)
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds the {size_mb} MB upload limit.",
        )
    try:
        Image.open(BytesIO(file_bytes)).close()
    except UnidentifiedImageError:
        logger.warning(
            "Rejected upload — unidentified image format: filename='%s'",
            file.filename,
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded file is not a recognized image format.",
        )
    except Exception as exc:
        logger.warning(
            "Rejected upload — image header unreadable: filename='%s' error=%s",
            file.filename, exc,
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded file could not be read. It may be corrupt.",
        )
    result = await run_in_threadpool(analyze_image, file_bytes, file.filename or "unknown")

    logger.info(
        "Analyze request complete — filename='%s'",
        file.filename,
    )

    return result
cleaned_images_cache = {}
CACHE_TTL_SECONDS = 600  # 10 minutes

def cleanup_cache():
    now = time.time()
    expired_keys = [k for k, v in cleaned_images_cache.items() if v[3] < now]
    for k in expired_keys:
        del cleaned_images_cache[k]

@router.post(
    "/clean",
    response_model=CleanResponse,
    summary="Clean image metadata",
    tags=["Cleaning"],
    responses={
        400: {"model": ErrorResponse, "description": "Invalid file or format"},
        413: {"model": ErrorResponse, "description": "File too large"},
        500: {"model": ErrorResponse, "description": "Internal server error"},
    },
)
async def clean_image_endpoint(
    file: UploadFile = File(...),
    remove_exif: bool = Form(True),
    remove_gps: bool = Form(True),
    remove_camera: bool = Form(True),
    remove_iptc: bool = Form(True),
    remove_xmp: bool = Form(True),
):
    logger.info("Clean request received — filename='%s'", file.filename)
    cleanup_cache()
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Unsupported extension '{ext}'")

    if file.content_type not in settings.ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail=f"Unsupported MIME type '{file.content_type}'")

    file_bytes = await file.read()
    if len(file_bytes) > settings.MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(status_code=413, detail="File too large")

    try:
        Image.open(BytesIO(file_bytes)).close()
    except UnidentifiedImageError:
        raise HTTPException(status_code=400, detail="Unrecognized image format")
    except Exception:
        raise HTTPException(status_code=400, detail="Corrupt image")
    original_analysis = await run_in_threadpool(analyze_image, file_bytes, file.filename or "unknown")
    try:
        cleaned_bytes = await run_in_threadpool(
            clean_image,
            file_bytes,
            remove_exif=remove_exif,
            remove_gps=remove_gps,
            remove_camera=remove_camera,
            remove_iptc=remove_iptc,
            remove_xmp=remove_xmp,
        )
    except Exception as exc:
        logger.error(f"Error during cleaning: {exc}")
        raise HTTPException(status_code=500, detail="Failed to clean image")
    cleaned_filename = f"cleaned_{file.filename}"
    cleaned_analysis = await run_in_threadpool(analyze_image, cleaned_bytes, cleaned_filename)
    has_orig_gps = any(k.startswith("GPS") for k in original_analysis.exif.data)
    has_clean_gps = any(k.startswith("GPS") for k in cleaned_analysis.exif.data)
    has_orig_cam = any(k in original_analysis.exif.data for k in ("Make", "Model", "Software"))
    has_clean_cam = any(k in cleaned_analysis.exif.data for k in ("Make", "Model", "Software"))

    report = CleaningReport(
        exif_removed=remove_exif and original_analysis.exif.found and not cleaned_analysis.exif.found,
        gps_removed=remove_gps and has_orig_gps and not has_clean_gps,
        camera_removed=remove_camera and has_orig_cam and not has_clean_cam,
        iptc_removed=remove_iptc and original_analysis.iptc.found and not cleaned_analysis.iptc.found,
        xmp_removed=remove_xmp and original_analysis.xmp.found and not cleaned_analysis.xmp.found,
        png_removed=bool(original_analysis.png_metadata and original_analysis.png_metadata.found and not (cleaned_analysis.png_metadata and cleaned_analysis.png_metadata.found)),
        c2pa_removed=bool(original_analysis.c2pa and original_analysis.c2pa.found and not (cleaned_analysis.c2pa and cleaned_analysis.c2pa.found)),
    )
    download_id = str(uuid.uuid4())
    expires_at = time.time() + CACHE_TTL_SECONDS
    cleaned_images_cache[download_id] = (cleaned_bytes, cleaned_filename, file.content_type, expires_at)

    logger.info("Clean request complete — filename='%s' download_id='%s'", file.filename, download_id)

    return CleanResponse(
        original=original_analysis,
        cleaned=cleaned_analysis,
        report=report,
        download_id=download_id,
        download_filename=cleaned_filename
    )

@router.get(
    "/download/{download_id}",
    summary="Download cleaned image",
    tags=["Cleaning"],
)
async def download_cleaned_image(download_id: str):
    cleanup_cache()

    if download_id not in cleaned_images_cache:
        raise HTTPException(status_code=404, detail="Cleaned image not found or expired")

    cleaned_bytes, filename, content_type, _ = cleaned_images_cache[download_id]

    return Response(
        content=cleaned_bytes,
        media_type=content_type,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )
