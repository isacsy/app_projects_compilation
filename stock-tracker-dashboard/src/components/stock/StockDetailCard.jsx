import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { useStockHistory } from '../../hooks/useStockHistory'
import { useStockQuote } from '../../hooks/useStockQuote'
import PriceChart from './PriceChart'
import StockLogo from './StockLogo'

const RANGES = ['1M', '6M', '1Y']

export default function StockDetailCard({ symbol }) {
  const [range, setRange] = useState('1M')
  const { data: quote, loading: quoteLoading, error: quoteError } = useStockQuote(symbol)
  const { data: history, loading: historyLoading, error: historyError } = useStockHistory(symbol, range)

  if (!symbol) {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Search for a ticker above to see its price and chart.
        </p>
      </div>
    )
  }

  if (quoteError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
        {quoteError}
      </div>
    )
  }

  const isPositive = quote ? Number(quote.change) >= 0 : true

  return (
    <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white shadow-lg sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <StockLogo symbol={symbol} logoUrl={quote?.logoUrl} />
          <div>
            <p className="text-sm text-indigo-100">{quote?.name ?? symbol}</p>
            <p className="text-lg font-semibold tracking-tight">{symbol}</p>
          </div>
        </div>
        <div className="flex gap-1 rounded-xl bg-white/10 p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
                r === range ? 'bg-white text-indigo-700' : 'text-indigo-100 hover:bg-white/10'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {quoteLoading && !quote ? (
        <div className="mt-6 h-10 w-40 animate-pulse rounded bg-white/20" />
      ) : (
        <div className="mt-6 flex flex-wrap items-end gap-3">
          <p className="text-4xl font-semibold tracking-tight">${Number(quote?.price).toFixed(2)}</p>
          <p
            className={`flex items-center gap-1 pb-1 text-sm font-medium ${
              isPositive ? 'text-emerald-300' : 'text-red-300'
            }`}
          >
            {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            {isPositive ? '+' : ''}
            {Number(quote?.change).toFixed(2)} ({Number(quote?.percentChange).toFixed(2)}%)
          </p>
        </div>
      )}

      <p className="mt-1 text-xs text-indigo-100">
        Prices delayed ~15–20 min · as of{' '}
        {quote?.timestamp ? new Date(quote.timestamp * 1000).toLocaleString() : '—'}
      </p>

      <div className="mt-4">
        {historyLoading && !history ? (
          <div className="h-[220px] animate-pulse rounded-xl bg-white/10" />
        ) : historyError ? (
          <p className="py-8 text-center text-sm text-indigo-100">Couldn&apos;t load chart data.</p>
        ) : (
          <PriceChart data={history ?? []} />
        )}
      </div>
    </div>
  )
}
