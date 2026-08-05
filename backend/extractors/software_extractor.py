import logging
import re
from typing import Any

from models.response import MetadataResult

logger = logging.getLogger(__name__)

_SOFTWARE_PATTERNS = [
    (re.compile(r"Adobe Photoshop", re.I), "Adobe Photoshop"),
    (re.compile(r"Adobe Lightroom", re.I), "Adobe Lightroom"),
    (re.compile(r"Canva", re.I), "Canva"),
    (re.compile(r"Figma", re.I), "Figma"),
    (re.compile(r"GIMP", re.I), "GIMP"),
    (re.compile(r"Krita", re.I), "Krita"),
    (re.compile(r"Affinity Photo", re.I), "Affinity Photo"),
    (re.compile(r"ComfyUI", re.I), "ComfyUI"),
    (re.compile(r"AUTOMATIC1111", re.I), "Automatic1111"),
    (re.compile(r"Stable Diffusion WebUI", re.I), "Stable Diffusion WebUI"),
    (re.compile(r"ChatGPT", re.I), "ChatGPT"),
    (re.compile(r"DALL.?E", re.I), "OpenAI DALL-E"),
    (re.compile(r"Gemini", re.I), "Gemini"),
    (re.compile(r"Midjourney", re.I), "Midjourney"),
    (re.compile(r"Adobe Firefly", re.I), "Adobe Firefly"),
    (re.compile(r"Bing Image Creator", re.I), "Bing Image Creator"),
    (re.compile(r"Leonardo.?ai", re.I), "Leonardo AI"),
    (re.compile(r"Ideogram", re.I), "Ideogram"),
    (re.compile(r"FLUX", re.I), "FLUX"),
]

def _check_patterns(value: str) -> str | None:
    if not isinstance(value, str):
        return None
    for pattern, name in _SOFTWARE_PATTERNS:
        if pattern.search(value):
            return name
    return None

def extract_software(
    exif: MetadataResult,
    xmp: MetadataResult,
    png_meta: MetadataResult | None
) -> str | None:
    logger.info("Scanning for software signatures")

    # Check EXIF
    if exif.found and exif.data:
        software = exif.data.get("Software")
        if software:
            res = _check_patterns(str(software))
            if res:
                return res

    # Check XMP
    if xmp.found and xmp.data:
        creator_tool = xmp.data.get("CreatorTool") or xmp.data.get("xmp:CreatorTool")
        if creator_tool:
            res = _check_patterns(str(creator_tool))
            if res:
                return res
        for k, v in xmp.data.items():
            if isinstance(v, str):
                res = _check_patterns(v)
                if res:
                    return res

    # Check PNG Metadata
    if png_meta and png_meta.found and png_meta.data:
        for key in ["Software", "Description", "Comment", "parameters", "workflow", "tEXt", "iTXt", "zTXt"]:
            val = png_meta.data.get(key)
            if val:
                res = _check_patterns(str(val))
                if res:
                    return res

    return None
