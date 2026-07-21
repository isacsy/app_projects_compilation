import { Briefcase, LayoutDashboard, Settings, Star, TrendingUp } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, available: true },
  { label: 'Watchlist', icon: Star, available: false },
  { label: 'Portfolio', icon: Briefcase, available: false },
  { label: 'Settings', icon: Settings, available: false },
]

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6 dark:border-slate-800 dark:bg-slate-900 md:flex">
      <div className="mb-8 flex items-center gap-2 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
          <TrendingUp className="h-5 w-5" />
        </span>
        <span className="text-lg font-semibold tracking-tight">StockTracker</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ label, icon: Icon, available }) => (
          <button
            key={label}
            type="button"
            disabled={!available}
            title={available ? undefined : `${label} arrives in Phase 2`}
            className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              available
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                : 'cursor-not-allowed text-slate-400 dark:text-slate-600'
            }`}
          >
            <span className="flex items-center gap-3">
              <Icon className="h-4 w-4" />
              {label}
            </span>
            {!available && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                Soon
              </span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  )
}
