import { Link } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import { Divider, OrnateFrame, StainedGlassArch, StarIcon } from '../components/decorative'

const PREVIEW_SECTIONS = [
  {
    title: 'Card Library',
    description:
      'All 78 cards of the Glamouria deck — Major Arcana, the four Minor suits, and the court — with upright and reversed meanings drawn straight from the reference text.',
    to: '/library',
    status: 'live',
  },
  {
    title: 'Structured Lessons',
    description:
      'A guided path from the Major Arcana overview through each suit, the court, spreads, and live reading practice, with progress saved on this device.',
    status: 'in the works',
  },
  {
    title: 'Daily Draw & Spreads',
    description:
      'A card of the day with a saved draw history, plus visual layouts for the classic spreads — Celtic Cross, the two-choice spread, and more.',
    status: 'in the works',
  },
]

export default function Home() {
  return (
    <PageShell>
      <section className="grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p
            className="mb-3 text-xs uppercase tracking-[0.4em]"
            style={{ color: 'var(--color-oxblood)', fontFamily: 'var(--font-heading)' }}
          >
            A Companion Grimoire
          </p>
          <h1
            className="text-4xl leading-tight sm:text-5xl"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-emerald-deep)' }}
          >
            Glamouria Studio Tarot
          </h1>
          <p
            className="mt-5 max-w-xl text-lg leading-relaxed sm:text-xl"
            style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-body)' }}
          >
            A reference library and a structured way to learn the Glamouria deck — an
            original 78-card tarot rendered in a dark, stained-glass Art&nbsp;Nouveau style.
            Browse every card&rsquo;s meaning, search by keyword, and, as the learning
            system grows, practice reading them properly.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/library"
              className="rounded-sm px-6 py-2.5 text-sm uppercase tracking-[0.2em] transition-transform hocus:-translate-y-0.5"
              style={{
                fontFamily: 'var(--font-heading)',
                background: 'var(--color-emerald-deep)',
                color: 'var(--color-ivory)',
                boxShadow: '0 1px 0 var(--color-gold)',
              }}
            >
              Browse the Card Library
            </Link>
            <Link
              to="/search"
              className="rounded-sm border px-6 py-2.5 text-sm uppercase tracking-[0.2em] transition-transform hocus:-translate-y-0.5"
              style={{
                fontFamily: 'var(--font-heading)',
                borderColor: 'var(--color-gold-deep)',
                color: 'var(--color-oxblood)',
              }}
            >
              Search the Archive
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xs">
          <StainedGlassArch className="w-full drop-shadow-[0_18px_30px_rgba(15,21,38,0.35)]" />
        </div>
      </section>

      <Divider className="my-14 max-w-2xl mx-auto" />

      <section>
        <h2
          className="mb-8 text-center text-2xl"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-emerald-deep)' }}
        >
          Find Your Way Through the Deck
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {PREVIEW_SECTIONS.map((section) => {
            const content = (
              <OrnateFrame innerClassName="h-full p-6 bg-[color-mix(in_srgb,var(--color-ivory-deep)_70%,transparent)]">
                <StarIcon className="mb-3 h-4 w-4" style={{ color: 'var(--color-gold-deep)' }} />
                <h3
                  className="mb-2 text-lg"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-oxblood)' }}
                >
                  {section.title}
                </h3>
                <p className="text-[0.95rem] leading-relaxed" style={{ color: 'var(--color-ink-soft)' }}>
                  {section.description}
                </p>
                {section.status === 'in the works' && (
                  <p
                    className="mt-4 text-[0.65rem] uppercase tracking-[0.3em]"
                    style={{ color: 'var(--color-gold-deep)', fontFamily: 'var(--font-heading)' }}
                  >
                    In the works
                  </p>
                )}
              </OrnateFrame>
            )

            return section.to ? (
              <Link key={section.title} to={section.to} className="group block h-full">
                {content}
              </Link>
            ) : (
              <div key={section.title} className="h-full opacity-90">
                {content}
              </div>
            )
          })}
        </div>
      </section>
    </PageShell>
  )
}
