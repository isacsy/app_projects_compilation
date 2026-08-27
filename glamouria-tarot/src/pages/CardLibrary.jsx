import { useSearchParams } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import CardGrid from '../components/card/CardGrid'
import { Divider } from '../components/decorative'
import { sortedCards, SUITS, SUIT_LABELS } from '../lib/cardData'
import { SUIT_ICONS } from '../components/icons'

const MAJOR_RANKS = Array.from({ length: 22 }, (_, i) => String(i))
const MINOR_RANKS = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'page', 'knight', 'queen', 'king']

function segButtonStyle(active) {
  return {
    fontFamily: 'var(--font-heading)',
    color: active ? 'var(--color-ivory)' : 'var(--color-ink-soft)',
    background: active ? 'var(--color-emerald-deep)' : 'transparent',
    borderColor: 'var(--color-gold-deep)',
  }
}

export default function CardLibrary() {
  const [params, setParams] = useSearchParams()
  const arcana = params.get('arcana') || 'all'
  const suit = params.get('suit') || 'all'
  const rank = params.get('rank') || 'all'

  function update(next) {
    const merged = { arcana, suit, rank, ...next }
    const p = new URLSearchParams()
    if (merged.arcana !== 'all') p.set('arcana', merged.arcana)
    if (merged.suit !== 'all') p.set('suit', merged.suit)
    if (merged.rank !== 'all') p.set('rank', merged.rank)
    setParams(p, { replace: true })
  }

  const filtered = sortedCards.filter((card) => {
    if (arcana !== 'all' && card.arcana !== arcana) return false
    if (suit !== 'all' && card.suit !== suit) return false
    if (rank !== 'all') {
      const cardRank = card.arcana === 'major' ? String(card.number) : String(card.rank)
      if (cardRank !== rank) return false
    }
    return true
  })

  const rankOptions = arcana === 'major' ? MAJOR_RANKS : arcana === 'minor' ? MINOR_RANKS : null

  return (
    <PageShell>
      <h1
        className="text-3xl sm:text-4xl"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-emerald-deep)' }}
      >
        Card Library
      </h1>
      <p className="mt-2 max-w-2xl" style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-prose)' }}>
        All 78 cards of the Glamouria deck. Filter by arcana, suit, or rank, or use the search in the
        header to look up a card by name or keyword.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--color-gold-deep)', fontFamily: 'var(--font-heading)' }}>
          Arcana
        </span>
        {['all', 'major', 'minor'].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => update({ arcana: value, suit: value === 'major' ? 'all' : suit, rank: 'all' })}
            className="rounded-sm border px-3 py-1 text-xs uppercase tracking-wider"
            style={segButtonStyle(arcana === value)}
          >
            {value === 'all' ? 'All' : value}
          </button>
        ))}

        {arcana !== 'major' && (
          <>
            <span className="ml-3 text-xs uppercase tracking-widest" style={{ color: 'var(--color-gold-deep)', fontFamily: 'var(--font-heading)' }}>
              Suit
            </span>
            <button
              type="button"
              onClick={() => update({ suit: 'all', arcana: arcana === 'all' ? 'all' : 'minor', rank: 'all' })}
              className="rounded-sm border px-3 py-1 text-xs uppercase tracking-wider"
              style={segButtonStyle(suit === 'all')}
            >
              All
            </button>
            {SUITS.map((s) => {
              const SuitIcon = SUIT_ICONS[s]
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => update({ suit: s, arcana: 'minor', rank: 'all' })}
                  className="flex items-center gap-1.5 rounded-sm border px-3 py-1 text-xs uppercase tracking-wider"
                  style={segButtonStyle(suit === s)}
                >
                  <SuitIcon aria-hidden="true" className="h-3.5 w-3.5" />
                  {SUIT_LABELS[s]}
                </button>
              )
            })}
          </>
        )}

        {rankOptions && (
          <>
            <span className="ml-3 text-xs uppercase tracking-widest" style={{ color: 'var(--color-gold-deep)', fontFamily: 'var(--font-heading)' }}>
              Rank
            </span>
            <select
              value={rank}
              onChange={(e) => update({ rank: e.target.value })}
              className="rounded-sm border bg-transparent px-2 py-1 text-sm"
              style={{ borderColor: 'var(--color-gold-deep)', color: 'var(--color-ink)', fontFamily: 'var(--font-body)' }}
            >
              <option value="all">All</option>
              {rankOptions.map((r) => (
                <option key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      <Divider className="my-8 max-w-3xl" />

      <p className="mb-6 text-sm" style={{ color: 'var(--color-ink-soft)', opacity: 0.8 }}>
        Showing {filtered.length} of {sortedCards.length} cards.
      </p>

      <CardGrid cards={filtered} />
    </PageShell>
  )
}
