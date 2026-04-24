# Natro — Giấy in hóa đơn, Tem decal, Máy in đơn hàng

Vietnamese e-commerce storefront for thermal print paper, decal labels, and printing supplies. Built with Next.js 15 + React 19 + TypeScript. All product pages are statically generated at build time — no database, no runtime API.

## Features

- Static-generated product catalog from Excel data (zero runtime DB queries)
- Shopping cart with localStorage persistence and slide-out drawer
- Vietnamese-language UI (`vi-VN` locale, VND currency)
- Docker-ready standalone deployment (Node.js 18 Alpine)
- Data pipeline: scrape supplier site → Excel → sync script → rebuild

## Quick Start

```bash
npm install
npm run dev        # starts on http://localhost:4000
```

No environment variables are required for local development.

## Commands

| Command | Purpose |
| ------- | ------- |
| `npm run dev` | Start dev server on port 4000 (Turbopack) |
| `npm run build` | Build production bundle |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint |
| `npm run sync` | Sync product data from Excel → `src/config/constants.ts` |

## Data Pipeline (updating products)

Product data lives in `src/config/constants.ts` and is compiled into the bundle at build time. To update:

```bash
# 1. Scrape fresh data from supplier site (choose the relevant scraper)
node scripts/scrape-hansol.js
node scripts/scrape-oji.js
node scripts/scrape-decal.js

# 2. Sync Excel → constants.ts
npm run sync

# 3. Rebuild and redeploy
npm run build
```

## Docker Deployment

```bash
docker build -t paper-web .
docker run -p 3000:3000 paper-web
```

The container runs on port 3000 as a non-root user (`nextjs:nodejs`). Place a reverse proxy (nginx/Caddy) in front to handle HTTPS.

## Documentation

- [Architecture](docs/ARCHITECTURE.md) — system design, layers, rendering strategy
- [Development Guide](AGENTS.md) — conventions, workflows, component model

## Tech Stack

| Concern | Technology |
| ------- | ---------- |
| Framework | Next.js 15.5.4 (App Router) |
| Language | TypeScript 5 |
| UI | React 19 |
| Styling | Tailwind CSS v4 + SCSS |
| State | React Context + useReducer |
| Build | Turbopack |
| Deployment | Docker (Next.js standalone) |
