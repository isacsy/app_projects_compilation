// Batched quote lookup for the Watchlist/Portfolio, where fetching N tickers
// one request each would burn through Twelve Data's free-tier rate limit
// fast. Twelve Data's /quote endpoint accepts a comma-separated symbol list
// and returns either a single quote object (one symbol) or an object keyed
// by symbol (multiple symbols) -- this handles both shapes.
export default async function handler(req, res) {
  const { symbols } = req.query

  if (!symbols) {
    return res.status(400).json({ error: 'Missing symbols' })
  }

  const requested = [...new Set(symbols.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean))]
  if (requested.length === 0) {
    return res.status(200).json({ quotes: {} })
  }

  const apiKey = process.env.TWELVE_DATA_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing TWELVE_DATA_API_KEY' })
  }

  try {
    const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(requested.join(','))}&apikey=${apiKey}`
    const response = await fetch(url)
    const data = await response.json()

    // Single symbol: Twelve Data returns the quote object directly.
    const raw = requested.length === 1 && data.symbol ? { [data.symbol]: data } : data

    const quotes = {}
    for (const symbol of requested) {
      const entry = raw[symbol]
      if (!entry || entry.status === 'error' || entry.close === undefined) continue
      quotes[symbol] = {
        symbol: entry.symbol ?? symbol,
        name: entry.name,
        price: Number(entry.close),
        change: Number(entry.change),
        percentChange: Number(entry.percent_change),
        timestamp: Number(entry.timestamp),
      }
    }

    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=120')
    return res.status(200).json({ quotes })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reach Twelve Data' })
  }
}
