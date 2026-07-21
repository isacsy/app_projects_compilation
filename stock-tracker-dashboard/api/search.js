export default async function handler(req, res) {
  const { q } = req.query

  if (!q || !q.trim()) {
    return res.status(200).json({ results: [] })
  }

  const apiKey = process.env.TWELVE_DATA_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing TWELVE_DATA_API_KEY' })
  }

  try {
    const url = `https://api.twelvedata.com/symbol_search?symbol=${encodeURIComponent(q)}&apikey=${apiKey}`
    const response = await fetch(url)
    const data = await response.json()

    if (data.status === 'error') {
      return res.status(502).json({ error: data.message || 'Symbol search failed' })
    }

    const results = (data.data ?? [])
      .filter((item) => !item.instrument_type || ['Common Stock', 'ETF'].includes(item.instrument_type))
      .slice(0, 8)
      .map((item) => ({
        symbol: item.symbol,
        name: item.instrument_name,
        exchange: item.exchange,
      }))

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
    return res.status(200).json({ results })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reach Twelve Data' })
  }
}
