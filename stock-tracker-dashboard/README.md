# Stock Tracker Dashboard

A personal stock tracking app: look up tickers, save a watchlist, and track a
portfolio with profit/loss — built for real daily use, not a demo.

**Stack:** React + Vite, Tailwind CSS, Recharts, Firebase (Firestore +
Google login), deployed on Vercel.

**Stock data:** [Twelve Data](https://twelvedata.com) free tier (delayed
~15–20 min, labeled as such in the UI), accessed through this app's own
Vercel serverless functions in `api/` so the API key never reaches the
browser.

## Folder structure

```
stock-tracker-dashboard/
├── api/                    # Vercel serverless functions (Node, proxy Twelve Data)
│   ├── quote.js             # GET /api/quote?symbol=AAPL       -> price + % change + logo
│   ├── quotes.js             # GET /api/quotes?symbols=AAPL,MSFT -> batched quotes (watchlist/portfolio)
│   ├── history.js            # GET /api/history?symbol=AAPL&range=1M -> chart data
│   └── search.js             # GET /api/search?q=AAPL           -> ticker autocomplete
├── src/
│   ├── components/
│   │   ├── layout/          # Sidebar, TopBar, MobileNav, AuthButton, PageHeader, SignInPrompt
│   │   ├── dashboard/        # KpiRow
│   │   └── stock/            # SearchBar, StockDetailCard, StockLogo, PriceChart
│   ├── context/               # ThemeContext, AuthContext
│   ├── hooks/                 # data fetching + Firestore CRUD (see below)
│   ├── lib/                    # firebase.js, api.js (fetch wrappers around /api/*)
│   ├── pages/                  # DashboardPage, WatchlistPage, PortfolioPage, SettingsPage
│   ├── App.jsx                 # router + providers
│   └── main.jsx
├── firestore.rules            # paste into Firebase console -> Firestore -> Rules
└── .env.example                # copy to .env, fill in Twelve Data + Firebase config
```

**Hooks**: `useStockQuote`/`useStockHistory` (single-symbol, Dashboard detail
card), `useQuotes` (batched, Watchlist/Portfolio), `useWatchlist`/
`usePortfolio`/`useCash` (Firestore CRUD, realtime via `onSnapshot`),
`usePortfolioSummary` (derives total value, today's % change, best performer,
per-holding P/L from holdings + live quotes — shared by the Dashboard KPI row
and the Portfolio table).

**Data model** (Firestore): everything lives under `/users/{uid}` — the doc
itself holds `availableCash`, with `watchlist` and `holdings` subcollections
underneath. `firestore.rules` scopes all of it to `request.auth.uid`.

## Setup

1. **Get a free Twelve Data API key**: sign up at
   [twelvedata.com/pricing](https://twelvedata.com/pricing) (no credit card).
2. **Create a Firebase project** at [console.firebase.google.com](https://console.firebase.google.com):
   - Build → Authentication → enable the **Google** sign-in provider.
   - Build → Firestore Database → Create database (production mode). Note:
     Google now requires a billing account linked to create a Firestore
     database even on the free Spark plan — this is a fraud-prevention step,
     not a sign you'll be charged; usage stays free within Firestore's
     generous free-tier quotas for a personal app.
   - Paste the contents of `firestore.rules` into Firestore → Rules → Publish.
   - Project settings → Your apps → add a Web app → copy the `firebaseConfig`
     values (these are public client identifiers, not secrets — safe to
     commit; real security comes from `firestore.rules`).
3. **Install dependencies**:
   ```bash
   cd stock-tracker-dashboard
   npm install
   ```
4. **Add your config**:
   ```bash
   cp .env.example .env
   # then edit .env: paste your Twelve Data key and Firebase config values
   ```
5. **Install the Vercel CLI** (one-time, needed to run the serverless
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

## Phase 2 — what to test

Sign-in and data:
- [ ] Click **Sign in with Google** (top right) — a Google popup should
      appear and sign you in; your avatar/name should replace the button.
- [ ] Refresh the page — you should stay signed in.
- [ ] Sign out from the avatar menu, or Settings — confirm it actually signs
      you out (button reappears).

Watchlist:
- [ ] Add a ticker — it should appear in the list with a live price + % change.
- [ ] Refresh the page — the ticker should still be there (persisted to
      Firestore, not just local state).
- [ ] Remove a ticker — it should disappear immediately.
- [ ] Click a watchlist row — should take you to the Dashboard with that
      stock's detail card open.

Portfolio:
- [ ] Add a holding (ticker, quantity, avg buy price) — it should appear in
      the table with a computed current value, P/L $ and %, and weight.
- [ ] Add a second holding — weight % should recalculate across both.
- [ ] Remove a holding.

Settings:
- [ ] Set an Available Cash value, save, refresh — it should persist.

Dashboard KPI row (only visible once signed in with at least one holding):
- [ ] Total Portfolio Value, Today's Change %, Best Performer, and Available
      Cash should all show real numbers once you've added holdings.

General:
- [ ] Sign out, then visit Watchlist/Portfolio/Settings directly — each
      should show a "Sign in to..." prompt instead of breaking.
- [ ] Narrow the browser to phone width — a bottom tab bar should appear for
      navigation (the sidebar collapses).
- [ ] Refresh the page while on `/watchlist` or `/portfolio` directly (not
      just navigating via clicks) — it should load that page, not 404.

If something looks off, note which step and what you saw.

## Deploying to Vercel

This app lives in a subfolder of a larger repo, so when creating the Vercel
project:

1. Import the `app_projects_compilation` repo.
2. Set **Root Directory** to `stock-tracker-dashboard`.
3. Add these environment variables in Vercel's project settings (Settings →
   Environment Variables) — same values as your local `.env`:
   `TWELVE_DATA_API_KEY`, `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`,
   `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`,
   `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`.
4. In Firebase console → Authentication → Settings → Authorized domains, add
   your Vercel deployment's domain (e.g. `your-project.vercel.app`) — Google
   sign-in will fail on unauthorized domains.
5. Deploy. Vercel auto-detects Vite for the frontend and picks up `api/*.js`
   as serverless functions; `vercel.json` handles client-side route refreshes
   (e.g. loading `/watchlist` directly).

## Roadmap

- **Phase 3** (later): share access with a few people; possibly phone-number
  login. Not built yet, but the Firestore data model (`/users/{uid}/...`) and
  auth layer are kept simple enough to extend without a rewrite.
