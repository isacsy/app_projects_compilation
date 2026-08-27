const JEWEL_TONES = [
  'var(--color-emerald)',
  'var(--color-oxblood)',
  'var(--color-gold)',
  'var(--color-midnight)',
]

const ROSE_CENTER = { x: 150, y: 150 }
const ROSE_RADIUS = 58
const PETAL_COUNT = 8

function roseWedges() {
  const points = Array.from({ length: PETAL_COUNT }, (_, i) => {
    const angle = (Math.PI * 2 * i) / PETAL_COUNT
    return {
      x: ROSE_CENTER.x + ROSE_RADIUS * Math.cos(angle),
      y: ROSE_CENTER.y + ROSE_RADIUS * Math.sin(angle),
    }
  })

  return points.map((p, i) => {
    const next = points[(i + 1) % PETAL_COUNT]
    return {
      d: `M${ROSE_CENTER.x},${ROSE_CENTER.y} L${p.x.toFixed(1)},${p.y.toFixed(1)} A${ROSE_RADIUS},${ROSE_RADIUS} 0 0,1 ${next.x.toFixed(1)},${next.y.toFixed(1)} Z`,
      color: JEWEL_TONES[i % JEWEL_TONES.length],
      point: p,
    }
  })
}

/**
 * A pointed gothic-arch "stained glass window" motif: a rose of jewel-toned
 * panes over lancet panels below, with thin gold leading. Purely decorative
 * background dressing — aria-hidden.
 */
export default function StainedGlassArch({ className = '' }) {
  const wedges = roseWedges()

  return (
    <svg
      viewBox="0 0 300 420"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id="archClip">
          <path d="M42,400 L42,190 C42,95 90,32 150,32 C210,32 258,95 258,190 L258,400 Z" />
        </clipPath>
      </defs>

      <g clipPath="url(#archClip)">
        <rect x="42" y="32" width="216" height="368" fill="var(--color-midnight-deep)" opacity="0.25" />

        {wedges.map((w) => (
          <path key={w.d} d={w.d} fill={w.color} opacity="0.4" />
        ))}
        {wedges.map((w) => (
          <line
            key={`l-${w.point.x}-${w.point.y}`}
            x1={ROSE_CENTER.x}
            y1={ROSE_CENTER.y}
            x2={w.point.x}
            y2={w.point.y}
            stroke="var(--color-gold)"
            strokeWidth="1"
            opacity="0.7"
          />
        ))}
        <circle cx={ROSE_CENTER.x} cy={ROSE_CENTER.y} r={ROSE_RADIUS} fill="none" stroke="var(--color-gold)" strokeWidth="1.5" />
        <circle cx={ROSE_CENTER.x} cy={ROSE_CENTER.y} r="10" fill="var(--color-gold)" opacity="0.85" />
        <circle cx={ROSE_CENTER.x} cy={ROSE_CENTER.y} r="10" fill="none" stroke="var(--color-ivory)" strokeWidth="0.75" />

        {/* lancet panels below the rose */}
        {[
          { x: 42, w: 68, tone: 'var(--color-emerald)' },
          { x: 116, w: 68, tone: 'var(--color-midnight)' },
          { x: 190, w: 68, tone: 'var(--color-oxblood)' },
        ].map((panel) => (
          <g key={panel.x}>
            <rect x={panel.x} y="210" width={panel.w} height="190" fill={panel.tone} opacity="0.28" />
            {[250, 290, 330, 370].map((y) => (
              <line key={y} x1={panel.x} y1={y} x2={panel.x + panel.w} y2={y} stroke="var(--color-gold)" strokeWidth="0.5" opacity="0.5" />
            ))}
          </g>
        ))}
      </g>

      {/* leading / frame */}
      <path
        d="M42,400 L42,190 C42,95 90,32 150,32 C210,32 258,95 258,190 L258,400"
        fill="none"
        stroke="var(--color-gold)"
        strokeWidth="2.5"
      />
      <path
        d="M30,400 L30,186 C30,82 84,14 150,14 C216,14 270,82 270,186 L270,400"
        fill="none"
        stroke="var(--color-gold)"
        strokeWidth="1"
        opacity="0.55"
      />
    </svg>
  )
}
