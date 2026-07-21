export default async function handler(req, res) {
  const { symbol } = req.query

  if (!symbol) {
    return res.status(400).json({ error: 'Missing symbol' })
  }

  const apiKey = process.env.TWELVE_DATA_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing TWELVE_DATA_API_KEY' })
  }

  try {
    const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`
    const response = await fetch(url)
    const data = await response.json()

    if (data.status === 'error') {
      return res.status(502).json({ error: data.message || `No data for ${symbol}` })
    }

    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=120')
    return res.status(200).json({
      symbol: data.symbol,
      name: data.name,
      price: Number(data.close),
      change: Number(data.change),
      percentChange: Number(data.percent_change),
      previousClose: Number(data.previous_close),
      timestamp: Number(data.timestamp),
      isMarketOpen: data.is_market_open,
    })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reach Twelve Data' })
  }
}
