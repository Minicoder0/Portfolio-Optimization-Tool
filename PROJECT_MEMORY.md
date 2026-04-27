# PROJECT MEMORY — PortfolioIQ
Last Updated: 2026-04-26
Current Phase: 5
Status: Complete

---

## PHASE 1 — Rough Sketch

PortfolioIQ is an educational portfolio optimization web app for beginner investors.
It helps users pick stocks, run Markowitz mean-variance optimization, and understand results in plain language or advanced math mode.

### Target Users
- Beginner investors
- Students learning portfolio theory
- Intermediate users wanting transparent optimization metrics

### Core Features (Must-Have)
- Account auth and protected dashboard
- Stock search and ticker selection
- Date-range based optimization run
- Portfolio allocation results with charts and summary metrics
- Beginner and Advanced display modes
- Save and reopen portfolio snapshots
- Portfolio history and basic comparison

### Proposed Stack
- Frontend: Next.js 14 App Router + Tailwind CSS + Recharts
- Backend: FastAPI + pypfopt + yfinance
- Auth + Data: Firebase Authentication + Firestore
- Deployment: Vercel (frontend) + Railway (backend)

### Out of Scope
- Real brokerage integrations and trade execution
- Paid tier billing and subscriptions
- Full institutional analytics tooling

---

## PHASE 2 — Blueprint

Status: Complete and approved for implementation based on user instruction to execute the attached plan.

### Folder and File Structure
```
portfolioiq/
├── app/
│   ├── page.tsx
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── dashboard/page.tsx
│   ├── history/page.tsx
│   ├── glossary/page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── api/
│       └── stocks/search/route.ts
├── components/
│   ├── auth/
│   ├── dashboard/
│   ├── charts/
│   ├── results/
│   └── ui/
├── hooks/
├── lib/
│   ├── firebase.ts
│   ├── auth.ts
│   ├── types.ts
│   ├── constants.ts
│   ├── utils.ts
│   ├── fmp.ts
│   ├── portfolio.ts
│   └── firestore/
│       └── portfolios.ts
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── app/
│       ├── schemas.py
│       ├── optimizer.py
│       └── market_data.py
└── PROJECT_MEMORY.md
```

### Firestore Data Models
- `users/{uid}`
  - `name: string`
  - `email: string`
  - `createdAt: Timestamp`
  - `modePreference: "beginner" | "advanced"`
- `users/{uid}/portfolios/{portfolioId}`
  - `name: string`
  - `tickers: string[]`
  - `dateRange: { startDate: string, endDate: string, preset?: "1Y" | "3Y" | "5Y" | "custom" }`
  - `weights: Record<string, number>`
  - `metrics: { expectedReturn: number, volatility: number, sharpe: number }`
  - `stockStats: Array<{ ticker: string, expectedReturn: number, volatility: number, riskLevel: string }>`
  - `modeAtSave: "beginner" | "advanced"`
  - `investmentAmount: number`
  - `createdAt: Timestamp`
  - `updatedAt: Timestamp`

### API Contract (FastAPI)
- `GET /health`
  - `200`: `{ "status": "ok" }`
- `POST /optimize`
  - Request:
    - `tickers: string[]` (2-10 symbols)
    - `startDate: string` (YYYY-MM-DD)
    - `endDate: string` (YYYY-MM-DD)
  - Response:
    - `weights: Record<string, number>`
    - `metrics: { expectedReturn: number, volatility: number, sharpe: number }`
    - `stockStats: Array<{ ticker: string, expectedReturn: number, volatility: number }>`
    - `diversificationScore: number`
    - `correlationMatrix: Record<string, Record<string, number>>`
    - `frontier: Array<{ risk: number, return: number }>`
    - `randomPortfolios: Array<{ risk: number, return: number, sharpe: number }>`

### Next API Route Contract (Search Proxy)
- `GET /api/stocks/search?query=...`
  - Proxies Financial Modeling Prep search endpoint.
  - Returns normalized array:
    - `symbol: string`
    - `name: string`
    - `exchangeShortName?: string`
    - `type?: string`

### Auth Flow
- Email/password and Google auth via Firebase Auth.
- Middleware-like guards implemented in shared layout/hooks:
  - Unauthenticated access to `dashboard`/`history` redirects to `login`.
  - Authenticated access to `login`/`signup` redirects to `dashboard`.
- On first login/signup:
  - Create or upsert `users/{uid}` profile document.
- Logout clears session and returns user to landing page.

### Environment Variables
- Frontend:
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`
  - `NEXT_PUBLIC_API_BASE_URL`
  - `FMP_API_KEY`
- Backend:
  - `CORS_ORIGINS`
  - `PORT`

---

## PHASE 3 — Skeleton
### Files Created
- `package.json` — Frontend dependency and script setup for Next.js.
- `tsconfig.json`, `next-env.d.ts`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs` — TypeScript and styling build configuration.
- `app/layout.tsx`, `app/providers.tsx`, `app/globals.css` — Root app shell and global styling.
- `middleware.ts` — Route protection for auth and dashboard/history access.
- `lib/firebase.ts`, `hooks/useAuth.tsx`, `hooks/useMode.ts` — Firebase auth wiring and session state hooks.
- `backend/main.py`, `backend/app/*`, `backend/requirements.txt` — FastAPI health and optimizer service skeleton with core optimization path.
- `app/login/page.tsx`, `app/signup/page.tsx`, `app/dashboard/page.tsx`, `app/history/page.tsx`, `app/glossary/page.tsx` — Primary route placeholders.

## PHASE 4 — Plaster
### Features Implemented
- Landing page hero, concept cards, and workflow section.
- Email/password auth, Google auth, password reset trigger, logout button.
- Protected routing behavior via middleware session cookie checks.
- Stock search proxy route (`/api/stocks/search`) + ticker selection chips and constraints.
- Date-range presets and manual date picker flow.
- FastAPI `/optimize` endpoint with yfinance data fetch, pypfopt max-sharpe optimization, cleaned weights, metrics, frontier, and random portfolios.
- Results rendering with pie chart, bar chart, performance summary cards, diversification score, weight table, and sorting controls.
- Beginner/Advanced mode toggle persistence (localStorage + Firestore sync).
- Advanced raw data table with CSV export.
- Firestore save portfolio flow and history list with sort/filter/rename/delete + basic compare verdict.
- Glossary page with beginner-friendly definitions.

## PHASE 5 — Interior
### Polish Log
- Unified terminal-themed styling utilities and reusable card/button/input classes.
- Responsive layout behavior across route pages and dashboard sections.
- README getting-started commands aligned with the current repo layout.
- Added frontend and backend env example files for faster local setup.
- V2 UI redesign applied: Dark Emerald design system with Geist + Inter fonts.
- New `tailwind.config.ts` with surface color palette, card shadows, font families.
- New `globals.css` with v2-card, pill-toggle, chip, badge, v2-table, metric-value utilities.
- Rebuilt `site-shell.tsx` with sticky glassmorphic navbar, mobile hamburger menu, and minimal footer.
- Rebuilt `app/page.tsx` landing page with hero glow effect, floating concept cards, numbered steps.
- Rebuilt `login-form.tsx` and `signup-form.tsx` with centered floating card, Google SVG icon, password visibility toggle, strength indicator.
- Rebuilt `optimizer-workspace.tsx` with step labels, search icon input, pill date presets, emerald accent tables.
- Rebuilt `performance-summary.tsx` with color-coded metrics, info tooltips in beginner mode, monospace values.
- Rebuilt chart components with dark-themed tooltips and V2 color palette.
- Rebuilt `history-workspace.tsx` with verdict badges, color-coded left borders, inline metrics, empty state illustration.
- Created `glossary/page.tsx` with alphabetical sections, search bar, and floating definition cards.
- Installed `geist` font package for headline and monospace typography.

---

## CHANGE LOG
- 2026-04-25 — Set README as source-of-truth product spec and started phased execution plan — User requested — Phase 1/2
- 2026-04-25 — Added full Phase 2 blueprint (structure, models, contracts, auth, env vars) — User requested — Phase 2
- 2026-04-25 — Implemented Next.js + Firebase frontend and FastAPI optimizer backend scaffold and core feature set — User requested — Phase 3/4
- 2026-04-25 — Applied responsive polish and setup alignment updates — User requested — Phase 5
- 2026-04-26 — Applied V2 Dark Emerald UI redesign across all pages and components — User requested — Phase 5

## OPEN QUESTIONS
- [ ] What is the Financial Modeling Prep tier/API limit for search suggestions?
- [ ] Which Firebase project ID and app credentials should be used for production?
- [ ] What backend Railway service URL should be treated as production API base?

## DECISIONS MADE
- 2026-04-25 Decision: README product spec is the implementation target for this repository.
- 2026-04-25 Decision: Existing `app.py` is treated as reference optimization logic, not production architecture.
- 2026-04-25 Decision: Repository follows a Next.js + FastAPI monorepo layout with Firebase-backed persistence.
