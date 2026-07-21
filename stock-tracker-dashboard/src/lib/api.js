const BASE = '/api'

async function fetchJSON(url) {
  const res = await fetch(url)
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`)
  }
  return data
}

export function searchSymbols(query) {
  if (!query?.trim()) return Promise.resolve({ results: [] })
  return fetchJSON(`${BASE}/search?q=${encodeURIComponent(query)}`)
}

export function getQuote(symbol) {
  return fetchJSON(`${BASE}/quote?symbol=${encodeURIComponent(symbol)}`)
}

export function getHistory(symbol, range) {
  return fetchJSON(`${BASE}/history?symbol=${encodeURIComponent(symbol)}&range=${range}`)
}
