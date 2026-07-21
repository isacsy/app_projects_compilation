const RANGE_CONFIG = {
  '1M': { interval: '1day', outputsize: 30 },
  '6M': { interval: '1day', outputsize: 130 },
  '1Y': { interval: '1week', outputsize: 52 },
}

export default async function handler(req, res) {
  const { symbol, range = '1M' } = req.query

  if (!symbol) {
    return res.status(400).json({ error: 'Missing symbol' })
  }

  const config = RANGE_CONFIG[range]
  if (!config) {
    return res.status(400).json({ error: `Unsupported range ${range}` })
  }

  const apiKey = process.env.TWELVE_DATA_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing TWELVE_DATA_API_KEY' })
  }

  try {
    const url = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(symbol)}&interval=${config.interval}&outputsize=${config.outputsize}&apikey=${apiKey}`
    const response = await fetch(url)
    const data = await response.json()

    if (data.status === 'error') {
      console.error('Twelve Data history error:', data.message)
      return res.status(502).json({ error: `No chart data found for "${symbol}".` })
    }

    const points = (data.values ?? [])
      .map((v) => ({ date: v.datetime, price: Number(v.close) }))
      .reverse()

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    return res.status(200).json({ symbol, range, points })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reach Twelve Data' })
  }
}
