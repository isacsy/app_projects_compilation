import { Loader2, Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { searchSymbols } from '../../lib/api'

export default function SearchBar({ onSelectSymbol }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed.length < 1) {
      setResults([])
      setError(null)
      return
    }
    setLoading(true)
    setError(null)
    const timeout = setTimeout(() => {
      searchSymbols(trimmed)
        .then((data) => {
          setResults(data.results ?? [])
          setOpen(true)
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(timeout)
  }, [query])

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(symbol) {
    onSelectSymbol(symbol)
    setQuery('')
    setResults([])
    setOpen(false)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    if (results.length > 0) {
      handleSelect(results[0].symbol)
    } else {
      handleSelect(trimmed.toUpperCase())
    }
  }

  return (
    <div ref={containerRef} className="relative w-full sm:w-72">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          {loading ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-slate-400" />
          ) : (
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
          )}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder="Search ticker (e.g. AAPL)"
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
          />
        </div>
      </form>
      {open && (results.length > 0 || error) && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
          {error && <p className="px-3 py-2 text-sm text-red-500">{error}</p>}
          {results.map((item) => (
            <button
              key={item.symbol}
              type="button"
              onClick={() => handleSelect(item.symbol)}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <span className="font-medium">{item.symbol}</span>
              <span className="truncate pl-3 text-slate-500 dark:text-slate-400">{item.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
