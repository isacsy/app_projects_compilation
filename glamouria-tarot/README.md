# Glamouria Studio Tarot

A tarot learning companion for **Glamouria Studio** — a card reference
library for an original 78-card deck (illustrated in a dark, stained-glass
Art Nouveau style), plus, as later phases land, a structured system for
learning to read it. React + Vite + Tailwind CSS + React Router, with
progress/quiz state in `localStorage` (no backend yet).

## Status: Phase 1 & 2 of 4

- **Phase 1 — Scaffold.** Done. Routing, base layout, and the vintage
  design system (jewel-tone palette, Cinzel/Cormorant Garamond type,
  inline-SVG decorative components) with placeholder content.
- **Phase 2 — Content layer + Card Library.** Done. All 78 cards parsed
  from the reference book into structured data; a filterable card grid
  (arcana / suit / rank), card detail pages, and global search across
  names, keywords, and meanings.
- **Phase 3 — Learning system.** Not started: structured lessons, a
  flashcard/quiz mode with per-card mastery tracking, a daily card draw
  with saved history, and a visual spread guide (11 spreads are already
  parsed and ready in `src/data/spreads.json`, just not wired into a UI).
- **Phase 4 — Polish.** Not started: card-flip transitions, a full
  responsive/mobile pass beyond the current baseline, and an accessibility
  pass (contrast, keyboard nav, alt text).

## Setup

```
npm install
npm run dev       # start the dev server
npm run build     # production build
npm run lint      # oxlint
```

## Card art

Glamouria's own deck isn't illustrated yet, so every card currently shows
the public-domain 1909 Rider-Waite-Smith deck as placeholder art —
see `public/assets/cards/README.md` for the source and license. Any card
missing its own image file falls back to a generic branded card-back
(`src/components/card/CardBackPlaceholder.jsx`). To drop in real art for a
card, replace `public/assets/cards/{id}.jpg` (or add `{id}.png`; see `id`
values in `src/data/cards.json`, e.g. `major-00`, `wands-ace`,
`cups-king`) — no code changes needed, `CardImage` picks it up
automatically.

## Content data

`src/data/cards.json` and `src/data/spreads.json` are generated from the
reference book (`scripts/source/塔羅葵花寶典.md`) by
`scripts/parse_source.py`. **Read `src/data/README.md` before touching
either JSON file** — it documents several places where this data
deliberately deviates from the original build brief (Queens exist in the
source after all; several cards, mostly court cards, have no reversed
meaning because the source itself doesn't give one) and exactly how the
upright/reversed split was determined for cards where the source doesn't
mark it with a heading.
