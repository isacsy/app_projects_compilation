# Credits

## Typefaces

- **Cinzel Decorative**, **Cinzel**, **Cormorant Garamond**, **EB Garamond**,
  **UnifrakturMaguntia** — Google Fonts, SIL Open Font License 1.1. Loaded
  via `<link>` in `index.html`; no files vendored in this repo.
  - Cinzel Decorative: display headings (`--font-display`).
  - Cinzel: nav/section/UI headings (`--font-heading`).
  - Cormorant Garamond: short UI copy, card names, keyword pills
    (`--font-body`).
  - EB Garamond: longer English prose — card meaning paragraphs, the
    homepage intro, section descriptions (`--font-prose`). Chosen over
    Cormorant Garamond for these specifically because it reads better at
    paragraph length; it only affects the Latin-script portions of the
    (mostly Chinese) card meaning text, since neither typeface has CJK
    glyphs and both fall back to the same system CJK face either way.
  - UnifrakturMaguntia: decorative accent only, on the drop-cap first
    letter of each card's English name on its detail page
    (`--font-blackletter`) — a full word or paragraph in blackletter
    is illegible at a glance, so it's deliberately confined to one glyph.

## Icons

- **Game Icons** (game-icons.net) via Iconify's `game-icons` collection
  (`@iconify-json/game-icons`), compiled at build time into plain React
  components with `unplugin-icons` — no icon font or runtime icon library
  is shipped, just the specific ~30 icons actually used, each as a
  tree-shaken inline SVG component (`src/components/icons/index.js`).
  **License: CC BY 3.0** — https://github.com/game-icons/icons/blob/master/license.txt.
  Author/attribution per the collection's own metadata: GameIcons
  (https://github.com/game-icons/icons). Icons used: `wizard-staff`,
  `holy-grail`, `crossed-swords`, `pentacle` (suit markers throughout the
  library/search/detail views), `open-book`, `scroll-unfurled`,
  `crystal-ball` (homepage section markers), and the 22
  `tarot-00-the-fool` … `tarot-21-the-world` glyphs (Major Arcana detail
  pages).

## Card art (placeholder)

All 78 card images in `public/assets/cards/` are the public-domain 1909
Rider-Waite-Smith deck (Arthur Edward Waite, deviser; Pamela Colman Smith,
artist; first published 1909), via
[wicker/rider-waite-reader](https://github.com/wicker/rider-waite-reader)
on GitHub (commit `564bdf3`), itself sourced from the widely-reused
Holly Voley PD-US scan set. Standing in until Glamouria's own deck art is
ready. Full provenance/license detail: `public/assets/cards/README.md`.

## Decorative elements — original, not sourced

Everything ornamental in the design system was hand-built for this project
as inline SVG/CSS rather than sourced from an external collection — there
was no need to source ornamental raster art given the brief's own
preference for inline SVG:

- `src/components/decorative/CornerFloret.jsx`, `OrnateFrame.jsx`,
  `Divider.jsx`, `MoonIcon.jsx`, `StarIcon.jsx`, `StainedGlassArch.jsx`
- `src/components/card/CardBackPlaceholder.jsx`
- `src/components/layout/Logomark.jsx`
- The aged-paper background grain in `src/index.css` (`body` rule) is a
  small procedural SVG noise filter (`feTurbulence`), not a photographed
  or sourced texture.

## On sourcing further assets from Wikimedia / Met / NYPL / Rawpixel / Openclipart / Poly Haven

This build environment's outbound network access is allowlisted, not
general-purpose: `github.com` and its raw-content/API subdomains work
(that's how the Rider-Waite-Smith scans above were fetched), as does
`fonts.googleapis.com`, but `commons.wikimedia.org`, `metmuseum.org`,
`nypl.org`, `rawpixel.com`, `openclipart.org`, and `polyhaven.com` all
returned policy-blocked connections when tested directly (verified, not
assumed). No assets have been sourced from any of them. See the
corresponding chat message for what to do next if real archival ornament
scans or a photographed parchment texture are wanted beyond what the
inline SVG/procedural approach above already provides.
