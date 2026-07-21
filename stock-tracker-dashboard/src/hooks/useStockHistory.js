import { useEffect, useState } from 'react'
import { getHistory } from '../lib/api'

export function useStockHistory(symbol, range) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!symbol) {
      setData(null)
      setError(null)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    getHistory(symbol, range)
      .then((res) => {
        if (!cancelled) setData(res.points ?? [])
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
  }, [symbol, range])

  return { data, loading, error }
}
