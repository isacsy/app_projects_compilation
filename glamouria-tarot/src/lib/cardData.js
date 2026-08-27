import cardsJson from '../data/cards.json'
import spreadsJson from '../data/spreads.json'

/**
 * @typedef {Object} TarotCard
 * @property {string} id
 * @property {"major"|"minor"} arcana
 * @property {"wands"|"cups"|"swords"|"pentacles"} [suit]
 * @property {number|"ace"|"king"|"queen"|"knight"|"page"} [rank]
 * @property {number} [number]
 * @property {string} nameEn
 * @property {string} nameZh
 * @property {string[]} keywords
 * @property {string} imageDescription
 * @property {string} uprightMeaning
 * @property {string} reversedMeaning
 * @property {boolean} [partial]
 */

/** @type {TarotCard[]} */
export const cards = cardsJson

export const SUITS = ['wands', 'cups', 'swords', 'pentacles']

export const SUIT_LABELS = {
  wands: 'Wands',
  cups: 'Cups',
  swords: 'Swords',
  pentacles: 'Pentacles',
}

export const SUIT_NAME_ZH = {
  wands: '權杖',
  cups: '聖杯',
  swords: '寶劍',
  pentacles: '錢幣',
}

const RANK_ORDER = ['ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'page', 'knight', 'queen', 'king']

function rankSortValue(rank) {
  const idx = RANK_ORDER.indexOf(rank)
  return idx === -1 ? 99 : idx
}

function cardSortValue(card) {
  if (card.arcana === 'major') return [0, card.number]
  return [1 + SUITS.indexOf(card.suit), rankSortValue(card.rank)]
}

/** @type {TarotCard[]} */
export const sortedCards = [...cards].sort((a, b) => {
  const [aGroup, aRank] = cardSortValue(a)
  const [bGroup, bRank] = cardSortValue(b)
  return aGroup - bGroup || aRank - bRank
})

const byId = new Map(cards.map((c) => [c.id, c]))

/** @returns {TarotCard | undefined} */
export function getCardById(id) {
  return byId.get(id)
}

/** Title-cases a source card name for display without mutating the stored
 * data ("ACE of WANDS" -> "Ace of Wands"), since the source's raw casing
 * is inconsistent by design intent, not meaningful. */
export function displayNameEn(nameEn) {
  return nameEn
    .toLowerCase()
    .split(' ')
    .map((word) => (word === 'of' ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(' ')
}

export function rankLabel(card) {
  if (card.arcana === 'major') return `${card.number}`
  if (card.rank === 'ace') return 'Ace'
  if (typeof card.rank === 'number') return String(card.rank)
  return card.rank.charAt(0).toUpperCase() + card.rank.slice(1)
}

const SEARCH_INDEX = cards.map((card) => ({
  card,
  haystack: [
    card.nameEn,
    card.nameZh,
    ...card.keywords,
    card.uprightMeaning,
    card.reversedMeaning,
  ]
    .join(' ')
    .toLowerCase(),
}))

/** Simple case-insensitive substring search across names, keywords, and
 * meanings (not just the keywords array, so Major Arcana / court cards
 * with no tagged keywords are still findable). */
export function searchCards(query) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return SEARCH_INDEX.filter((entry) => entry.haystack.includes(q)).map((entry) => entry.card)
}

export const spreads = spreadsJson

export function getSpreadByName(name) {
  return spreads.find((s) => s.name === name)
}
