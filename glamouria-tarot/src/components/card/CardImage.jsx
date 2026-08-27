import { useState } from 'react'
import CardBackPlaceholder from './CardBackPlaceholder'

/**
 * Image slot for a card's illustration. Looks for /assets/cards/{id}.png
 * (served from /public/assets/cards/) and falls back to the branded
 * placeholder if that file doesn't exist yet — drop real art in at that
 * path later with no code changes.
 */
export default function CardImage({ id, alt, className = '' }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return <CardBackPlaceholder className={className} />
  }

  return (
    <img
      src={`/assets/cards/${id}.png`}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
