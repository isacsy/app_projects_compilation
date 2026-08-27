import CornerFloret from '../decorative/CornerFloret'

const SMALL_STARS = [
  { x: 90, y: 68, s: 0.55 },
  { x: 55, y: 95, s: 0.4 },
  { x: 125, y: 95, s: 0.4 },
  { x: 90, y: 212, s: 0.5 },
]

/**
 * Generic branded card-back design shown until real deck art exists at
 * /assets/cards/{id}.png — deliberately not per-card so it reads as an
 * intentional placeholder rather than a broken image.
 */
export default function CardBackPlaceholder({ className = '' }) {
  return (
    <svg viewBox="0 0 180 300" className={className} role="img" aria-label="Card art placeholder">
      <defs>
        <radialGradient id="cardBackGlow" cx="50%" cy="46%" r="65%">
          <stop offset="0%" stopColor="var(--color-midnight-soft)" />
          <stop offset="100%" stopColor="var(--color-midnight-deep)" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="180" height="300" rx="6" fill="url(#cardBackGlow)" />
      <rect x="6" y="6" width="168" height="288" rx="3" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" opacity="0.85" />
      <rect x="12" y="12" width="156" height="276" rx="2" fill="none" stroke="var(--color-gold)" strokeWidth="0.6" opacity="0.5" />

      <g opacity="0.9">
        <CornerFloret tone="ivory" className="opacity-90" />
      </g>

      <g transform="translate(16,264) scale(-1,-1)">
        <CornerFloret tone="ivory" />
      </g>
      <g transform="translate(164,16) scale(-1,1)">
        <CornerFloret tone="ivory" />
      </g>
      <g transform="translate(164,264) scale(1,-1)">
        <CornerFloret tone="ivory" />
      </g>

      {/* central emblem: vesica diamond + crescent moon + star */}
      <g transform="translate(90,142)">
        <path
          d="M0,-46 C 22,-24 22,24 0,46 C -22,24 -22,-24 0,-46 Z"
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="1"
          opacity="0.6"
        />
        <circle r="34" fill="none" stroke="var(--color-gold)" strokeWidth="1.25" />
        <circle r="27" fill="none" stroke="var(--color-gold)" strokeWidth="0.5" opacity="0.6" />

        <path
          d="M8,-20c-13,2-21,13-21,26s9,24,21,26c-17,1-31-11-31-26S-9-21,8-20z"
          fill="var(--color-gold-bright)"
          opacity="0.95"
        />
        {SMALL_STARS.slice(0, 2).map((s, i) => (
          <path
            key={i}
            transform={`translate(${s.x - 90 + 30},${s.y - 142}) scale(${s.s})`}
            d="M12 0c0 6.6 1.8 9.6 12 12-10.2 2.4-12 5.4-12 12 0-6.6-1.8-9.6-12-12C10.2 9.6 12 6.6 12 0z"
            fill="var(--color-gold)"
          />
        ))}
      </g>

      {SMALL_STARS.map((s, i) => (
        <path
          key={i}
          transform={`translate(${s.x - 12 * s.s},${s.y - 12 * s.s}) scale(${s.s})`}
          d="M12 0c0 6.6 1.8 9.6 12 12-10.2 2.4-12 5.4-12 12 0-6.6-1.8-9.6-12-12C10.2 9.6 12 6.6 12 0z"
          fill="var(--color-gold)"
          opacity="0.7"
        />
      ))}

      <text
        x="90"
        y="252"
        textAnchor="middle"
        fill="var(--color-gold)"
        fontSize="12"
        letterSpacing="4"
        style={{ fontFamily: 'var(--font-heading)' }}
        opacity="0.9"
      >
        GLAMOURIA
      </text>
      <text
        x="90"
        y="266"
        textAnchor="middle"
        fill="var(--color-gold)"
        fontSize="7.5"
        letterSpacing="3"
        style={{ fontFamily: 'var(--font-heading)' }}
        opacity="0.65"
      >
        STUDIO TAROT
      </text>
    </svg>
  )
}
