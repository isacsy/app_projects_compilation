import { Link, Navigate, useParams } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import CardImage from '../components/card/CardImage'
import { Divider, OrnateFrame } from '../components/decorative'
import { displayNameEn, getCardById, rankLabel, sortedCards, SUIT_LABELS } from '../lib/cardData'
import { getCardIcon } from '../components/icons'

function SectionTitle({ children }) {
  return (
    <h2
      className="mb-3 text-xl"
      style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-emerald-deep)' }}
    >
      {children}
    </h2>
  )
}

function Prose({ children }) {
  return (
    <p
      className="whitespace-pre-line text-[1.05rem] leading-relaxed"
      style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-prose)' }}
    >
      {children}
    </p>
  )
}

/** Illuminated-manuscript-style drop cap on the card's English name. Only
 * the first letter goes in the blackletter face — UnifrakturMaguntia is
 * unreadable at paragraph length, and only has Latin glyphs anyway (the
 * Chinese name/meanings below fall back past it to a system CJK face). */
function CardTitle({ name }) {
  const first = name.charAt(0)
  const rest = name.slice(1)
  return (
    <h1 className="mt-2 text-4xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-emerald-deep)' }}>
      <span style={{ fontFamily: 'var(--font-blackletter)', fontSize: '1.5em', color: 'var(--color-oxblood)' }}>
        {first}
      </span>
      {rest}
    </h1>
  )
}

export default function CardDetail() {
  const { id } = useParams()
  const card = getCardById(id)

  if (!card) {
    return <Navigate to="/library" replace />
  }

  const index = sortedCards.findIndex((c) => c.id === card.id)
  const prev = sortedCards[(index - 1 + sortedCards.length) % sortedCards.length]
  const next = sortedCards[(index + 1) % sortedCards.length]
  const Icon = getCardIcon(card)
  const subtitle =
    card.arcana === 'major' ? `Major Arcana · No. ${card.number}` : `${SUIT_LABELS[card.suit]} · ${rankLabel(card)}`

  return (
    <PageShell>
      <Link
        to="/library"
        className="text-xs uppercase tracking-[0.2em]"
        style={{ color: 'var(--color-oxblood)', fontFamily: 'var(--font-heading)' }}
      >
        &larr; Back to the Library
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-[280px_1fr]">
        <div className="mx-auto w-full max-w-[280px] md:mx-0">
          <OrnateFrame>
            <CardImage id={card.id} alt={`${displayNameEn(card.nameEn)} card art`} className="w-full" />
          </OrnateFrame>
        </div>

        <div>
          <p
            className="flex items-center gap-2 text-xs uppercase tracking-[0.35em]"
            style={{ color: 'var(--color-gold-deep)', fontFamily: 'var(--font-heading)' }}
          >
            <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
            {subtitle}
          </p>
          <CardTitle name={displayNameEn(card.nameEn)} />
          <p className="mt-1 text-2xl" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-oxblood)' }}>
            {card.nameZh}
          </p>

          {card.keywords.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {card.keywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded-sm border px-2.5 py-1 text-sm"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--color-gold) 50%, transparent)',
                    color: 'var(--color-emerald-deep)',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {kw}
                </span>
              ))}
            </div>
          )}

          {card.partial && (
            <p
              className="mt-5 max-w-lg border-l-2 pl-3 text-sm italic"
              style={{
                borderColor: 'var(--color-gold-deep)',
                color: 'var(--color-ink-soft)',
                opacity: 0.85,
                fontFamily: 'var(--font-prose)',
              }}
            >
              The reference book itself marks this entry as abridged (「部分」) — some of what a fuller
              treatment might cover, including the reversed meaning for most court cards, isn&rsquo;t in
              the source material.
            </p>
          )}

          {card.imageDescription && (
            <div className="mt-8">
              <SectionTitle>Card Imagery</SectionTitle>
              <Prose>{card.imageDescription}</Prose>
            </div>
          )}

          <div className="mt-8">
            <SectionTitle>Upright</SectionTitle>
            <Prose>{card.uprightMeaning}</Prose>
          </div>

          <div className="mt-8">
            <SectionTitle>Reversed</SectionTitle>
            {card.reversedMeaning ? (
              <Prose>{card.reversedMeaning}</Prose>
            ) : (
              <p
                className="text-sm italic"
                style={{ color: 'var(--color-ink-soft)', opacity: 0.75, fontFamily: 'var(--font-prose)' }}
              >
                Not covered in the source material for this card.
              </p>
            )}
          </div>
        </div>
      </div>

      <Divider className="my-10" />

      <div className="flex items-center justify-between text-sm">
        <Link
          to={`/library/${prev.id}`}
          className="uppercase tracking-widest"
          style={{ color: 'var(--color-oxblood)', fontFamily: 'var(--font-heading)' }}
        >
          &larr; {displayNameEn(prev.nameEn)}
        </Link>
        <Link
          to={`/library/${next.id}`}
          className="uppercase tracking-widest"
          style={{ color: 'var(--color-oxblood)', fontFamily: 'var(--font-heading)' }}
        >
          {displayNameEn(next.nameEn)} &rarr;
        </Link>
      </div>
    </PageShell>
  )
}
