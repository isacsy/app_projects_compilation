/**
 * A single Art Nouveau corner ornament: an L-bracket, a curling tendril,
 * and an eight-petal floret. Drawn for the top-left corner; OrnateFrame
 * rotates copies of this into the other three corners.
 */
export default function CornerFloret({ className = '', tone = 'gold' }) {
  const stroke = tone === 'gold' ? 'var(--color-gold)' : 'var(--color-ivory)'
  const accent = tone === 'gold' ? 'var(--color-oxblood)' : 'var(--color-gold-bright)'

  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      width="32"
      height="32"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M3 22 V3 H22"
        fill="none"
        stroke={stroke}
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M3 30 V3 H30"
        fill="none"
        stroke={stroke}
        strokeWidth="0.75"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M9 9 C 17 7, 23 13, 20 22"
        fill="none"
        stroke={stroke}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.85"
      />
      <g transform="translate(24,24)">
        {[0, 45, 90, 135].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="0"
            rx="7"
            ry="2.1"
            transform={`rotate(${deg})`}
            fill={stroke}
            opacity="0.5"
          />
        ))}
        <circle r="2.2" fill={accent} />
      </g>
      <ellipse cx="17" cy="18" rx="2.4" ry="1.3" transform="rotate(-35 17 18)" fill={stroke} opacity="0.7" />
    </svg>
  )
}
