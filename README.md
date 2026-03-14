# NiSoko NSE Dashboard

A React single-page application for viewing live Nairobi Securities Exchange market data, powered by the NiSoko API.

## Prerequisites

- Node.js 18+ and npm
- A running instance of `nse_api` (default: `http://localhost:38000`)
- A NiSoko API key (FREE plan or higher)

## Setup

```bash
cd nse_dashboard
npm install
```

Copy the example env file and set your API base URL if it differs from the default:

```bash
cp .env.example .env.local
# Edit .env.local if your API is not on localhost:38000
```

## Running

```bash
npm run dev
```

Opens at **http://localhost:5173**

The Vite dev server proxies all `/api/*` requests to `http://localhost:38000`, so no CORS configuration is needed during development.

## Building for production

```bash
npm run build       # outputs to dist/
npm run preview     # preview the production build locally
```

For production, point the reverse proxy (nginx, Caddy, etc.) at the built `dist/` folder and proxy `/api/*` to the API server.

## Usage

1. Enter your NiSoko API key in the header to load market data
2. Click any row in the market table to see the full OHLC detail panel
3. Use the **Movers** sidebar tabs to view top gainers, losers, and volume leaders (requires STARTER plan or higher)
4. Toggle dark/light theme with the button in the top-right corner
5. Set the auto-refresh interval (30s / 1m / 2m) or turn it off

## Project structure

```
src/
├── api/client.ts          # Typed fetch wrapper — adds X-API-Key header
├── hooks/                 # React Query hooks for snapshot + movers data
├── components/
│   ├── Header.tsx         # Branding, API key input, controls
│   ├── StatsBar.tsx       # Market-wide counters (gainers, losers, volume)
│   ├── MoversPanel.tsx    # Gainers / Losers / Volume sidebar
│   ├── MarketTable.tsx    # Sortable, searchable stock table
│   └── StockDetail.tsx    # OHLC detail card (shown on row click)
├── types/index.ts         # TypeScript types aligned with API schemas
└── utils/format.ts        # Number formatters (price, volume, turnover)
```
