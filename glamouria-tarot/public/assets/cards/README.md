# Card art

These 78 images are **placeholder art**, not Glamouria's own deck — Isabel
hasn't finished illustrating it yet. They're the public-domain 1909
Rider-Waite-Smith tarot (the deck the reference book's own descriptions and
meanings are written against — `major-00.jpg` through `pentacles-king.jpg`
match the "偉特" imagery the card text describes), standing in so the site
looks and reads as a finished deck in the meantime.

## Provenance & license

Scans from [wicker/rider-waite-reader](https://github.com/wicker/rider-waite-reader)
(`public/img/*.jpg`, commit `564bdf3`), whose README states these are the
Rider-Waite-Smith deck "from sacred-tarot and are in the public domain,"
scanned by Holly Voley — the same widely-reused PD-US scan set held on
Wikimedia Commons. Original authorship: Arthur Edward Waite (deviser,
d. 1942) and Pamela Colman Smith (artist, d. 1951); first published 1909.
Public domain in the US (published pre-1929) and, Smith's death having been
70+ years ago, in life-plus-70 jurisdictions too. Only the image files were
used — nothing from that repo's own (GPL-3.0) application code is here.
`scripts/fetch_card_art.py` in this repo documents exactly how these were
converted (JPEG re-encode, filename mapping) and how to redo it.

## Replacing these with real art

Each file is named for the matching card's `id` in `src/data/cards.json`
(e.g. `major-00` = The Fool, `wands-ace`, `cups-king`). `CardImage` looks
for `{id}.jpg` first, then `{id}.png`, before falling back to the drawn
placeholder — so to swap in real Glamouria art for a card, just replace
`{id}.jpg`, or add an `{id}.png` if the new art needs transparency; no code
changes needed either way. You don't have to do this all at once: any card
without its own file just keeps showing this placeholder art.
