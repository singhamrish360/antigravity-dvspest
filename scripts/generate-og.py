#!/usr/bin/env python3
"""Regenerate public/og-home.jpg and public/og-drawings.jpg eyebrow brand text."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OUTFIT = "/usr/share/fonts/truetype/sand-box/google/Outfit/Outfit-VariableFont_wght.ttf"
BG = (249, 248, 244)
ORANGE = (180, 83, 12)
# Eyebrow band from the original cards
BAND = (70, 268, 1100, 300)


def font(size: int, weight: int = 700) -> ImageFont.FreeTypeFont:
    face = ImageFont.truetype(OUTFIT, size)
    try:
        face.set_variation_by_axes([weight])
    except Exception:
        pass
    return face


def patch_eyebrow(src: Path, dest: Path, text: str) -> None:
    im = Image.open(src).convert("RGB")
    x0, y0, x1, y1 = BAND
    # Cover the old eyebrow with the card background (leave the rounded border alone)
    draw = ImageDraw.Draw(im)
    draw.rectangle([x0, y0, x1, y1], fill=BG)

    face = font(22, 700)
    # Match the original small-caps feel with slightly tracked uppercase
    label = text.upper()
    # Manual letter-spacing
    spacing = 1.6
    # Measure total width
    glyphs = list(label)
    widths = [face.getlength(ch) for ch in glyphs]
    total = sum(widths) + spacing * (len(glyphs) - 1)
    x = 82
    # Vertically center in the band using text bbox
    bbox = face.getbbox("H")
    text_h = bbox[3] - bbox[1]
    y = y0 + (y1 - y0 - text_h) // 2 - bbox[1] - 1
    # Draw with slight letter spacing
    cursor = x
    for ch, w in zip(glyphs, widths):
        draw.text((cursor, y), ch, font=face, fill=ORANGE)
        cursor += w + spacing

    # Subtle sharpen so the small type stays crisp at 1200px
    im = im.filter(ImageFilter.UnsharpMask(radius=0.6, percent=80, threshold=2))
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, "JPEG", quality=92, optimize=True, subsampling=0)
    print(f"wrote {dest.relative_to(ROOT)} ({dest.stat().st_size} bytes), text width {total:.0f}px")


def main() -> None:
    patch_eyebrow(
        PUBLIC / "og-home.jpg",
        PUBLIC / "og-home.jpg",
        "DVS Infra Consultant  ·  Lucknow",
    )
    patch_eyebrow(
        PUBLIC / "og-drawings.jpg",
        PUBLIC / "og-drawings.jpg",
        "DVS Infra Consultant  ·  Anywhere in India",
    )


if __name__ == "__main__":
    main()
