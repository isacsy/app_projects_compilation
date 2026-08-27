/**
 * A horizontal Art Nouveau divider: two hairlines tapering into a center
 * fleuron. Used to separate sections without a hard modern <hr>.
 */
export default function Divider({ className = '', tone = 'gold' }) {
  const stroke = tone === 'gold' ? 'var(--color-gold)' : 'var(--color-emerald)'

  return (
    <svg
      viewBox="0 0 400 24"
      className={`w-full h-6 ${className}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0 12 H160" stroke={stroke} strokeWidth="1" opacity="0.7" />
      <path d="M240 12 H400" stroke={stroke} strokeWidth="1" opacity="0.7" />
      <path
        d="M160 12 C 172 2, 188 2, 200 12 C 212 2, 228 2, 240 12"
        fill="none"
        stroke={stroke}
        strokeWidth="1"
      />
      <path
        d="M160 12 C 172 22, 188 22, 200 12 C 212 22, 228 22, 240 12"
        fill="none"
        stroke={stroke}
        strokeWidth="1"
        opacity="0.6"
      />
      <circle cx="200" cy="12" r="3.2" fill={stroke} />
      <circle cx="200" cy="12" r="1.1" fill="var(--color-ivory)" />
    </svg>
  )
}
