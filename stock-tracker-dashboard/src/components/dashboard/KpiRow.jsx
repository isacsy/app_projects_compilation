import { Award, Banknote, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { usePortfolioSummary } from '../../hooks/usePortfolioSummary'

function KpiCard({ icon: Icon, label, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  )
}

export default function KpiRow({ holdings, cash }) {
  const { totalValue, todayChangePercent, bestPerformer, loading } = usePortfolioSummary(holdings)
  const isPositive = todayChangePercent >= 0

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard icon={Wallet} label="Total Portfolio Value">
        <p className="text-2xl font-semibold text-slate-900 dark:text-white">
          {loading ? '—' : `$${totalValue.toFixed(2)}`}
        </p>
      </KpiCard>

      <KpiCard icon={isPositive ? TrendingUp : TrendingDown} label="Today's Change">
        <p
          className={`text-2xl font-semibold ${
            isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
          }`}
        >
          {loading || holdings.length === 0 ? '—' : `${isPositive ? '+' : ''}${todayChangePercent.toFixed(2)}%`}
        </p>
      </KpiCard>

      <KpiCard icon={Award} label="Best Performer">
        {bestPerformer ? (
          <>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">{bestPerformer.symbol}</p>
            <p
              className={`text-sm font-medium ${
                bestPerformer.quote.percentChange >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {bestPerformer.quote.percentChange >= 0 ? '+' : ''}
              {bestPerformer.quote.percentChange.toFixed(2)}%
            </p>
          </>
        ) : (
          <p className="text-sm text-slate-400 dark:text-slate-500">No holdings yet</p>
        )}
      </KpiCard>

      <KpiCard icon={Banknote} label="Available Cash">
        <p className="text-2xl font-semibold text-slate-900 dark:text-white">${Number(cash).toFixed(2)}</p>
      </KpiCard>
    </div>
  )
}
