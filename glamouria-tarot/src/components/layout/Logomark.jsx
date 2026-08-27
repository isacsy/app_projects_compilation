export default function Logomark({ className = '' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <circle cx="24" cy="24" r="21.5" fill="none" stroke="var(--color-gold)" strokeWidth="1.25" />
      <circle cx="24" cy="24" r="17.5" fill="none" stroke="var(--color-gold)" strokeWidth="0.6" opacity="0.6" />
      <path
        d="M27,9c-9,1.5-15,9-15,17.5C12,36.2,19.8,44,29.5,44c4,0,7.6-1.3,10.5-3.6C24.5,42.9,15,32.7,15,20.5,15,15.8,17.8,11.7,22,9.1A16,16,0,0,1,27,9Z"
        fill="var(--color-gold)"
      />
      <path
        d="M32 6c0 4.4 1.2 6.4 8 8-6.8 1.6-8 3.6-8 8 0-4.4-1.2-6.4-8-8 6.8-1.6 8-3.6 8-8z"
        fill="var(--color-gold-bright)"
      />
    </svg>
  )
}
