# Card & spread data

`cards.json` (78 cards) and `spreads.json` (11 spreads) are generated from
`scripts/source/塔羅葵花寶典.md` — the reference book supplied for this
project — by `scripts/parse_source.py`. Don't hand-edit the JSON; if the
source file changes, edit the parser (and its marker tables) and re-run:

```
python3 scripts/parse_source.py
```

## Card shape

```
{
  id: string            // "major-00", "wands-ace", "wands-2", "cups-king"
  arcana: "major" | "minor"
  suit?: "wands" | "cups" | "swords" | "pentacles"   // minor only
  rank?: number | "ace" | "king" | "queen" | "knight" | "page"
  number?: number        // major only, 0-21
  nameEn: string
  nameZh: string
  keywords: string[]      // [] where the source gives none (all Major Arcana, all court cards)
  imageDescription: string  // "" where the source doesn't separate imagery from meaning
  uprightMeaning: string
  reversedMeaning: string   // "" where the source gives no reversed reading at all
  partial?: true          // the source itself marks this entry abridged (see below)
}
```

## Where this deviates from the original brief, and why

**Queens exist.** The brief assumed court cards only have King/Knight/Page
("there is no Queen"). The source actually contains Queen material for all
four suits — it's just not under its own heading. It runs on as the tail of
the King's paragraph, introduced by a label like `權杖王後:（部分）` /
`聖杯王後:（部分）` right in the middle of the text. That reads like a lost
markdown heading in whatever produced this .md, not a genuine absence, so
the parser splits it into its own card (`wands-queen`, etc.) rather than
leaving a placeholder. All 78 standard cards are present.

**Not every card has a reversed meaning**, and that's from the source, not
a parsing gap:
- `cups-9` and `pentacles-9` are explicitly marked `（部分）` ("partial") in
  their own heading in the source, right where the other Nines' extra
  keyword would be. Both are missing a 逆位 (reversed) discussion entirely.
- All 16 court cards are headed `:（部分）` in the source — the whole
  section is explicitly abridged. Only Cups Knight and Pentacles Knight
  happen to include an explicit `逆位解析：` passage; the other 14 have no
  reversed reading in the source at all.

These 16 cards carry `"partial": true`; the UI shows a small note on them
rather than inventing the missing half.

**Major Arcana cards cleanly separate imagery from meaning** (`**牌面描述：**`
/ `**牌義推演：**` / `**逆位解析：**` headers in the source), so all three
fields are populated for all 22. **Minor Arcana and court cards don't** —
imagery and meaning run together as continuous prose in the source, so
`imageDescription` is `""` for all of them except four court cards (Cups
King, Cups Knight, Pentacles King, Pentacles Knight) that happen to carry
an explicit `**牌面描述：**` header of their own.

**Reversed-meaning boundaries are hand-marked, not regex-guessed.** Outside
Major Arcana, the source never puts reversed meaning under its own heading
— it's introduced mid-paragraph (`"...逆位，"` or similar), sometimes nested
inside a trailing parenthetical aside that also contains extra upright
commentary. `parse_source.py`'s `REVERSED_MARKERS` table gives the exact
substring where each card's reversed discussion begins, copied from the
source and verified with `.index()` (which raises if a marker ever stops
matching, e.g. after a source edit). Everything before that point is
`uprightMeaning`; everything from it onward is `reversedMeaning`. A few
cards (noted in the script) end up with one harmless orphaned full-width
parenthesis where a source aside spans the split point — cosmetic only, no
content is dropped or altered.

**Keywords** only exist in the source for Minor Arcana pip cards (short
tag lines like `創造 機會` / `靈感` right after the heading). Major Arcana
and court cards get `keywords: []` rather than an invented tag list —
search still matches against names and meaning text, not just this array.

**Content stays in Chinese.** Per the brief, `nameZh` and all meaning text
are kept exactly as sourced; only UI chrome (nav, buttons, section labels)
is in English. `nameEn` values are the source's card titles verbatim
(e.g. `"ACE of WANDS"`); the UI applies display-only title-casing rather
than mutating the stored string.

## Spread shape

```
{
  name: string
  description: string    // full prose, mechanically extracted
  positions: [{ number: string, label: string, meaning: string }]
}
```

Position lists are hand-transcribed (not regex-parsed) because the source
uses a different layout for almost every spread — numeral+colon+meaning,
bare numeral+label, lettered A/B tracks (安琪拉), even one unlabelled
`(a)/(b)` sub-position inside the Celtic Cross's third position. A blind
regex sweep risks false-matching incidental numbers elsewhere in the prose
(e.g. "78 張牌"), so each spread's `positions` array was typed from the
source directly and cross-checked against the mechanically-extracted
`description` field. `週曆/月曆/年曆` has no fixed positions in the source
(it's a technique — draw N cards for N days/months — not a named layout),
so its `positions` array is empty; `description` explains it.
