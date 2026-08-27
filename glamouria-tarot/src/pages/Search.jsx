import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import CardGrid from '../components/card/CardGrid'
import { Divider } from '../components/decorative'
import { searchCards } from '../lib/cardData'

export default function Search() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') || ''
  const [draft, setDraft] = useState(query)

  const results = searchCards(query)

  function handleSubmit(event) {
    event.preventDefault()
    setParams(draft.trim() ? { q: draft.trim() } : {}, { replace: true })
  }

  return (
    <PageShell>
      <h1 className="text-3xl sm:text-4xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-emerald-deep)' }}>
        Search the Archive
      </h1>
      <p className="mt-2 max-w-2xl" style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-prose)' }}>
        Matches card names and keywords, and the upright &amp; reversed meanings for every card.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex max-w-md gap-2">
        <label htmlFor="search-query" className="sr-only">
          Search
        </label>
        <input
          id="search-query"
          type="search"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="e.g. moon, betrayal, 權杖"
          className="w-full rounded-sm border bg-transparent px-3 py-2 text-sm outline-none"
          style={{ borderColor: 'color-mix(in srgb, var(--color-gold) 45%, transparent)', color: 'var(--color-ink)' }}
        />
        <button
          type="submit"
          className="shrink-0 rounded-sm border px-4 py-2 text-xs uppercase tracking-widest"
          style={{ borderColor: 'var(--color-gold-deep)', color: 'var(--color-oxblood)', fontFamily: 'var(--font-heading)' }}
        >
          Seek
        </button>
      </form>

      <Divider className="my-8 max-w-3xl" />

      {query ? (
        <>
          <p className="mb-6 text-sm" style={{ color: 'var(--color-ink-soft)', opacity: 0.8 }}>
            {results.length} {results.length === 1 ? 'card matches' : 'cards match'} &ldquo;{query}&rdquo;.
          </p>
          <CardGrid cards={results} emptyMessage={`No cards match "${query}". Try a shorter word.`} />
        </>
      ) : (
        <p className="py-16 text-center text-lg" style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-prose)' }}>
          Type a name, keyword, or a word from a card&rsquo;s meaning to begin.
        </p>
      )}
    </PageShell>
  )
}
