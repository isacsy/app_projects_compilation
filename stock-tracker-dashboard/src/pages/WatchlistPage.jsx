import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import SignInPrompt from '../components/layout/SignInPrompt'
import { useAuth } from '../context/AuthContext'
import { useQuotes } from '../hooks/useQuotes'
import { useWatchlist } from '../hooks/useWatchlist'

export default function WatchlistPage() {
  const { user } = useAuth()
  const { items, loading, addSymbol, removeSymbol } = useWatchlist(user)
  const { quotes, loading: quotesLoading } = useQuotes(items.map((item) => item.symbol))
  const [input, setInput] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleAdd(event) {
    event.preventDefault()
    const symbol = input.trim()
    if (!symbol) return
    setSubmitting(true)
    try {
      await addSymbol(symbol)
      setInput('')
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) {
    return (
      <>
        <PageHeader title="Watchlist" subtitle="Save tickers to keep an eye on." />
        <div className="p-4 sm:p-8">
          <SignInPrompt message="Sign in to save and view your watchlist." />
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Watchlist" subtitle="Save tickers to keep an eye on." />
      <div className="space-y-6 p-4 sm:p-8">
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a ticker (e.g. AAPL)"
            className="w-full max-w-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
          <button
            type="submit"
            disabled={submitting || !input.trim()}
            className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </form>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          {loading ? (
            <p className="p-6 text-sm text-slate-500 dark:text-slate-400">Loading your watchlist...</p>
          ) : items.length === 0 ? (
            <p className="p-6 text-sm text-slate-500 dark:text-slate-400">
              Your watchlist is empty. Add a ticker above to get started.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {items.map((item) => {
                const quote = quotes[item.symbol]
                const isPositive = quote ? quote.change >= 0 : true
                return (
                  <li key={item.id} className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
                    <Link
                      to={`/?symbol=${encodeURIComponent(item.symbol)}`}
                      className="flex flex-1 items-center justify-between gap-3 rounded-lg px-2 py-1 -mx-2 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">{item.symbol}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{quote?.name ?? '—'}</p>
                      </div>
                      <div className="text-right">
                        {quotesLoading && !quote ? (
                          <span className="text-sm text-slate-400">…</span>
                        ) : quote ? (
                          <>
                            <p className="font-medium text-slate-900 dark:text-slate-100">
                              ${quote.price.toFixed(2)}
                            </p>
                            <p
                              className={`text-xs font-medium ${
                                isPositive
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}
                            >
                              {isPositive ? '+' : ''}
                              {quote.percentChange.toFixed(2)}%
                            </p>
                          </>
                        ) : (
                          <span className="text-xs text-slate-400">No data</span>
                        )}
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeSymbol(item.symbol)}
                      aria-label={`Remove ${item.symbol}`}
                      className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-500 dark:hover:bg-slate-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}
