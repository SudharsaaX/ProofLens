import os
from typing import List
APP_NAME: str = "ProofLens"
APP_VERSION: str = "1.0.0"
APP_DESCRIPTION: str = (
    "Verify the provenance and authenticity of digital images "
    "using open standards."
)
HOST: str = "0.0.0.0"
PORT: int = int(os.getenv("PORT", 8000))
DEBUG: bool = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
    "http://localhost:5176",
    "http://127.0.0.1:5176",
    "http://localhost:3000",

    "https://prooflens-tool.vercel.app",
]

# Append environment variable origins if provided (comma-separated)
_env_cors = os.getenv("CORS_ALLOWED_ORIGINS", "")
if _env_cors:
    CORS_ALLOWED_ORIGINS.extend([origin.strip() for origin in _env_cors.split(",") if origin.strip()])
CORS_ALLOW_CREDENTIALS: bool = False
CORS_ALLOW_METHODS: List[str] = ["GET", "POST", "OPTIONS"]
CORS_ALLOW_HEADERS: List[str] = ["Content-Type", "Accept"]
MAX_UPLOAD_SIZE_BYTES: int = 20 * 1024 * 1024  # 20 MB
ALLOWED_MIME_TYPES: List[str] = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/tiff",
    "image/heic",
    "image/heif",
]
ALLOWED_EXTENSIONS: List[str] = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".tiff",
    ".tif",
    ".heic",
    ".heif",
]
C2PA_GRACEFUL_FALLBACK: bool = True
EXIF_MAX_FIELDS: int = 100
