# Credits

## Typefaces

- **Cinzel Decorative**, **Cinzel**, **Cormorant Garamond** — Google Fonts,
  SIL Open Font License 1.1. Loaded via `<link>` in `index.html`; no files
  vendored in this repo.

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

## On sourcing further assets from Wikimedia / Met / NYPL / Rawpixel /
## Openclipart / Poly Haven

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
