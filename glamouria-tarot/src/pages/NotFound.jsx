import { Link } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'

export default function NotFound() {
  return (
    <PageShell className="text-center">
      <h1 className="text-3xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-emerald-deep)' }}>
        The Cards Are Silent
      </h1>
      <p className="mt-4" style={{ color: 'var(--color-ink-soft)' }}>
        There&rsquo;s nothing drawn at this address.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block text-sm uppercase tracking-[0.2em]"
        style={{ color: 'var(--color-oxblood)', fontFamily: 'var(--font-heading)' }}
      >
        Return home
      </Link>
    </PageShell>
  )
}
