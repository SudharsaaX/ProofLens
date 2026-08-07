import logging
import time

import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import settings
from api.routes import router
from models.response import ErrorResponse
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
)
logger = logging.getLogger(__name__)
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=settings.APP_DESCRIPTION,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ALLOWED_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS,
)

@app.middleware("http")
async def request_logging_middleware(request: Request, call_next):
    """Log every request with method, path, status, and duration."""
    start = time.perf_counter()
    origin = request.headers.get("origin", "-")
    logger.info(
        "→ %s %s (origin=%s)",
        request.method, request.url.path, origin,
    )
    try:
        response = await call_next(request)
    except Exception:
        duration_ms = (time.perf_counter() - start) * 1000
        logger.exception(
            "← %s %s 500 (%.0fms) — unhandled exception",
            request.method, request.url.path, duration_ms,
        )
        raise
    duration_ms = (time.perf_counter() - start) * 1000
    logger.info(
        "← %s %s %d (%.0fms)",
        request.method, request.url.path, response.status_code, duration_ms,
    )
    return response

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled exception on %s %s", request.method, request.url.path)
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error="Internal server error",
            detail="An unexpected error occurred. Please try again.",
            status_code=500,
        ).model_dump(),
    )
app.include_router(router, prefix="/api")

@app.on_event("startup")
async def log_startup_info():
    logger.info("ProofLens %s starting", settings.APP_VERSION)
    logger.info("CORS allowed origins: %s", settings.CORS_ALLOWED_ORIGINS)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )

