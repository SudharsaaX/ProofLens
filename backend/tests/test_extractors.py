import io
import json
import struct
import sys
import zlib
from pathlib import Path
from typing import Any
from unittest.mock import MagicMock, patch

import pytest
from PIL import Image, ImageCms
from PIL.PngImagePlugin import PngInfo
sys.path.insert(0, str(Path(__file__).parent.parent))

import piexif
from extractors.ai_metadata_extractor import extract_ai_metadata
from extractors.c2pa_extractor import extract_c2pa
from extractors.exif_extractor import extract_exif
from extractors.file_info import extract_file_info
from extractors.iptc_extractor import extract_iptc
from extractors.png_extractor import extract_png_metadata
from extractors.xmp_extractor import extract_xmp
from models.response import AnalysisResponse, AIGeneratorDetails, MetadataResult
from services.analyzer import analyze_image
from services.summary_service import build_summary, _format_source_list

def _make_jpeg(
    width: int = 50,
    height: int = 50,
    color: tuple = (100, 150, 200),
    exif_bytes: bytes | None = None,
    icc_profile: bytes | None = None,
) -> bytes:
    img = Image.new("RGB", (width, height), color=color)
    buf = io.BytesIO()
    save_kwargs: dict[str, Any] = {"format": "JPEG"}
    if exif_bytes:
        save_kwargs["exif"] = exif_bytes
    if icc_profile:
        save_kwargs["icc_profile"] = icc_profile
    img.save(buf, **save_kwargs)
    return buf.getvalue()

def _make_png(
    width: int = 50,
    height: int = 50,
    color: tuple = (200, 100, 50),
    text_chunks: dict[str, str] | None = None,
) -> bytes:
    img = Image.new("RGB", (width, height), color=color)
    pnginfo = PngInfo()
    for key, value in (text_chunks or {}).items():
        pnginfo.add_text(key, value)
    buf = io.BytesIO()
    img.save(buf, format="PNG", pnginfo=pnginfo)
    return buf.getvalue()

def _make_webp(width: int = 50, height: int = 50) -> bytes:
    img = Image.new("RGB", (width, height), color=(50, 100, 200))
    buf = io.BytesIO()
    img.save(buf, format="WEBP")
    return buf.getvalue()

def _make_exif_bytes(software: str = "", description: str = "") -> bytes:
    exif_dict: dict = {"0th": {}, "Exif": {}, "GPS": {}, "Interop": {}, "1st": {}}
    if software:
        exif_dict["0th"][piexif.ImageIFD.Software] = software.encode()
    if description:
        exif_dict["0th"][piexif.ImageIFD.ImageDescription] = description.encode()
    return piexif.dump(exif_dict)

def _make_xmp_bytes(creator_tool: str = "", extra_ns: str = "") -> bytes:
    xmp = f"""<?xpacket begin="\xef\xbb\xbf" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/" xmlns:xmp="http://ns.adobe.com/xap/1.0/" {extra_ns}>
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about="">
      <xmp:CreatorTool>{creator_tool}</xmp:CreatorTool>
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>"""
    img = Image.new("RGB", (10, 10))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    jpeg = buf.getvalue()
    xmp_data = xmp.encode("utf-8")
    return jpeg[:2] + xmp_data + jpeg[2:]

class TestFileInfoExtractor:
    def test_jpeg_basic(self):
        data = _make_jpeg()
        result = extract_file_info(data, "photo.jpg")
        assert result.format == "JPEG"
        assert result.mime_type == "image/jpeg"
        assert result.width == 50
        assert result.height == 50
        assert result.size_bytes == len(data)
        assert len(result.sha256) == 64
        assert result.filename == "photo.jpg"

    def test_png_basic(self):
        data = _make_png()
        result = extract_file_info(data, "image.png")
        assert result.format == "PNG"
        assert result.mime_type == "image/png"
        assert result.width == 50

    def test_webp_basic(self):
        data = _make_webp()
        result = extract_file_info(data, "image.webp")
        assert result.format == "WEBP"
        assert result.mime_type == "image/webp"

    def test_sha256_is_deterministic(self):
        data = _make_jpeg(color=(10, 20, 30))
        r1 = extract_file_info(data, "a.jpg")
        r2 = extract_file_info(data, "b.jpg")
        assert r1.sha256 == r2.sha256

    def test_sha256_changes_with_content(self):
        r1 = extract_file_info(_make_jpeg(color=(0, 0, 0)), "a.jpg")
        r2 = extract_file_info(_make_jpeg(color=(255, 255, 255)), "b.jpg")
        assert r1.sha256 != r2.sha256

    def test_corrupt_image_raises_value_error(self):
        with pytest.raises(ValueError, match="Cannot identify"):
            extract_file_info(b"not an image at all", "bad.jpg")

    def test_mpo_normalised_to_jpeg(self):
        data = _make_jpeg()
        with patch("extractors.file_info.Image.open") as mock_open:
            mock_img = MagicMock()
            mock_img.__enter__ = lambda s: mock_img
            mock_img.__exit__ = MagicMock(return_value=False)
            mock_img.format = "MPO"
            mock_img.size = (100, 100)
            mock_open.return_value = mock_img
            result = extract_file_info(data, "stereo.jpg")
        assert result.format == "JPEG"
        assert result.mime_type == "image/jpeg"

class TestExifExtractor:
    def test_no_exif(self):
        data = _make_jpeg()
        result = extract_exif(data)
        assert result.found is False
        assert result.data == {}

    def test_with_software_tag(self):
        exif = _make_exif_bytes(software="Adobe Photoshop 24.0")
        data = _make_jpeg(exif_bytes=exif)
        result = extract_exif(data)
        assert result.found is True
        assert "Software" in result.data
        assert "Adobe Photoshop" in result.data["Software"]

    def test_png_with_exif(self):
        exif = _make_exif_bytes(software="TestTool")
        img = Image.new("RGB", (30, 30))
        buf = io.BytesIO()
        img.save(buf, format="PNG", exif=exif)
        result = extract_exif(buf.getvalue())
        assert isinstance(result, MetadataResult)

    def test_webp_no_crash(self):
        result = extract_exif(_make_webp())
        assert result.found is False

    def test_returns_metadata_result_type(self):
        result = extract_exif(_make_jpeg())
        assert isinstance(result, MetadataResult)

class TestIptcExtractor:
    def test_no_iptc(self):
        result = extract_iptc(_make_jpeg())
        assert result.found is False

    def test_no_crash_on_png(self):
        result = extract_iptc(_make_png())
        assert isinstance(result, MetadataResult)

    def test_no_crash_on_webp(self):
        result = extract_iptc(_make_webp())
        assert isinstance(result, MetadataResult)

    def test_returns_metadata_result_type(self):
        result = extract_iptc(_make_jpeg())
        assert isinstance(result, MetadataResult)

class TestXmpExtractor:
    def test_no_xmp(self):
        result = extract_xmp(_make_jpeg())
        assert result.found is False

    def test_no_xmp_png(self):
        result = extract_xmp(_make_png())
        assert result.found is False

    def test_finds_xmp_in_image(self):
        xmp_packet = (
            b'<?xpacket begin="\xef\xbb\xbf" id="W5M0MpCehiHzreSzNTczkc9d"?>'
            b'<x:xmpmeta xmlns:x="adobe:ns:meta/" xmlns:xmp="http://ns.adobe.com/xap/1.0/">'
            b'<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">'
            b'<rdf:Description rdf:about="" xmp:CreatorTool="TestSoftware 1.0"/>'
            b'</rdf:RDF></x:xmpmeta>'
            b'<?xpacket end="w"?>'
        )
        jpeg = _make_jpeg()
        data = jpeg[:2] + xmp_packet + jpeg[2:]
        result = extract_xmp(data)
        assert result.found is True
        assert "CreatorTool" in result.data
        assert "TestSoftware" in result.data["CreatorTool"]

    def test_no_crash_on_webp(self):
        result = extract_xmp(_make_webp())
        assert isinstance(result, MetadataResult)

    def test_returns_metadata_result_type(self):
        result = extract_xmp(_make_jpeg())
        assert isinstance(result, MetadataResult)

class TestPngExtractor:
    def test_jpeg_has_no_png_chunks(self):
        result = extract_png_metadata(_make_jpeg())
        assert isinstance(result, MetadataResult)

    def test_png_with_text_chunks(self):
        data = _make_png(text_chunks={"Software": "TestApp", "Comment": "hello"})
        result = extract_png_metadata(data)
        assert result.found is True
        assert "Software" in result.data or "Comment" in result.data

    def test_png_without_text_chunks(self):
        data = _make_png()
        result = extract_png_metadata(data)
        assert isinstance(result, MetadataResult)

    def test_icc_profile_extracted(self):
        srgb = ImageCms.createProfile("sRGB")
        srgb_bytes = ImageCms.ImageCmsProfile(srgb).tobytes()
        data = _make_jpeg(icc_profile=srgb_bytes)
        result = extract_png_metadata(data)
        assert result.found is True
        assert "icc_profile_name" in result.data

    def test_webp_no_crash(self):
        result = extract_png_metadata(_make_webp())
        assert isinstance(result, MetadataResult)

class TestAiMetadataExtractor:
    def _meta(self, data=None):
        return MetadataResult(found=bool(data), data=data or {})

    def test_no_signals_returns_none(self):
        result = extract_ai_metadata(self._meta(), self._meta(), self._meta())
        assert result is None

    def test_exif_software_automatic1111(self):
        result = extract_ai_metadata(
            self._meta({"Software": "AUTOMATIC1111 v1.8.0"}),
            self._meta(),
            self._meta(),
        )
        assert result is not None
        assert result.generator_name == "Automatic1111"

    def test_exif_software_dalle(self):
        result = extract_ai_metadata(
            self._meta({"Software": "DALL-E 3"}),
            self._meta(),
            self._meta(),
        )
        assert result is not None
        assert "DALL-E" in result.generator_name

    def test_exif_software_firefly(self):
        result = extract_ai_metadata(
            self._meta({"Software": "Adobe Firefly 2.0"}),
            self._meta(),
            self._meta(),
        )
        assert result is not None
        assert "Firefly" in result.generator_name

    def test_exif_software_stability_ai(self):
        result = extract_ai_metadata(
            self._meta({"Software": "Stable Diffusion XL"}),
            self._meta(),
            self._meta(),
        )
        assert result is not None
        assert result.generator_name == "Stable Diffusion"

    def test_png_comfyui_workflow_and_prompt(self):
        result = extract_ai_metadata(
            self._meta(),
            self._meta(),
            self._meta({"workflow": '{"nodes":[]}', "prompt": '{"1":{}}'}),
        )
        assert result is not None
        assert result.generator_name == "ComfyUI"
        assert result.workflow is not None

    def test_png_invokeai_chunk_not_matched(self):
        result = extract_ai_metadata(
            self._meta(),
            self._meta(),
            self._meta({"invokeai_metadata": '{"model":"stable-diffusion"}'}),
        )
        assert result is None

    def test_png_parameters_with_steps(self):
        result = extract_ai_metadata(
            self._meta(),
            self._meta(),
            self._meta({"parameters": "a cat\nSteps: 20, Sampler: Euler a, CFG scale: 7"}),
        )
        assert result is not None
        assert result.steps_found is True
        assert result.sampler_found is True
        assert result.cfg_found is True
        assert result.parameters is not None

    def test_exif_software_midjourney(self):
        result = extract_ai_metadata(
            self._meta({"Software": "Midjourney v6"}),
            self._meta(),
            self._meta(),
        )
        assert result is not None
        assert result.generator_name == "Midjourney"

    def test_xmp_creator_tool_firefly(self):
        result = extract_ai_metadata(
            self._meta(),
            self._meta({"CreatorTool": "Adobe Firefly 3.0"}),
            self._meta(),
        )
        assert result is not None
        assert "Firefly" in result.generator_name

    def test_exif_takes_priority_over_png(self):
        result = extract_ai_metadata(
            self._meta({"Software": "DALL-E 3"}),
            self._meta(),
            self._meta({"parameters": "Steps: 20, Sampler: Euler a"}),
        )
        assert result is not None
        assert "DALL-E" in result.generator_name

    def test_result_captures_workflow(self):
        result = extract_ai_metadata(
            self._meta(),
            self._meta(),
            self._meta({"workflow": '{"nodes":[]}'}),
        )
        assert result is not None
        assert result.workflow is not None
        assert result.generator_name == "ComfyUI"

    def test_workflow_alone_is_comfyui_signal(self):
        result = extract_ai_metadata(
            self._meta(),
            self._meta(),
            self._meta({"workflow": "some data"}),
        )
        assert result is not None
        assert result.generator_name == "ComfyUI"

class TestC2paExtractor:
    def test_no_c2pa_in_plain_jpeg(self):
        result = extract_c2pa(_make_jpeg(), "test.jpg")
        assert result.found is False
        assert result.verified is False
        assert result.error is None

    def test_no_c2pa_in_png(self):
        result = extract_c2pa(_make_png(), "test.png")
        assert result.found is False

    def test_no_c2pa_in_webp(self):
        result = extract_c2pa(_make_webp(), "test.webp")
        assert result.found is False

    def test_graceful_when_library_missing(self):
        with patch.dict("sys.modules", {"c2pa": None}):
            import importlib
            import extractors.c2pa_extractor as mod
            importlib.reload(mod)
            result = mod.extract_c2pa(_make_jpeg(), "test.jpg")
        importlib.reload(mod)
        assert result.found is False
        assert result.error is not None

    def test_c2pa_verify_error_returns_found_true(self):
        import c2pa
        with patch("c2pa.Reader") as mock_reader:
            mock_reader.side_effect = c2pa.C2paError.Verify("Claim signature invalid")
            result = extract_c2pa(_make_jpeg(), "test.jpg")
            assert result.found is True
            assert result.manifest_present is True
            assert result.status == "validation_failed"
            assert result.verified is False

class TestMetadataCleaner:
    def test_clean_jpeg_with_exif_losslessly(self):
        from services.metadata_cleaner import clean_image
        exif_bytes = _make_exif_bytes(software="TestCam", description="Sample Photo")
        jpeg = _make_jpeg(exif_bytes=exif_bytes)
        
        # Clean image with remove_exif=True
        cleaned = clean_image(jpeg, remove_exif=True, remove_gps=True, remove_camera=True, remove_iptc=True, remove_xmp=True)
        
        # Check that cleaned JPEG is valid and loadable by PIL
        img = Image.open(io.BytesIO(cleaned))
        assert img.format == "JPEG"
        
        # Ensure EXIF software was removed
        exif_res = extract_exif(cleaned)
        assert "Software" not in exif_res.data

    def test_clean_jpeg_selectively(self):
        from services.metadata_cleaner import clean_image
        exif_bytes = _make_exif_bytes(software="TestCam", description="Sample Photo")
        jpeg = _make_jpeg(exif_bytes=exif_bytes)
        
        # Clean only camera info
        cleaned = clean_image(jpeg, remove_exif=False, remove_camera=True)
        img = Image.open(io.BytesIO(cleaned))
        assert img.format == "JPEG"
        
        exif_res = extract_exif(cleaned)
        assert "Software" not in exif_res.data

class TestSummaryService:
    def _c2pa(self, found=False, verified=False, signer=None, signing_time=None, error=None):
        from models.response import C2PAResult
        return C2PAResult(found=found, verified=verified, signer=signer,
                          signing_time=signing_time, error=error)

    def _meta(self, found=False):
        return MetadataResult(found=found)

    def _evidence(self, score="No Provenance"):
        from models.response import ProvenanceEvidence
        return ProvenanceEvidence(score=score, reasoning=[])

    def _build(self, c2pa, exif, iptc, xmp, score="No Provenance"):
        return build_summary(c2pa, exif, iptc, xmp, self._evidence(score), None, None, None)

    def test_no_provenance(self):
        result = self._build(self._c2pa(), self._meta(), self._meta(), self._meta())
        assert result.has_provenance is False
        assert result.provenance_sources == []
        assert "does not prove" in result.human_explanation

    def test_c2pa_verified(self):
        result = self._build(
            self._c2pa(found=True, verified=True, signer="Adobe Inc."),
            self._meta(), self._meta(), self._meta(),
        )
        assert result.has_provenance is True
        assert "c2pa" in result.provenance_sources
        assert "successfully verified" in result.human_explanation

    def test_c2pa_unverified(self):
        result = self._build(
            self._c2pa(found=True, verified=False),
            self._meta(), self._meta(), self._meta(),
            score="Partial Provenance",
        )
        assert result.has_provenance is True
        assert "c2pa" in result.provenance_sources

    def test_metadata_only(self):
        result = self._build(
            self._c2pa(), self._meta(found=True), self._meta(), self._meta(found=True),
            score="Metadata Present",
        )
        assert result.has_provenance is True
        assert "exif" in result.provenance_sources
        assert "xmp" in result.provenance_sources

    def test_explanation_always_present(self):
        scenarios = [
            (self._c2pa(), self._meta(), self._meta(), self._meta()),
            (self._c2pa(found=True, verified=True), self._meta(), self._meta(), self._meta()),
            (self._c2pa(), self._meta(found=True), self._meta(found=True), self._meta(found=True)),
        ]
        for args in scenarios:
            result = self._build(*args)
            assert len(result.human_explanation) > 0

    def test_never_claims_ai_generated(self):
        import re
        definitive_ai_claim = re.compile(
            r"\b(this image|it) (is|was) (AI-generated|made by AI|created by AI)\b",
            re.I,
        )
        scenarios = [
            (self._c2pa(), self._meta(), self._meta(), self._meta()),
            (self._c2pa(found=True, verified=True), self._meta(), self._meta(), self._meta()),
            (self._c2pa(), self._meta(found=True), self._meta(found=True), self._meta(found=True)),
        ]
        for args in scenarios:
            result = self._build(*args)
            assert not definitive_ai_claim.search(result.human_explanation), (
                f"Definitive AI claim found in: {result.human_explanation}"
            )

    def test_format_source_list_single(self):
        assert _format_source_list(["exif"]) == "EXIF"

    def test_format_source_list_two(self):
        assert _format_source_list(["exif", "xmp"]) == "EXIF and XMP"

    def test_format_source_list_three(self):
        assert _format_source_list(["exif", "iptc", "xmp"]) == "EXIF, IPTC and XMP"

class TestAnalyzerIntegration:
    def test_jpeg_returns_analysis_response(self):
        result = analyze_image(_make_jpeg(), "photo.jpg")
        assert isinstance(result, AnalysisResponse)
        assert result.file_info.format == "JPEG"

    def test_png_returns_analysis_response(self):
        result = analyze_image(_make_png(), "image.png")
        assert isinstance(result, AnalysisResponse)
        assert result.file_info.format == "PNG"

    def test_webp_returns_analysis_response(self):
        result = analyze_image(_make_webp(), "image.webp")
        assert isinstance(result, AnalysisResponse)
        assert result.file_info.format == "WEBP"

    def test_plain_image_has_no_provenance(self):
        result = analyze_image(_make_jpeg(), "photo.jpg")
        assert result.summary.has_provenance is False
        assert result.c2pa.found is False

    def test_exif_image_has_provenance(self):
        exif = _make_exif_bytes(software="TestCamera 1.0")
        result = analyze_image(_make_jpeg(exif_bytes=exif), "photo.jpg")
        assert result.exif.found is True
        assert result.summary.has_provenance is True

    def test_ai_generator_detected(self):
        exif = _make_exif_bytes(software="AUTOMATIC1111 v1.9")
        result = analyze_image(_make_jpeg(exif_bytes=exif), "ai_image.jpg")
        assert result.generator_metadata is not None
        assert "Automatic1111" in result.generator_metadata.generator_name

    def test_no_ai_generator_for_plain_image(self):
        result = analyze_image(_make_jpeg(), "plain.jpg")
        assert result.generator_metadata is None

    def test_corrupt_image_raises_http_exception(self):
        from fastapi import HTTPException
        with pytest.raises(HTTPException) as exc_info:
            analyze_image(b"this is not an image", "bad.jpg")
        assert exc_info.value.status_code == 400

    def test_response_serializes_cleanly(self):
        result = analyze_image(_make_jpeg(), "photo.jpg")
        d = result.model_dump()
        assert set(d.keys()) == {
            "file_info", "c2pa", "exif", "iptc", "xmp", "png_metadata",
            "camera_information", "software_detected", "generator_metadata",
            "editing_history", "provenance", "summary",
        }

    def test_png_comfyui_detected(self):
        data = _make_png(text_chunks={"workflow": '{"nodes":[]}', "prompt": '{"1":{}}'})
        result = analyze_image(data, "comfyui_image.png")
        assert result.generator_metadata is not None
        assert "ComfyUI" in result.generator_metadata.generator_name

    def test_response_sha256_length(self):
        result = analyze_image(_make_jpeg(), "photo.jpg")
        assert len(result.file_info.sha256) == 64
