import { Link } from 'react-router-dom'
import CardImage from './CardImage'
import { displayNameEn, rankLabel, SUIT_LABELS } from '../../lib/cardData'
import { getCardIcon } from '../icons'

export default function CardTile({ card }) {
  const Icon = getCardIcon(card)
  const subtitle =
    card.arcana === 'major' ? `Major Arcana · No. ${card.number}` : `${SUIT_LABELS[card.suit]} · ${rankLabel(card)}`

  return (
    <Link
      to={`/library/${card.id}`}
      className="group block text-center transition-transform hocus:-translate-y-1"
    >
      <div
        className="overflow-hidden rounded-sm border shadow-sm transition-shadow group-hocus:shadow-lg"
        style={{ borderColor: 'color-mix(in srgb, var(--color-gold) 40%, transparent)' }}
      >
        <CardImage id={card.id} alt={`${displayNameEn(card.nameEn)} card art`} className="w-full" />
      </div>
      <p
        className="mt-2 text-sm leading-tight"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-oxblood)' }}
      >
        {displayNameEn(card.nameEn)}
      </p>
      <p
        className="mt-0.5 flex items-center justify-center gap-1 text-xs"
        style={{ color: 'var(--color-ink-soft)', opacity: 0.75 }}
      >
        <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--color-gold-deep)' }} />
        {subtitle}
      </p>
    </Link>
  )
}
