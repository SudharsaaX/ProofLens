import logging
import re
import xml.etree.ElementTree as ET
from typing import Any

from models.response import MetadataResult

logger = logging.getLogger(__name__)
_XMP_PACKET_BEGIN = b"<?xpacket begin"
_XMP_XMPMETA_OPEN = b"<x:xmpmeta"
_XMP_XMPMETA_CLOSE = b"</x:xmpmeta>"
_RDF_NS = "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
_RDF_CONTAINERS = {
    f"{{{_RDF_NS}}}Bag",
    f"{{{_RDF_NS}}}Seq",
    f"{{{_RDF_NS}}}Alt",
}

def _strip_namespace(tag: str) -> str:
    return re.sub(r"\{[^}]+\}", "", tag)

def _find_xmp_xml(file_bytes: bytes) -> str | None:
    start = file_bytes.find(_XMP_PACKET_BEGIN)
    if start != -1:
        meta_start = file_bytes.find(_XMP_XMPMETA_OPEN, start)
        meta_end = file_bytes.find(_XMP_XMPMETA_CLOSE, meta_start if meta_start != -1 else start)
        if meta_start != -1 and meta_end != -1:
            chunk = file_bytes[meta_start: meta_end + len(_XMP_XMPMETA_CLOSE)]
            return chunk.decode("utf-8", errors="replace")
    meta_start = file_bytes.find(_XMP_XMPMETA_OPEN)
    meta_end = file_bytes.find(_XMP_XMPMETA_CLOSE, meta_start if meta_start != -1 else 0)
    if meta_start != -1 and meta_end != -1:
        chunk = file_bytes[meta_start: meta_end + len(_XMP_XMPMETA_CLOSE)]
        return chunk.decode("utf-8", errors="replace")

    return None

def _extract_rdf_value(element: ET.Element) -> Any:
    if element.tag in _RDF_CONTAINERS:
        items = []
        for li in element:
            if li.text and li.text.strip():
                items.append(li.text.strip())
            else:
                items.append(_extract_rdf_value(li))
        return items
    if element.tag == f"{{{_RDF_NS}}}Description":
        nested: dict[str, Any] = {}
        for child in element:
            child_key = _strip_namespace(child.tag)
            nested[child_key] = _extract_rdf_value(child)
        return nested or (element.text.strip() if element.text else None)
    children = list(element)
    if children:
        return _extract_rdf_value(children[0])
    return element.text.strip() if element.text and element.text.strip() else None

def _parse_xmp_xml(xmp_xml: str) -> dict[str, Any]:
    try:
        root = ET.fromstring(xmp_xml)
    except ET.ParseError as exc:
        raise ValueError(f"XMP XML parse error: {exc}") from exc

    data: dict[str, Any] = {}

    for desc in root.iter(f"{{{_RDF_NS}}}Description"):
        for attr_qname, attr_value in desc.attrib.items():
            attr_local = _strip_namespace(attr_qname)
            if attr_local in ("about", "parseType", "resource", "ID"):
                continue
            data[attr_local] = attr_value
        for child in desc:
            key = _strip_namespace(child.tag)
            value = _extract_rdf_value(child)
            if value is not None:
                data[key] = value

    return data

def extract_xmp(file_bytes: bytes) -> MetadataResult:
    logger.info("Extracting XMP metadata")

    xmp_xml = _find_xmp_xml(file_bytes)
    if xmp_xml is None:
        logger.info("No XMP packet found in image")
        return MetadataResult(found=False)

    try:
        data = _parse_xmp_xml(xmp_xml)
    except ValueError as exc:
        logger.warning("XMP parse failed: %s", exc)
        return MetadataResult(found=False, error=str(exc))

    if not data:
        logger.info("XMP packet found but contained no extractable properties")
        return MetadataResult(found=False)

    logger.info("XMP extraction complete: %d properties extracted", len(data))
    return MetadataResult(found=True, data=data)
