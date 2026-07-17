# News Dashboard

A self-updating news dashboard that scans for stories relevant to my work and interests and keeps them all in one place, organized into **Finance, Work, Technology, Education, Projects, and Personal Interests**.

### Features
- **Daily Brief** at the top summarizing the most important recent stories (window is adjustable: last hour / day / week).
- **News cards** with headline, source, time, extractive key points, and a "why recommended" note showing which topic(s) matched.
- **Section tabs**, source filter, importance filter (High/Medium/Low), and search.
- **Preferences** (gear icon): keywords/companies/locations to *watch* (ranked higher) and to *block* (hidden), plus the Daily Brief time window. Stored per-browser (no account/backend).
- **Bookmarks** and **Read Later**, with dedicated views.
- **Feedback**: "More like this" / "Not relevant" buttons nudge future ranking via a simple per-topic weight, so the feed adapts over time.
- **Notifications** (bell icon): browser notifications for new High-importance or watch-keyword stories while the dashboard is open in a tab — there's no backend, so this doesn't fire while the browser itself is closed.

### How it's built
- **`docs/`** — the static web app (`index.html`/`styles.css`/`app.js`).
- **`scripts/fetch_news.py`** — pulls stories per topic/section from Google News and finance RSS feeds, drops blocklisted stories, dedupes across topics, and generates key points / importance / a Daily Brief using deterministic rules (no external AI calls, so it runs free with no API key).
- **`scripts/config.json`** — the sections, topics, RSS/Google-News queries, and a server-side blocklist. Edit this to change what gets scanned in the background.
- **`../.github/workflows/update-news-dashboard.yml`** — a GitHub Action that runs the fetch script every 3 hours and commits any changes, so the feed refreshes automatically with no server to maintain.

To run it locally:
```bash
pip install requests
python3 scripts/fetch_news.py   # writes docs/data/news.json
python3 -m http.server 8000 --directory docs
```
