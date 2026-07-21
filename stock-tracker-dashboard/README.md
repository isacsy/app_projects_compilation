# Stock Tracker Dashboard

A personal stock tracking app: look up tickers, save a watchlist, and track a
portfolio with profit/loss — built for real daily use, not a demo.

**Stack:** React + Vite, Tailwind CSS, Recharts, Firebase (Firestore + Google
login, from Phase 2), deployed on Vercel.

**Stock data:** [Twelve Data](https://twelvedata.com) free tier (delayed
~15–20 min, labeled as such in the UI), accessed through this app's own
Vercel serverless functions in `api/` so the API key never reaches the
browser. See root `README.md` note below for why this over `yfinance`.

## Folder structure

```
stock-tracker-dashboard/
├── api/                  # Vercel serverless functions (Node, proxy Twelve Data)
│   ├── quote.js          # GET /api/quote?symbol=AAPL      -> latest price + % change
│   ├── history.js        # GET /api/history?symbol=AAPL&range=1M -> chart data
│   └── search.js         # GET /api/search?q=AAPL          -> ticker autocomplete
├── src/
│   ├── components/
│   │   ├── layout/       # Sidebar, TopBar, ThemeToggle — persistent app chrome
│   │   └── stock/        # SearchBar, StockDetailCard, PriceChart
│   ├── context/          # ThemeContext (light/dark, persisted to localStorage)
│   ├── hooks/            # useStockQuote, useStockHistory — data fetching
│   ├── lib/               # api.js — thin fetch wrappers around /api/*
│   ├── App.jsx
│   └── main.jsx
└── .env.example          # copy to .env, add your Twelve Data key
```

## Setup

1. **Get a free Twelve Data API key**: sign up at
   [twelvedata.com/pricing](https://twelvedata.com/pricing) (no credit card).
2. **Install dependencies**:
   ```bash
   cd stock-tracker-dashboard
   npm install
   ```
3. **Add your API key**:
   ```bash
   cp .env.example .env
   # then edit .env and paste your key
   ```
4. **Install the Vercel CLI** (one-time, needed to run the serverless
   functions locally):
   ```bash
   npm install -g vercel
   vercel login
   ```

## Running locally

Two processes, in two terminals:

```bash
# Terminal 1 — serves /api/* functions on :3000
vercel dev

# Terminal 2 — serves the React app on :5173, proxies /api to :3000
npm run dev
```

Open **http://localhost:5173** (not :3000 — that's just the API).

## Phase 1 — what to test

- [ ] Type a ticker (e.g. `AAPL`, `MSFT`, `TSLA`) into the search bar — a
      dropdown of matches should appear within ~1 second.
- [ ] Click a result — a purple detail card appears with the current price,
      today's $ and % change, and a line chart.
- [ ] Click **1M / 6M / 1Y** — the chart should re-fetch and redraw for that
      range.
- [ ] Confirm the "Prices delayed ~15–20 min" note is visible under the price.
- [ ] Click the sun/moon icon (top right) — the whole app should switch
      between light and dark theme, and stay on your choice after a page
      refresh.
- [ ] Try an invalid ticker (e.g. `ZZZZZ`) — you should see a readable error,
      not a blank screen or crash.
- [ ] Resize the window down to mobile width — the sidebar should collapse
      and the search bar/chart should still be usable.

If something looks off, note which step and what you saw — that's the fastest
way to get it fixed before Phase 2 starts.

## Deploying to Vercel

This app lives in a subfolder of a larger repo, so when creating the Vercel
project:

1. Import the `app_projects_compilation` repo.
2. Set **Root Directory** to `stock-tracker-dashboard`.
3. Add the `TWELVE_DATA_API_KEY` environment variable in Vercel's project
   settings (Settings → Environment Variables) — same value as your local
   `.env`.
4. Deploy. Vercel auto-detects Vite for the frontend and picks up `api/*.js`
   as serverless functions.

## Roadmap

- **Phase 2**: Firebase Google login, Watchlist (save/remove tickers),
  Portfolio (holdings, auto P/L), persisted per-user to Firestore.
- **Phase 3** (later): share access with a few people; possibly phone-number
  login. Not built yet, but the Firestore data model and auth layer from
  Phase 2 are kept simple enough to extend to this without a rewrite.
