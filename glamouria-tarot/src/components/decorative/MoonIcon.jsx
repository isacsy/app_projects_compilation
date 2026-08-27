export default function MoonIcon({ className = '', title }) {
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
      <path d="M15.5 2.5c-6 1-9.5 6-9.5 10.8 0 5.9 4.8 10.7 10.7 10.7 3.2 0 6-1.4 8-3.6-1 .3-2 .5-3.1.5-6 0-10.8-4.9-10.8-10.8 0-2.9 1.2-5.6 3.1-7.6a10 10 0 0 0 1.6 0z" />
    </svg>
  )
}
