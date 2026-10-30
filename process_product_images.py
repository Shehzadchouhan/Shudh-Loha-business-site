from __future__ import annotations

import re
import sys
import unicodedata
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parent
SOURCE_DIR = ROOT / "product-images-raw"
OUTPUT_DIR = ROOT / "Assets" / "products"
BACKGROUND = (245, 242, 236)
MAX_BYTES = 200 * 1024


def output_name(source: Path) -> str:
    normalized = unicodedata.normalize("NFKD", source.stem).encode("ascii", "ignore").decode()
    slug = re.sub(r"[^a-z0-9]+", "-", normalized.lower()).strip("-")
    if not slug:
        raise ValueError(f"Cannot create a filename from {source.name!r}")
    return f"{slug}.webp"


def prepare_image(source: Path) -> Image.Image:
    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened)
        if image.mode in ("RGBA", "LA") or "transparency" in image.info:
            foreground = image.convert("RGBA")
            canvas = Image.new("RGBA", foreground.size, (*BACKGROUND, 255))
            canvas.alpha_composite(foreground)
            image = canvas.convert("RGB")
        else:
            image = image.convert("RGB")

    width, height = image.size
    side = max(width, height)
    if width != height:
        square = Image.new("RGB", (side, side), BACKGROUND)
        square.paste(image, ((side - width) // 2, (side - height) // 2))
        image = square

    return image.resize((1200, 1200), Image.Resampling.LANCZOS)


def encode_webp(image: Image.Image) -> tuple[bytes, int]:
    for quality in range(85, 0, -5):
        output = BytesIO()
        image.save(output, format="WEBP", quality=quality, method=6)
        content = output.getvalue()
        if len(content) < MAX_BYTES:
            return content, quality

    return content, quality


def main() -> int:
    if not SOURCE_DIR.is_dir():
        print(f"Input folder not found: {SOURCE_DIR}", file=sys.stderr)
        return 1

    sources = sorted(
        path
        for path in SOURCE_DIR.iterdir()
        if path.is_file() and path.suffix.lower() in {".png", ".jpg", ".jpeg"}
    )
    if not sources:
        print(f"No PNG or JPG images found in {SOURCE_DIR}", file=sys.stderr)
        return 1

    destinations = [output_name(source) for source in sources]
    if len(destinations) != len(set(destinations)):
        print("Input filenames produce duplicate output names; rename the inputs first.", file=sys.stderr)
        return 1

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    rows = []
    failures = []

    for source in sources:
        try:
            with Image.open(source) as opened:
                original_dimensions = opened.size
            image = prepare_image(source)
            content, quality = encode_webp(image)
            destination = OUTPUT_DIR / output_name(source)
            destination.write_bytes(content)
            status = f"OVER 200KB (quality {quality})" if len(content) >= MAX_BYTES else f"OK (quality {quality})"
            rows.append(
                (
                    source.name,
                    f"{original_dimensions[0]}x{original_dimensions[1]}",
                    f"{source.stat().st_size / 1024:.1f} KB",
                    "1200x1200",
                    f"{len(content) / 1024:.1f} KB",
                    status,
                )
            )
        except (OSError, ValueError) as error:
            failures.append(f"{source.name}: {error}")

    headers = ("Original file", "Original pixels", "Original size", "Output pixels", "Output size", "Result")
    widths = [
        max(len(headers[index]), *(len(row[index]) for row in rows))
        for index in range(len(headers))
    ]
    print(" | ".join(header.ljust(widths[index]) for index, header in enumerate(headers)))
    print("-+-".join("-" * width for width in widths))
    for row in rows:
        print(" | ".join(value.ljust(widths[index]) for index, value in enumerate(row)))

    if failures:
        print("\nImage processing failed:", file=sys.stderr)
        print("\n".join(failures), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
