import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import SignInPrompt from '../components/layout/SignInPrompt'
import { useAuth } from '../context/AuthContext'
import { usePortfolio } from '../hooks/usePortfolio'
import { usePortfolioSummary } from '../hooks/usePortfolioSummary'

function AddHoldingForm({ onAdd }) {
  const [symbol, setSymbol] = useState('')
  const [quantity, setQuantity] = useState('')
  const [buyPrice, setBuyPrice] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!symbol.trim() || !quantity || !buyPrice) return
    setSubmitting(true)
    try {
      await onAdd({ symbol, quantity, buyPrice })
      setSymbol('')
      setQuantity('')
      setBuyPrice('')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Ticker (e.g. AAPL)"
        className={`${inputClass} max-w-[160px]`}
      />
      <input
        type="number"
        step="any"
        min="0"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Quantity"
        className={`${inputClass} max-w-[120px]`}
      />
      <input
        type="number"
        step="any"
        min="0"
        value={buyPrice}
        onChange={(e) => setBuyPrice(e.target.value)}
        placeholder="Avg buy price"
        className={`${inputClass} max-w-[140px]`}
      />
      <button
        type="submit"
        disabled={submitting || !symbol.trim() || !quantity || !buyPrice}
        className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
        Add holding
      </button>
    </form>
  )
}

export default function PortfolioPage() {
  const { user } = useAuth()
  const { holdings, loading, addHolding, removeHolding } = usePortfolio(user)
  const { rows, loading: quotesLoading } = usePortfolioSummary(holdings)

  if (!user) {
    return (
      <>
        <PageHeader title="Portfolio" subtitle="Track your holdings and profit/loss." />
        <div className="p-4 sm:p-8">
          <SignInPrompt message="Sign in to track your portfolio." />
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Portfolio" subtitle="Track your holdings and profit/loss." />
      <div className="space-y-6 p-4 sm:p-8">
        <AddHoldingForm onAdd={addHolding} />

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          {loading ? (
            <p className="p-6 text-sm text-slate-500 dark:text-slate-400">Loading your portfolio...</p>
          ) : rows.length === 0 ? (
            <p className="p-6 text-sm text-slate-500 dark:text-slate-400">
              No holdings yet. Add one above to start tracking profit/loss.
            </p>
          ) : (
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800 dark:text-slate-500">
                <tr>
                  <th className="px-4 py-3 sm:px-6">Ticker</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Avg Buy Price</th>
                  <th className="px-4 py-3">Current Price</th>
                  <th className="px-4 py-3">Current Value</th>
                  <th className="px-4 py-3">P/L ($)</th>
                  <th className="px-4 py-3">P/L (%)</th>
                  <th className="px-4 py-3">Weight</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rows.map((row) => {
                  const isPositive = row.plDollar != null ? row.plDollar >= 0 : true
                  return (
                    <tr key={row.id}>
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100 sm:px-6">
                        {row.symbol}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.quantity}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">${row.buyPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {row.currentPrice != null ? `$${row.currentPrice.toFixed(2)}` : quotesLoading ? '…' : '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {row.currentValue != null ? `$${row.currentValue.toFixed(2)}` : '—'}
                      </td>
                      <td
                        className={`px-4 py-3 font-medium ${
                          row.plDollar == null
                            ? 'text-slate-400'
                            : isPositive
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {row.plDollar != null ? `${isPositive ? '+' : ''}$${row.plDollar.toFixed(2)}` : '—'}
                      </td>
                      <td
                        className={`px-4 py-3 font-medium ${
                          row.plPercent == null
                            ? 'text-slate-400'
                            : isPositive
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {row.plPercent != null ? `${isPositive ? '+' : ''}${row.plPercent.toFixed(2)}%` : '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {row.weight != null ? `${row.weight.toFixed(2)}%` : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => removeHolding(row.id)}
                          aria-label={`Remove ${row.symbol}`}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-500 dark:hover:bg-slate-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
