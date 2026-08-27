// Game Icons (https://game-icons.net) via Iconify's `game-icons` collection
// (@iconify-json/game-icons, CC BY 3.0 — see CREDITS.md), compiled at build
// time into plain React components by unplugin-icons — no icon font or
// runtime icon library shipped, just tree-shaken inline SVG per icon used.

import IconWizardStaff from '~icons/game-icons/wizard-staff'
import IconHolyGrail from '~icons/game-icons/holy-grail'
import IconCrossedSwords from '~icons/game-icons/crossed-swords'
import IconPentacle from '~icons/game-icons/pentacle'

import IconOpenBook from '~icons/game-icons/open-book'
import IconScrollUnfurled from '~icons/game-icons/scroll-unfurled'
import IconCrystalBall from '~icons/game-icons/crystal-ball'

import IconTarot00 from '~icons/game-icons/tarot-00-the-fool'
import IconTarot01 from '~icons/game-icons/tarot-01-the-magician'
import IconTarot02 from '~icons/game-icons/tarot-02-the-high-priestess'
import IconTarot03 from '~icons/game-icons/tarot-03-the-empress'
import IconTarot04 from '~icons/game-icons/tarot-04-the-emperor'
import IconTarot05 from '~icons/game-icons/tarot-05-the-hierophant'
import IconTarot06 from '~icons/game-icons/tarot-06-the-lovers'
import IconTarot07 from '~icons/game-icons/tarot-07-the-chariot'
import IconTarot08 from '~icons/game-icons/tarot-08-strength'
import IconTarot09 from '~icons/game-icons/tarot-09-the-hermit'
import IconTarot10 from '~icons/game-icons/tarot-10-wheel-of-fortune'
import IconTarot11 from '~icons/game-icons/tarot-11-justice'
import IconTarot12 from '~icons/game-icons/tarot-12-the-hanged-man'
import IconTarot13 from '~icons/game-icons/tarot-13-death'
import IconTarot14 from '~icons/game-icons/tarot-14-temperance'
import IconTarot15 from '~icons/game-icons/tarot-15-the-devil'
import IconTarot16 from '~icons/game-icons/tarot-16-the-tower'
import IconTarot17 from '~icons/game-icons/tarot-17-the-star'
import IconTarot18 from '~icons/game-icons/tarot-18-the-moon'
import IconTarot19 from '~icons/game-icons/tarot-19-the-sun'
import IconTarot20 from '~icons/game-icons/tarot-20-judgement'
import IconTarot21 from '~icons/game-icons/tarot-21-the-world'

export const SUIT_ICONS = {
  wands: IconWizardStaff,
  cups: IconHolyGrail,
  swords: IconCrossedSwords,
  pentacles: IconPentacle,
}

export const MAJOR_ARCANA_ICONS = {
  0: IconTarot00,
  1: IconTarot01,
  2: IconTarot02,
  3: IconTarot03,
  4: IconTarot04,
  5: IconTarot05,
  6: IconTarot06,
  7: IconTarot07,
  8: IconTarot08,
  9: IconTarot09,
  10: IconTarot10,
  11: IconTarot11,
  12: IconTarot12,
  13: IconTarot13,
  14: IconTarot14,
  15: IconTarot15,
  16: IconTarot16,
  17: IconTarot17,
  18: IconTarot18,
  19: IconTarot19,
  20: IconTarot20,
  21: IconTarot21,
}

export { IconOpenBook, IconScrollUnfurled, IconCrystalBall }

/** The major-arcana glyph for a major card, or the suit glyph for a minor/court card. */
export function getCardIcon(card) {
  return card.arcana === 'major' ? MAJOR_ARCANA_ICONS[card.number] : SUIT_ICONS[card.suit]
}
