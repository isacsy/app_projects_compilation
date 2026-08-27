import CardTile from './CardTile'

export default function CardGrid({ cards, emptyMessage = 'No cards match these filters.' }) {
  if (cards.length === 0) {
    return (
      <p className="py-16 text-center text-lg" style={{ color: 'var(--color-ink-soft)' }}>
        {emptyMessage}
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {cards.map((card) => (
        <CardTile key={card.id} card={card} />
      ))}
    </div>
  )
}
