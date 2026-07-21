import { TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../stock/SearchBar'
import AuthButton from './AuthButton'
import ThemeToggle from './ThemeToggle'

export default function TopBar() {
  const navigate = useNavigate()

  function handleSelectSymbol(symbol) {
    navigate(`/?symbol=${encodeURIComponent(symbol)}`)
  }

  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white/70 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div className="flex items-center gap-2 md:hidden">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
          <TrendingUp className="h-4 w-4" />
        </span>
        <span className="font-semibold tracking-tight">StockTracker</span>
      </div>
      <div className="flex flex-1 items-center justify-end gap-3">
        <SearchBar onSelectSymbol={handleSelectSymbol} />
        <ThemeToggle />
        <AuthButton />
      </div>
    </header>
  )
}
