import logging
import re
from typing import Any

from models.response import AIGeneratorDetails, MetadataResult

logger = logging.getLogger(__name__)

# Very common generators
_GENERATORS = [
    (re.compile(r"Midjourney", re.I), "Midjourney"),
    (re.compile(r"DALL.?E", re.I), "OpenAI DALL-E"),
    (re.compile(r"ComfyUI", re.I), "ComfyUI"),
    (re.compile(r"AUTOMATIC1111", re.I), "Automatic1111"),
    (re.compile(r"Stable Diffusion", re.I), "Stable Diffusion"),
    (re.compile(r"Adobe Firefly", re.I), "Adobe Firefly"),
    (re.compile(r"Fooocus", re.I), "Fooocus"),
    (re.compile(r"InvokeAI", re.I), "InvokeAI"),
    (re.compile(r"Bing Image Creator", re.I), "Bing Image Creator"),
    (re.compile(r"Canva", re.I), "Canva AI"),
    (re.compile(r"Leonardo.?ai", re.I), "Leonardo AI"),
    (re.compile(r"Ideogram", re.I), "Ideogram"),
    (re.compile(r"FLUX", re.I), "FLUX"),
]

def _check_name(val: str) -> str | None:
    if not isinstance(val, str): return None
    for pat, name in _GENERATORS:
        if pat.search(val): return name
    return None

def _extract_params(text: str, details: AIGeneratorDetails):
    if re.search(r"(?:Steps|Sampler|CFG scale|Seed):\s*", text, re.I):
        details.parameters = text[:1000]
        if "Steps:" in text: details.steps_found = True
        if "Sampler:" in text: details.sampler_found = True
        if "CFG scale:" in text: details.cfg_found = True
        if "Seed:" in text: details.seed_found = True

        if "Negative prompt:" in text:
            details.prompt_found = True
            details.negative_prompt_found = True
        else:
            details.prompt_found = True

def extract_ai_metadata(
    exif: MetadataResult,
    xmp: MetadataResult,
    png_meta: MetadataResult | None
) -> AIGeneratorDetails | None:
    logger.info("Extracting AI generator metadata")
    details = AIGeneratorDetails()
    found = False

    # Check PNG chunks first
    if png_meta and png_meta.found and png_meta.data:
        workflow = png_meta.data.get("workflow")
        prompt = png_meta.data.get("prompt")
        params = png_meta.data.get("parameters")

        if workflow:
            details.workflow = str(workflow)[:1000]
            details.generator_name = "ComfyUI"
            found = True
        if prompt:
            details.prompt_found = True
            found = True
        if params:
            _extract_params(str(params), details)
            found = True

    # Check EXIF
    if exif.found and exif.data:
        software = exif.data.get("Software")
        if software:
            name = _check_name(str(software))
            if name:
                details.generator_name = details.generator_name or name
                found = True

    # Check XMP
    if xmp.found and xmp.data:
        creator_tool = xmp.data.get("CreatorTool") or xmp.data.get("xmp:CreatorTool")
        if creator_tool:
            name = _check_name(str(creator_tool))
            if name:
                details.generator_name = details.generator_name or name
                found = True

    if not found:
        return None

    return details
