# app_projects_compilation
All apps and projects that I build to learn coding and UI designing while having fun.

## Projects

### [news-dashboard](news-dashboard/)
A self-updating news dashboard that scans for stories relevant to my work and interests and keeps them all in one place, organized into Finance, Work, Technology, Education, Projects, and Personal Interests sections. Features a Daily Brief, per-topic key points and importance labels, keyword watch/block preferences, bookmarks, read-later, and feedback-based ranking — all client-side, no backend. A GitHub Action re-scans every 3 hours and commits fresh stories automatically.

- **`news-dashboard/docs/`** — the web app.
- **`news-dashboard/scripts/`** — the fetch script (`fetch_news.py`) and topic config (`config.json`).
- **`.github/workflows/update-news-dashboard.yml`** — the scheduled scan.

To enable the live site: repo **Settings → Pages → Deploy from a branch → `main` / `/ (root)`**, then visit `https://isacsy.github.io/app_projects_compilation/news-dashboard/docs/`. (Root deploy is required since Pages only offers `/` or `/docs` as options, and this repo may hold multiple projects.)
