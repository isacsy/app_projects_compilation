import { useMemo } from 'react'
import { useQuotes } from './useQuotes'

export function usePortfolioSummary(holdings) {
  const symbols = useMemo(() => [...new Set(holdings.map((h) => h.symbol))], [holdings])
  const { quotes, loading, error } = useQuotes(symbols)

  const rows = holdings.map((holding) => {
    const quote = quotes[holding.symbol]
    const currentPrice = quote?.price ?? null
    const currentValue = currentPrice != null ? currentPrice * holding.quantity : null
    const costBasis = holding.buyPrice * holding.quantity
    const plDollar = currentValue != null ? currentValue - costBasis : null
    const plPercent = costBasis > 0 && plDollar != null ? (plDollar / costBasis) * 100 : null
    return { ...holding, quote, currentPrice, currentValue, costBasis, plDollar, plPercent }
  })

  const totalValue = rows.reduce((sum, r) => sum + (r.currentValue ?? 0), 0)
  const totalPreviousValue = rows.reduce((sum, r) => {
    if (!r.quote) return sum + (r.currentValue ?? 0)
    return sum + (r.currentPrice - r.quote.change) * r.quantity
  }, 0)
  const todayChangeDollar = totalValue - totalPreviousValue
  const todayChangePercent = totalPreviousValue > 0 ? (todayChangeDollar / totalPreviousValue) * 100 : 0

  const rowsWithWeight = rows.map((r) => ({
    ...r,
    weight: totalValue > 0 && r.currentValue != null ? (r.currentValue / totalValue) * 100 : null,
  }))

  const bestPerformer =
    rows
      .filter((r) => r.quote?.percentChange != null)
      .sort((a, b) => b.quote.percentChange - a.quote.percentChange)[0] ?? null

  return {
    rows: rowsWithWeight,
    loading,
    error,
    totalValue,
    todayChangeDollar,
    todayChangePercent,
    bestPerformer,
  }
}
