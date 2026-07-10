#!/usr/bin/env python3
"""
Refreshes just the `mote` entry in src/game/render/pickupRaster.ts with the
"Light Mote" crystal from the user's AFTERLIGHT flash-sheet delivery, for
visual consistency with the new boss/commander/badge art (dark backdrop,
stripped via tools/_bgremove.strip_dark_background). Every other pickup in
that file is left untouched — this does a targeted regex replace of the
`mote:` block rather than regenerating the whole file.

Usage: python3 tools/lightMoteIcon.py   (from the repo root; needs Pillow,
numpy, scipy)
"""
import base64
import io
import re
import sys
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _bgremove import strip_dark_background

SHEET = Path("/root/.claude/uploads/8d4c5166-d731-5037-83be-9215c8d1b4be/37ca749c-022A116A12694D94BFB36014F94D1BAC.png")
TARGET = Path(__file__).resolve().parent.parent / "src/game/render/pickupRaster.ts"


def extract_light_mote():
    im = Image.open(SHEET).convert("RGBA")
    cell = im.crop((15, 105, 155, 225))
    cell = strip_dark_background(cell)
    bbox = cell.split()[-1].getbbox()
    pad = 4
    x0, y0, x1, y1 = bbox
    x0, y0 = max(0, x0 - pad), max(0, y0 - pad)
    x1, y1 = min(cell.width, x1 + pad), min(cell.height, y1 + pad)
    return cell.crop((x0, y0, x1, y1))


def to_webp_datauri(im, target_long_edge, quality=90):
    w, h = im.size
    scale = target_long_edge / max(w, h)
    im = im.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, format="WEBP", quality=quality, method=6)
    return "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode("ascii")


def main():
    uri = to_webp_datauri(extract_light_mote(), 96)
    text = TARGET.read_text()
    new_block = f'  mote:\n    "{uri}",'
    updated, n = re.subn(r"  mote:\n {4}\"data:image/webp;base64,[^\"]*\",", new_block, text, count=1)
    if n != 1:
        raise SystemExit("Expected exactly one `mote:` entry in pickupRaster.ts, found " + str(n))
    TARGET.write_text(updated)
    print(f"Updated {TARGET} ({TARGET.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
