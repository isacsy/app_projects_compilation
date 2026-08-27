import { useState } from 'react'
import CardBackPlaceholder from './CardBackPlaceholder'

const EXTENSIONS = ['jpg', 'png']

/**
 * Image slot for a card's illustration. Looks for /assets/cards/{id}.jpg,
 * then /assets/cards/{id}.png (served from /public/assets/cards/), and
 * falls back to the branded placeholder if neither exists — drop real art
 * in at either path later with no code changes.
 */
export default function CardImage({ id, alt, className = '' }) {
  const [attempt, setAttempt] = useState(0)

  if (attempt >= EXTENSIONS.length) {
    return <CardBackPlaceholder className={className} />
  }

  return (
    <img
      src={`/assets/cards/${id}.${EXTENSIONS[attempt]}`}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setAttempt((a) => a + 1)}
    />
  )
}
