#!/usr/bin/env python3
"""
Parses scripts/source/塔羅葵花寶典.md (the reference book supplied for this
project) into the structured JSON consumed by src/data/. This is a one-time
/ re-run-when-the-source-changes conversion script, not part of the app
build.

Design notes (see README in src/data/ for the human-readable version):

- Major Arcana cards have a clean **牌面描述：** / **牌義推演：** /
  **逆位解析：** structure in the source, so those three fields are
  extracted automatically via header regex.
- Minor Arcana (pip) cards and Court cards do NOT have that structure in
  the source -- imagery and meaning run together as continuous prose, and
  the reversed-meaning discussion is introduced mid-paragraph rather than
  under its own heading. For these, this script extracts the *raw* prose
  block mechanically (byte-exact from source, zero transcription risk),
  and a hand-curated marker table (REVERSED_MARKERS / IMAGE_DESC_BOUNDS
  below) says *where* to cut it into upright/reversed -- each marker is a
  short literal substring copied from the source and verified by
  `.index()`, which raises loudly if a marker ever stops matching. Cards
  with no reversed discussion in the source at all (Cups Nine, Pentacles
  Nine, and most Court cards) are left with an empty reversedMeaning
  rather than inventing one.
- The source's own line-wrapping inserts spurious blank lines mid-sentence
  (an artifact of whatever conversion produced this .md). Non-empty lines
  within one field are rejoined with no separator, which is correct for
  Chinese prose (no inter-word spaces).
- Court cards: the source only gives King/Knight/Page their own "###"
  headings. Queen content for all four suits DOES exist in the source,
  but is embedded as run-on text at the end of the King's paragraph
  (marked "王后:（部分）" / "王後:（部分）") rather than under its own
  heading -- this looks like a lost markdown heading from whatever
  produced this .md, not a genuine absence. This script splits it out
  into its own card. Every court card entry in the source is itself
  labelled "（部分）" (partial) -- we carry that through as `partial: true`
  so the UI can flag these as abridged, rather than silently presenting
  them as complete.
"""

import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC_PATH = ROOT / "source" / "塔羅葵花寶典.md"
OUT_DIR = ROOT.parent / "src" / "data"

text = SRC_PATH.read_text(encoding="utf-8")

SUIT_ZH_TO_EN = {
    "權杖": "wands",
    "聖杯": "cups",
    "寶劍": "swords",
    "錢幣": "pentacles",
}
SUIT_EN_LABEL = {
    "wands": "Wands",
    "cups": "Cups",
    "swords": "Swords",
    "pentacles": "Pentacles",
}
ZH_NUMERAL = {"二": 2, "三": 3, "四": 4, "五": 5, "六": 6, "七": 7, "八": 8, "九": 9, "十": 10}


def clean_block(raw: str) -> str:
    """Rejoin a raw text block's non-empty lines with no separator (correct
    for Chinese, which uses no inter-word spaces), stripping stray markdown
    bold markers left over from inline labels."""
    lines = [ln.strip() for ln in raw.splitlines()]
    lines = [ln for ln in lines if ln]
    joined = "".join(lines)
    joined = joined.replace("**", "")
    return joined.strip()


def split_at(block: str, marker: str, card_id: str, label: str):
    """Split `block` at the first occurrence of `marker`, returning
    (before, marker+after). Raises if the marker isn't found, so a source
    edit or a typo in the marker table fails loudly instead of silently
    mis-splitting."""
    idx = block.find(marker)
    if idx == -1:
        raise ValueError(f"[{card_id}] {label} marker not found: {marker!r}")
    return block[:idx].strip(), block[idx:].strip()


# ---------------------------------------------------------------------------
# 1. Major Arcana (22 cards) -- fully automatic, clean source structure.
# ---------------------------------------------------------------------------

major_section = text.split("# 一、大牌牌意", 1)[1].split("# 二、數字牌牌意", 1)[0]
major_chunks = re.split(r"(?m)^## (?=\d+ )", major_section)[1:]

MAJOR_HEADING_RE = re.compile(r"^(\d+)\s+(.+?)\s+([一-鿿]+)\s*$")

major_cards = []
for chunk in major_chunks:
    lines = chunk.strip("\n").split("\n")
    heading, body = lines[0], "\n".join(lines[1:])
    m = MAJOR_HEADING_RE.match(heading.strip())
    if not m:
        raise ValueError(f"Unrecognized major arcana heading: {heading!r}")
    number, name_en, name_zh = int(m.group(1)), m.group(2).strip(), m.group(3).strip()
    card_id = f"major-{number:02d}"

    parts = re.split(r"\*\*(牌面描述|牌義推演|逆位解析)：\*\*", body)
    # parts = ['', '牌面描述', text, '牌義推演', text, '逆位解析', text, ...footnotes]
    sections = {}
    i = 1
    while i < len(parts) - 1:
        label, content = parts[i], parts[i + 1]
        sections[label] = content
        i += 2
    for required in ("牌面描述", "牌義推演", "逆位解析"):
        if required not in sections:
            raise ValueError(f"[{card_id}] missing section {required}")

    # Any text after the last recognized section (footnotes, e.g. "注１：")
    # belongs with 逆位解析 in the source's reading order; re.split already
    # keeps it appended to sections["逆位解析"] since footnotes follow it.

    major_cards.append(
        {
            "id": card_id,
            "arcana": "major",
            "number": number,
            "nameEn": name_en,
            "nameZh": name_zh,
            "keywords": [],
            "imageDescription": clean_block(sections["牌面描述"]),
            "uprightMeaning": clean_block(sections["牌義推演"]),
            "reversedMeaning": clean_block(sections["逆位解析"]),
        }
    )

assert len(major_cards) == 22, f"expected 22 major arcana, got {len(major_cards)}"

# ---------------------------------------------------------------------------
# 2. Minor Arcana pip cards (40 cards: Ace-10 x 4 suits)
# ---------------------------------------------------------------------------

minor_section = text.split("# 二、數字牌牌意", 1)[1].split("# 三、宮廷牌牌義", 1)[0]

HEADING_RE = re.compile(r"^###\s+(.+)$")

REVERSED_MARKERS = {
    "wands-ace": "權杖一逆位表示",
    "wands-2": "權杖二逆位，領主",
    "wands-3": "權杖三逆位，可能表示",
    "wands-4": "權杖四逆位，偉特書中",
    "wands-5": "逆位的時候就不一定了",
    "wands-6": "權杖六逆位的意義，第一",
    "wands-7": "權杖七逆位，原本站在",
    "wands-8": "逆位的權杖八有兩種可能",
    "wands-9": "權杖九逆位時，當事人可能失去",
    "wands-10": "權杖十逆位，傳統上",
    "cups-ace": "聖杯 Ace 逆位，杯中的水",
    "cups-2": "聖杯二逆位，表示在結合的過程中出現問題",
    "cups-3": "聖杯三逆位。表示",
    "cups-4": "聖杯四逆位時與寶劍四類似",
    "cups-5": "（逆位的聖杯五一般常見的解法",
    "cups-6": "聖杯六逆位，童年的美好回憶不再",
    "cups-7": "聖杯七逆位，雲霧即將散開",
    "cups-8": "聖杯八逆位可以有很多種解釋",
    # cups-9: no reversed meaning given in the source -- left empty.
    "cups-10": "聖杯十逆位，代表情感團體",
    "swords-ace": "逆位的時候，可能表示外傷",
    "swords-2": "寶劍二逆位，代表當事人較能做出決定",
    "swords-3": "逆位置仍然具有正位的意義",
    "swords-4": "（逆位置的寶劍四比正位置的積極",
    "swords-5": "寶劍五逆位的意義與正位類似",
    "swords-6": "寶劍六逆位，洶湧的水就跑到上頭了",
    "swords-7": "偉特給寶劍七逆位的解釋為",
    "swords-8": "寶劍八逆位，女子開始察覺自己的無知",
    "swords-9": "寶劍九的癥結在於當事人看不到希望存在，逆位時",
    "swords-10": "寶劍十逆位，偉特詮釋為",
    "pentacles-ace": "錢幣 Ace 逆位，表示財務上的決策可能失利",
    "pentacles-2": "錢幣二逆位，好象船在浪潮中翻覆",
    "pentacles-3": "錢幣三逆位可能是工作上出現問題",
    "pentacles-4": "逆位置的錢幣四突顯控制、支配與佔有的一面",
    "pentacles-5": "偉特的書中寫道：逆位置的錢幣五代表",
    "pentacles-6": "錢幣六逆位，商人變得小氣",
    "pentacles-7": "錢幣七逆位，事情通常無法順利進行",
    "pentacles-8": "錢幣八逆位，工匠失去原有的美德",
    # pentacles-9: no reversed meaning given in the source -- left empty.
    "pentacles-10": "當錢幣十逆位，可能代表財務方面的問題",
}

minor_cards = []
for suit_zh, suit_en in SUIT_ZH_TO_EN.items():
    suit_marker = f"## {suit_zh}牌組"
    start = minor_section.index(suit_marker) + len(suit_marker)
    end_markers = [f"## {z}牌組" for z in SUIT_ZH_TO_EN if z != suit_zh]
    end = len(minor_section)
    for em in end_markers:
        pos = minor_section.find(em, start)
        if pos != -1:
            end = min(end, pos)
    suit_block = minor_section[start:end]

    card_chunks = re.split(r"(?m)^### ", suit_block)[1:]
    for chunk in card_chunks:
        lines = chunk.strip("\n").split("\n")
        heading = lines[0].strip()
        body_lines = lines[1:]

        # Heading looks like: "權杖 ACE——ACE of WANDS-----新行動" or
        # "錢幣四----FOUR of PENTACLES----獲利 控制 佔有"
        pieces = [p.strip() for p in re.split(r"[—\-]{2,}", heading) if p.strip()]
        name_zh_raw, name_en = pieces[0], pieces[1]
        heading_keywords = pieces[2] if len(pieces) > 2 else ""

        # Two headings (Cups Nine, Pentacles Nine) mark themselves partial
        # right in the trailing keyword text, e.g. "...滿足（部分）" -- this
        # is the source's own explanation for why those two have no
        # reversed-meaning discussion at all.
        is_partial = "（部分）" in heading_keywords or "(部分)" in heading_keywords
        heading_keywords = heading_keywords.replace("（部分）", "").replace("(部分)", "").strip()

        rank_token = name_zh_raw.replace(suit_zh, "").strip()
        if rank_token.lower() in ("ace",):
            rank = "ace"
        elif rank_token in ZH_NUMERAL:
            rank = ZH_NUMERAL[rank_token]
        else:
            raise ValueError(f"Unrecognized rank {rank_token!r} in heading {heading!r}")

        card_id = f"{suit_en}-{rank}"
        name_zh = f"{suit_zh}{'ACE' if rank == 'ace' else rank_token}"

        # Keyword lines: short non-empty lines before the first long
        # (prose) line.
        keywords = [k for k in heading_keywords.split() if k]
        idx = 0
        while idx < len(body_lines):
            line = body_lines[idx].strip()
            if not line:
                idx += 1
                continue
            if len(line) <= 12:
                keywords.extend(line.split())
                idx += 1
            else:
                break
        prose_raw = "\n".join(body_lines[idx:])
        prose = clean_block(prose_raw)

        marker = REVERSED_MARKERS.get(card_id)
        if marker:
            upright, reversed_ = split_at(prose, marker, card_id, "reversed")
        else:
            upright, reversed_ = prose, ""

        card = {
            "id": card_id,
            "arcana": "minor",
            "suit": suit_en,
            "rank": rank,
            "nameEn": name_en,
            "nameZh": name_zh,
            "keywords": keywords,
            "imageDescription": "",
            "uprightMeaning": upright,
            "reversedMeaning": reversed_,
        }
        if is_partial:
            card["partial"] = True
        minor_cards.append(card)

assert len(minor_cards) == 40, f"expected 40 minor arcana, got {len(minor_cards)}"

# ---------------------------------------------------------------------------
# 3. Court cards (16 cards: King/Queen/Knight/Page x 4 suits)
# ---------------------------------------------------------------------------

court_section = text.split("# 三、宮廷牌牌義", 1)[1].split("經典牌陣", 1)[0]
court_chunks = re.split(r"(?m)^### ", court_section)[1:]

RANK_ZH_TO_EN = {"國王": "king", "騎士": "knight", "侍者": "page", "待者": "page"}

# For the 4 court cards that DO carry an explicit **牌面描述：** header, the
# text from just after that header up to this literal marker is the image
# description; the marker itself starts the meaning prose.
IMAGE_DESC_END_MARKER = {
    "cups-king": "無論對於家庭",
    "cups-knight": "人物：聖杯騎士是最浪漫的情人",
    "pentacles-king": "錢幣國王是成功的經營管理者",
    "pentacles-knight": "人物:錢幣騎士是四位騎士中行動最持重",
}

# Queen content is embedded as run-on text inside the King's chunk in the
# source, introduced by one of these labels (spelling of 後/后 is
# inconsistent in the source, so both are listed).
QUEEN_LABELS = {
    "wands": "權杖王後:",
    "cups": "聖杯王後:",
    "swords": "寶劍王後:",
    "pentacles": "錢幣王後:",
}

COURT_REVERSED_MARKERS = {
    "cups-knight": "逆位解析：逆位的聖杯騎士是個花心大蘿蔔",
    "pentacles-knight": "逆位解析:錢幣騎士逆位元通常有兩種情況",
}


def strip_partial_tag(s: str) -> str:
    return s.replace("（部分）", "").replace("(部分)", "").strip()


raw_court = {}  # id (e.g. "wands-king") -> raw body text
for chunk in court_chunks:
    lines = chunk.strip("\n").split("\n")
    heading = lines[0].strip()
    body = "\n".join(lines[1:])

    m = re.match(r"^([一-鿿]+)(國王|騎士|侍者|待者)[:：]\s*（?部分）?", heading)
    if not m:
        raise ValueError(f"Unrecognized court heading: {heading!r}")
    suit_zh, rank_zh = m.group(1), m.group(2)
    suit_en = SUIT_ZH_TO_EN[suit_zh]
    rank_en = RANK_ZH_TO_EN[rank_zh]
    raw_court[f"{suit_en}-{rank_en}"] = body

assert len(raw_court) == 12, f"expected 12 raw court headings, got {len(raw_court)}"

court_cards = []
for suit_zh, suit_en in SUIT_ZH_TO_EN.items():
    king_id = f"{suit_en}-king"
    king_body = raw_court[king_id]

    queen_label = QUEEN_LABELS[suit_en]
    king_text, queen_text = split_at(king_body, queen_label, king_id, "queen split")
    queen_text = strip_partial_tag(queen_text[len(queen_label):].strip())

    for rank_en, rank_zh, body in [
        ("king", "國王", king_text),
        ("queen", "王后", queen_text),
        ("knight", "騎士", raw_court[f"{suit_en}-knight"]),
        ("page", "侍者", raw_court[f"{suit_en}-page"]),
    ]:
        card_id = f"{suit_en}-{rank_en}"
        image_description = ""

        if rank_en != "queen" and "**牌面描述：**" in body:
            after_header = body.split("**牌面描述：**", 1)[1]
            end_marker = IMAGE_DESC_END_MARKER[card_id]
            img_raw, rest_raw = split_at(after_header, end_marker, card_id, "image description")
            image_description = clean_block(img_raw)
            prose = clean_block(rest_raw)
        else:
            prose = clean_block(body)

        reversed_marker = COURT_REVERSED_MARKERS.get(card_id)
        if reversed_marker:
            upright, reversed_ = split_at(prose, reversed_marker, card_id, "reversed")
        else:
            upright, reversed_ = prose, ""

        court_cards.append(
            {
                "id": card_id,
                "arcana": "minor",
                "suit": suit_en,
                "rank": rank_en,
                "nameEn": f"{RANK_ZH_TO_EN[rank_zh] if False else rank_en.capitalize()} of {SUIT_EN_LABEL[suit_en]}",
                "nameZh": f"{suit_zh}{rank_zh if rank_en != 'queen' else '王后'}",
                "keywords": [],
                "imageDescription": image_description,
                "uprightMeaning": upright,
                "reversedMeaning": reversed_,
                "partial": True,
            }
        )

assert len(court_cards) == 16, f"expected 16 court cards, got {len(court_cards)}"

# ---------------------------------------------------------------------------
# 4. Spreads
# ---------------------------------------------------------------------------

spreads_section = text.split("經典牌陣", 1)[1]
spread_chunks = re.split(r"(?m)^## ", spreads_section)[1:]

# Position lines look like "１過去； ２現在；３未來" or use full-width
# digits/parens; this pulls out each "N label" pair regardless of the
# separator punctuation used between them.
POSITION_RE = re.compile(r"[１-９1-9１0-9]+\s*([^\d１-９;；。\n]{1,40}?)(?=[；;。]|[０-９0-9]|$)")
FULLWIDTH_DIGITS = "０１２３４５６７８９"


def to_ascii_digits(s: str) -> str:
    return s.translate(str.maketrans(FULLWIDTH_DIGITS, "0123456789"))


# The source states each spread's positions in wildly inconsistent
# formats -- numeral+colon+meaning, bare numeral+label, lettered A/B
# tracks, even an unlabelled "(a)...(b)..." sub-position -- run together
# with the surrounding prose and with incidental numbers elsewhere in the
# text (e.g. "78 張牌"). A general regex risks false-splitting on those
# incidental numbers, so positions are hand-transcribed per spread here
# (each label/meaning copied verbatim from the source, verified against it
# above) rather than parsed automatically. `description` above already
# holds the full mechanically-extracted prose as a fallback/cross-check.
SPREAD_POSITIONS = {
    "時間之流(時間型)": [
        {"number": "1", "label": "過去", "meaning": ""},
        {"number": "2", "label": "現在", "meaning": ""},
        {"number": "3", "label": "未來", "meaning": ""},
    ],
    "週曆/月曆/年曆(時間型)": [],
    "身心靈": [
        {"number": "1", "label": "身", "meaning": "包括健康狀況、直覺、本能、最原始的反應"},
        {"number": "2", "label": "心", "meaning": "心理狀態、思考方式、理性面"},
        {"number": "3", "label": "靈", "meaning": "理想、目標"},
    ],
    "四要素": [
        {"number": "1", "label": "火要素", "meaning": "目標，行動"},
        {"number": "2", "label": "土要素", "meaning": "物質面，金錢，健康"},
        {"number": "3", "label": "風要素", "meaning": "傷害（另一版本為思考）"},
        {"number": "4", "label": "水要素", "meaning": "感情，人際關係"},
    ],
    "賽爾特十字": [
        {"number": "1", "label": "問題中心", "meaning": "呈現出問題的本質與核心"},
        {"number": "2", "label": "阻力或助力", "meaning": "如果是好牌，表示對問題有幫助的助力；反之則為阻力。"},
        {"number": "3", "label": "", "meaning": "(a)當事人的理想目標 (b)在目前情況下能達到的最理想結果"},
        {"number": "4", "label": "基礎", "meaning": "已經存在的基礎"},
        {"number": "5", "label": "過去", "meaning": "即將過去的影響"},
        {"number": "6", "label": "未來", "meaning": "即將發生的事件"},
        {"number": "7", "label": "態度", "meaning": "顯示當事人對此事的態度"},
        {"number": "8", "label": "環境", "meaning": "對問題造成影響的外在因素"},
        {"number": "9", "label": "希望或恐懼", "meaning": "當事人對此事的希望或恐懼"},
        {"number": "10", "label": "結果", "meaning": "在前面九張牌的影響之下所得到的結果"},
    ],
    "二擇一": [
        {"number": "1", "label": "問蔔者的心態", "meaning": ""},
        {"number": "2", "label": "Ａ選項的過程", "meaning": "或Ａ方的心態"},
        {"number": "3", "label": "Ｂ選項的過程", "meaning": "或Ｂ方的心態"},
        {"number": "4", "label": "Ａ選項的結果", "meaning": ""},
        {"number": "5", "label": "Ｂ選項的結果", "meaning": ""},
    ],
    "感情牌陣": [
        {"number": "1", "label": "問蔔者的心態", "meaning": ""},
        {"number": "2", "label": "對方的心態", "meaning": ""},
        {"number": "3", "label": "目前狀況", "meaning": ""},
        {"number": "4", "label": "未來發展", "meaning": ""},
    ],
    "安琪拉": [
        {"number": "A1", "label": "Ａ方所付出的", "meaning": ""},
        {"number": "B1", "label": "Ｂ方所付出的", "meaning": ""},
        {"number": "A2", "label": "Ａ方的自我", "meaning": ""},
        {"number": "B2", "label": "Ｂ方的自我", "meaning": ""},
        {"number": "A3", "label": "Ａ方所得到的", "meaning": ""},
        {"number": "B3", "label": "Ｂ方所得到的", "meaning": ""},
        {"number": "A4", "label": "Ａ所渴望的", "meaning": ""},
        {"number": "B4", "label": "Ｂ所渴望的", "meaning": ""},
    ],
    "一見鍾情": [
        {"number": "1", "label": "我對他的印象", "meaning": ""},
        {"number": "2", "label": "他對我的印象", "meaning": ""},
        {"number": "3", "label": "關係發展的可能性", "meaning": ""},
    ],
    "人際關係簡易牌陣": [
        {"number": "1", "label": "我對這個關係帶來什麼貢獻？", "meaning": ""},
        {"number": "2", "label": "他對這個關係帶來什麼貢獻？", "meaning": ""},
        {"number": "3", "label": "雙方的貢獻結合形成什麼情況？", "meaning": ""},
    ],
    "新狀況": [
        {"number": "1", "label": "新的狀況會是什麼樣子？", "meaning": "這個位置讓你對新的狀況有基本的瞭解"},
        {"number": "2", "label": "挑戰", "meaning": "可能必須面對的挑戰，如果是很好的牌，表示挑戰將不會太困難"},
        {"number": "3", "label": "對策", "meaning": "面對挑戰可採取的最佳對策"},
    ],
}

spreads = []
for chunk in spread_chunks:
    lines = chunk.strip("\n").split("\n")
    name = lines[0].strip()
    body = "\n".join(lines[1:]).strip()
    if name not in SPREAD_POSITIONS:
        raise ValueError(f"No hand-transcribed positions for spread {name!r}")
    spreads.append(
        {
            "name": name,
            "description": clean_block(body),
            "positions": SPREAD_POSITIONS[name],
        }
    )

def drop_orphan_trailing_paren(t: str) -> str:
    """A handful of minor-arcana cards nest their reversed-meaning
    discussion inside a parenthetical that *opens* in the upright half
    (before our split point) and closes in the reversed half (after it) --
    splitting there is still the right call (it keeps the actual sentence
    that starts the reversed discussion together), but it leaves a lone
    trailing "）" with no partner. Strip just that harmless orphan."""
    if t.endswith("）") and t.count("（") < t.count("）"):
        return t[:-1].rstrip()
    return t


# ---------------------------------------------------------------------------
# Write output
# ---------------------------------------------------------------------------

OUT_DIR.mkdir(parents=True, exist_ok=True)
all_cards = major_cards + minor_cards + court_cards
for c in all_cards:
    c["reversedMeaning"] = drop_orphan_trailing_paren(c["reversedMeaning"])
(OUT_DIR / "cards.json").write_text(
    json.dumps(all_cards, ensure_ascii=False, indent=2), encoding="utf-8"
)
(OUT_DIR / "spreads.json").write_text(
    json.dumps(spreads, ensure_ascii=False, indent=2), encoding="utf-8"
)

print(f"major: {len(major_cards)}  minor: {len(minor_cards)}  court: {len(court_cards)}  total: {len(all_cards)}")
print(f"spreads: {len(spreads)}")

empty_reversed = [c["id"] for c in all_cards if not c["reversedMeaning"]]
print(f"cards with no reversed meaning in source ({len(empty_reversed)}): {empty_reversed}")

empty_upright = [c["id"] for c in all_cards if not c["uprightMeaning"]]
print(f"cards with EMPTY upright meaning (should be none): {empty_upright}")
