import logging
from io import BytesIO

import piexif
from PIL import Image, ImageOps

logger = logging.getLogger(__name__)

def strip_xmp_iptc_lossless(image_bytes: bytes, remove_iptc: bool, remove_xmp: bool) -> bytes:
    if not image_bytes.startswith(b'\xff\xd8'):
        return image_bytes

    out = bytearray(b'\xff\xd8')
    i = 2
    length = len(image_bytes)

    while i < length:
        while i < length and image_bytes[i] != 0xff:
            out.append(image_bytes[i])
            i += 1

        if i >= length:
            break

        out.append(0xff)
        i += 1

        while i < length and image_bytes[i] == 0xff:
            out.append(0xff)
            i += 1

        if i >= length:
            break

        marker = image_bytes[i]
        out.append(marker)
        i += 1
        if marker == 0xd8 or marker == 0x01 or (0xd0 <= marker <= 0xd7):
            continue
        if marker == 0xda:
            out.extend(image_bytes[i:])
            break
        if marker == 0xd9:
            break
        if i + 1 >= length:
            break

        seg_length = (image_bytes[i] << 8) + image_bytes[i+1]
        segment_data = image_bytes[i:i+seg_length]

        keep = True
        if marker == 0xe1 and remove_xmp:
            if segment_data[2:31] == b'http://ns.adobe.com/xap/1.0/\x00':
                keep = False
        elif marker == 0xed and remove_iptc:
            keep = False

        if keep:
            out.extend(segment_data)

        i += seg_length

    return bytes(out)

def clean_image(
    file_bytes: bytes,
    remove_exif: bool = True,
    remove_gps: bool = True,
    remove_camera: bool = True,
    remove_iptc: bool = True,
    remove_xmp: bool = True
) -> bytes:
    logger.info("Cleaning image metadata...")
    is_jpeg = file_bytes.startswith(b'\xff\xd8')

    if is_jpeg:
        logger.info("Processing JPEG losslessly via segment manipulation.")
        cleaned_bytes = strip_xmp_iptc_lossless(file_bytes, remove_iptc, remove_xmp)
        try:
            exif_dict = piexif.load(cleaned_bytes)
            exif_present = True
        except Exception:
            exif_present = False

        if exif_present:
            modified = False

            if remove_exif:
                orientation = exif_dict.get("0th", {}).get(piexif.ImageIFD.Orientation)
                if orientation is not None:
                    new_dict = {"0th": {piexif.ImageIFD.Orientation: orientation}, "Exif": {}, "GPS": {}, "Interop": {}, "1st": {}}
                    try:
                        new_exif = piexif.dump(new_dict)
                        out_io = BytesIO()
                        piexif.insert(new_exif, cleaned_bytes, out_io)
                        cleaned_bytes = out_io.getvalue()
                    except Exception as e:
                        logger.warning(f"Failed to insert minimal EXIF: {e}")
                else:
                    try:
                        out_io = BytesIO()
                        piexif.remove(cleaned_bytes, out_io)
                        cleaned_bytes = out_io.getvalue()
                    except Exception as e:
                        logger.warning(f"Failed to remove EXIF completely: {e}")
            else:
                if remove_gps and "GPS" in exif_dict:
                    exif_dict["GPS"] = {}
                    modified = True
                if remove_camera and "0th" in exif_dict:
                    for tag in [piexif.ImageIFD.Make, piexif.ImageIFD.Model, piexif.ImageIFD.Software]:
                        if tag in exif_dict["0th"]:
                            del exif_dict["0th"][tag]
                            modified = True

                if modified:
                    try:
                        new_exif = piexif.dump(exif_dict)
                        out_io = BytesIO()
                        piexif.insert(new_exif, cleaned_bytes, out_io)
                        cleaned_bytes = out_io.getvalue()
                    except Exception as e:
                        logger.warning(f"Failed to selectively clean EXIF: {e}")

        return cleaned_bytes
    logger.info("Processing non-JPEG via Pillow.")
    try:
        img = Image.open(BytesIO(file_bytes))
    except Exception as e:
        logger.error(f"Failed to open image for cleaning: {e}")
        raise ValueError("Invalid image format for cleaning")

    original_info = img.info.copy()
    fmt = img.format if img.format else "PNG"

    orig_format = img.format
    try:
        img = ImageOps.exif_transpose(img)
    except Exception as e:
        logger.warning(f"Could not transpose image by EXIF: {e}")

    img.format = orig_format
    img.info.update(original_info)

    new_exif_bytes = b""
    raw_exif = original_info.get("exif")

    if raw_exif and not remove_exif:
        try:
            exif_dict = piexif.load(raw_exif)
            if remove_gps and "GPS" in exif_dict:
                exif_dict["GPS"] = {}
            if remove_camera and "0th" in exif_dict:
                for tag in [piexif.ImageIFD.Make, piexif.ImageIFD.Model, piexif.ImageIFD.Software]:
                    if tag in exif_dict["0th"]:
                        del exif_dict["0th"][tag]
            new_exif_bytes = piexif.dump(exif_dict)
        except Exception as e:
            logger.warning(f"Failed to parse EXIF for selective cleaning: {e}")
            if not remove_exif:
                new_exif_bytes = raw_exif

    out_io = BytesIO()
    save_kwargs = {}

    if new_exif_bytes:
        save_kwargs["exif"] = new_exif_bytes

    if "icc_profile" in original_info:
        save_kwargs["icc_profile"] = original_info["icc_profile"]

    if "dpi" in original_info:
        save_kwargs["dpi"] = original_info["dpi"]

    if fmt == "PNG":
        save_kwargs["optimize"] = True
    elif fmt == "WEBP":
        save_kwargs["quality"] = 100
        save_kwargs["method"] = 6
        if original_info.get("lossless"):
            save_kwargs["lossless"] = True

    try:
        img.save(out_io, format=fmt, **save_kwargs)
    except Exception as e:
        logger.warning(f"Fallback triggered. Exception: {e}")
        safe_kwargs = {"exif": new_exif_bytes} if new_exif_bytes else {}
        img.save(out_io, format=fmt, **safe_kwargs)

    return out_io.getvalue()
