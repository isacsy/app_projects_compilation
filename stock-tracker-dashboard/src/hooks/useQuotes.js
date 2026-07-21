import { useEffect, useState } from 'react'
import { getQuotes } from '../lib/api'

export function useQuotes(symbols) {
  const [quotes, setQuotes] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const key = [...symbols].sort().join(',')

  useEffect(() => {
    if (!symbols.length) {
      setQuotes({})
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    getQuotes(symbols)
      .then((res) => {
        if (!cancelled) setQuotes(res.quotes ?? {})
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // symbols identity changes on every Firestore snapshot; key captures the actual set
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return { quotes, loading, error }
}
