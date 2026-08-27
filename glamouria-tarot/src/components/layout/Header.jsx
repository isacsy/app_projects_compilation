import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Logomark from './Logomark'

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/library', label: 'Card Library' },
]

export default function Header() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSearchSubmit(event) {
    event.preventDefault()
    const trimmed = query.trim()
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search')
  }

  return (
    <header
      className="sticky top-0 z-30 border-b"
      style={{
        borderColor: 'color-mix(in srgb, var(--color-gold) 35%, transparent)',
        background: 'color-mix(in srgb, var(--color-ivory) 92%, transparent)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <Logomark className="h-9 w-9" />
          <span className="leading-tight">
            <span
              className="block text-xl tracking-wide"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-emerald-deep)' }}
            >
              Glamouria
            </span>
            <span
              className="block text-[0.65rem] uppercase tracking-[0.35em]"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-gold-deep)' }}
            >
              Studio Tarot
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-6" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `text-sm uppercase tracking-[0.15em] transition-colors ${isActive ? '' : 'hocus:opacity-100'}`
              }
              style={({ isActive }) => ({
                fontFamily: 'var(--font-heading)',
                color: isActive ? 'var(--color-oxblood)' : 'var(--color-ink-soft)',
                opacity: isActive ? 1 : 0.75,
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <form onSubmit={handleSearchSubmit} className="ml-auto flex min-w-[12rem] flex-1 items-center gap-2 sm:flex-none">
          <label htmlFor="site-search" className="sr-only">
            Search cards
          </label>
          <input
            id="site-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search cards & keywords…"
            className="w-full rounded-sm border bg-transparent px-3 py-1.5 text-sm outline-none sm:w-56"
            style={{
              borderColor: 'color-mix(in srgb, var(--color-gold) 45%, transparent)',
              color: 'var(--color-ink)',
              fontFamily: 'var(--font-body)',
            }}
          />
          <button
            type="submit"
            className="shrink-0 rounded-sm border px-3 py-1.5 text-xs uppercase tracking-widest transition-colors hocus:text-[var(--color-ivory)]"
            style={{
              borderColor: 'var(--color-gold-deep)',
              color: 'var(--color-gold-deep)',
              fontFamily: 'var(--font-heading)',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'var(--color-gold-deep)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            Seek
          </button>
        </form>
      </div>
    </header>
  )
}
