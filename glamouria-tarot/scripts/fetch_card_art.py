#!/usr/bin/env python3
"""
Populates public/assets/cards/{id}.jpg with placeholder card art: the
public-domain 1909 Rider-Waite-Smith deck, standing in until Glamouria's
own art is ready. See public/assets/cards/README.md for the full
provenance/license note and how to replace these with real art later.

This is a record of how the images were sourced, not a script meant to be
re-run casually -- it expects a local clone of the source repo (which
isn't vendored into this repo; the images it produces are committed
instead). To redo it:

    GIT_LFS_SKIP_SMUDGE=1 git clone --depth 1 \
        https://github.com/wicker/rider-waite-reader /tmp/rider-waite-reader
    python3 scripts/fetch_card_art.py /tmp/rider-waite-reader

Source: https://github.com/wicker/rider-waite-reader
  commit 564bdf31b77a715f357b6e6337d72bf8b343989d (2019-03-22)
  public/img/*.jpg -- only the image files are used here, not the app's
  GPL-3.0 code. The repo's own README states the images are the
  Rider-Waite-Smith deck "from sacred-tarot and are in the public
  domain," scanned by Holly Voley (the same widely-used PD-US scan set
  Wikimedia Commons hosts), crediting Arthur Edward Waite and Pamela
  Colman Smith as the deck's original 1909 authors.
"""

import sys
from pathlib import Path

from PIL import Image

SUIT_SLUG = {"wands": "wands", "cups": "cups", "swords": "swords", "pentacles": "pents"}
MINOR_RANK_NUMBER = {"ace": 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, "page": 11, "knight": 12, "queen": 13, "king": 14}

OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "assets" / "cards"


def major_source(src_root: Path, number: int) -> Path:
    matches = list((src_root / "public" / "img").glob(f"tarot-{number}-*.jpg"))
    if len(matches) != 1:
        raise SystemExit(f"expected exactly one match for major arcana {number}, got {matches}")
    return matches[0]


def minor_source(src_root: Path, suit: str, rank) -> Path:
    n = MINOR_RANK_NUMBER[rank]
    return src_root / "public" / "img" / f"{SUIT_SLUG[suit]}{n:02d}.jpg"


def convert(src: Path, dest: Path):
    # JPEG, not PNG: this is a photographic scan (not flat-color line art),
    # and re-saving 78 of them as PNG bloated the repo roughly 8x for no
    # visible quality gain. CardImage.jsx tries .jpg before .png, so this
    # is also the format a real full-bleed card scan/export (no
    # transparency needed) would most naturally use later.
    with Image.open(src) as im:
        im.convert("RGB").save(dest, "JPEG", quality=90, optimize=True)


def main():
    if len(sys.argv) != 2:
        raise SystemExit("usage: fetch_card_art.py <path to cloned rider-waite-reader repo root>")
    src_root = Path(sys.argv[1]) / "rider-waite-reader"
    if not src_root.exists():
        raise SystemExit(f"not found: {src_root}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    count = 0

    for number in range(22):
        convert(major_source(src_root, number), OUT_DIR / f"major-{number:02d}.jpg")
        count += 1

    for suit in SUIT_SLUG:
        for rank in ["ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "page", "knight", "queen", "king"]:
            convert(minor_source(src_root, suit, rank), OUT_DIR / f"{suit}-{rank}.jpg")
            count += 1

    print(f"wrote {count} card images to {OUT_DIR}")


if __name__ == "__main__":
    main()
