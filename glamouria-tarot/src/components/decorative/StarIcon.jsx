export default function StarIcon({ className = '', title }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <path d="M12 0c0 6.6 1.8 9.6 12 12-10.2 2.4-12 5.4-12 12 0-6.6-1.8-9.6-12-12C10.2 9.6 12 6.6 12 0z" />
    </svg>
  )
}
