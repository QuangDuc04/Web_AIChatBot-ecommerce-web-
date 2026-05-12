# Architecture

## Overview

paper-web is a Vietnamese e-commerce storefront (brand: **Natro**) built as a statically generated Next.js application. There is no database and no backend API — all product, category, and news content is compiled into the JavaScript bundle at build time from a TypeScript configuration file that is maintained via a Node.js data-sync pipeline.

The app is deployed as a Docker container running the Next.js standalone server. A reverse proxy (nginx/Caddy) should sit in front to handle HTTPS and port 80/443.

---

## Key Architectural Decisions

### 1. Static-first, no-database architecture

All content (products, categories, news) lives in `src/config/constants.ts` as typed TypeScript arrays. There is no CMS, no database, and no runtime content API. Data is refreshed by running Node.js scripts that parse Excel files and overwrite `constants.ts`, then rebuilding the Next.js bundle.

**Trade-off accepted:** Any content change requires a full rebuild + redeploy. This is acceptable for the current update frequency (product catalog changes weekly or monthly).

### 2. Full SSG via App Router

`generateStaticParams()` pre-renders all dynamic routes (category pages and product detail pages) at build time. Server Components handle data lookup and pass props to section components. This yields fast page loads and strong SEO without needing a CDN caching layer.

### 3. Client Components minimal surface

`'use client'` is applied only to components that require browser APIs: the cart drawer (open/close), scroll detection hooks, IntersectionObserver animations, and the checkout form. All page shells and section components are Server Components by default.

### 4. Manual data pipeline

Product data originates from the supplier website banhanggiasi.com.vn, scraped by Node.js scripts into Excel files. A sync script transforms Excel rows into TypeScript constant blocks written directly into `constants.ts`. The pipeline is entirely manual and script-driven.

---

## Component Layers

```
┌──────────────────────────────────────────────────────────────┐
│  src/app/                  ROUTE SHELL LAYER                  │
│  Server Components                                            │
│  • URL resolution + generateStaticParams() for SSG            │
│  • generateMetadata() for per-page SEO                        │
│  • Slug → data lookup via src/config/data.ts                  │
│  • notFound() if slug not found                               │
│  • Mounts one or more Section components                      │
└──────────────────────────────────────────────────────────────┘
           │ passes data as props
           ▼
┌──────────────────────────────────────────────────────────────┐
│  src/sections/              PAGE SECTION LAYER                │
│  Large page-specific composites (not reused across pages)     │
│  • HeroSection — banner carousel + category cards            │
│  • FlashSaleSection — promotional product grid (Server Component) │
│  • ProductDetail — image gallery + ActionAddCart             │
│  • CheckoutPage — shipping form + payment method display      │
│  • CategoriesPage, CartPage, NewsSection, etc.               │
└──────────────────────────────────────────────────────────────┘
           │ composes
           ▼
┌──────────────────────────────────────────────────────────────┐
│  src/components/            REUSABLE COMPONENT LAYER          │
│  General-purpose UI units reused across sections and pages    │
│  • Header / Navbar / NavbarMobile                            │
│  • Footer                                                     │
│  • Product (product card)                                    │
│  • SlideCart (slide-out drawer)                              │
│  • CategoriesWidget (sidebar category list)                  │
│  • AnimateOnScroll (IntersectionObserver entrance animation)  │
│  • Breadcrumb                                                │
│  • ChatBox, SupportButtons, ButtonScrollOnTop                │
│  • ui/Button, ui/Input                                       │
└──────────────────────────────────────────────────────────────┘
```

**Cross-cutting (available anywhere):**
- `src/context/CartContext.tsx` — global cart state, injected at root layout
- `src/config/constants.ts` + `data.ts` — static data, imported by server components
- `src/hooks/` — shared behavioral logic
- `src/utils/priceFormatter.ts` — VND currency formatting

---

## Data Flow

```
[Excel file]
     │
     │  npm run sync
     │  (scripts/sync-products.js)
     ▼
[src/config/constants.ts]  ←── also edited directly for news, metadata
     │
     │  next build --turbopack
     │  (generateStaticParams reads arrays)
     ▼
[Pre-rendered HTML pages]
     │
     │  HTTP request
     ▼
[Server Component (app/)]
     │  imports from data.ts (slug lookup)
     │  passes IProduct / ICategory as props
     ▼
[Section Component (sections/)]
     │  composes layout
     ▼
[Component Layer (components/)]
     │  interactive components read from useCart()
     ▼
[CartContext (localStorage persistence)]
```

**Cart state flow (client-side only):**
```
User action (click "Add to cart")
     │
     │  dispatch(ACTION_TYPES.ADD_PRODUCT, { product, quantity })
     ▼
[cartReducer]  →  new state
     │
     ├─▶  localStorage.setItem('packing_cart', JSON.stringify(newState))
     └─▶  React re-render → cart count in Header updated
```

---

## Directory Reference

| Path | Purpose |
| ---- | ------- |
| `src/app/` | Next.js App Router pages — routing, metadata, SSG params |
| `src/app/layout.tsx` | Root shell: CartProvider, Header, Footer, JSON-LD schema |
| `src/app/[categorySlug]/` | Dynamic category listing route |
| `src/app/[categorySlug]/[productSlug]/` | Dynamic product detail route |
| `src/sections/` | Page-specific section composites |
| `src/components/` | Reusable UI components |
| `src/config/constants.ts` | **Canonical data store** — all products, categories, news, app config |
| `src/config/data.ts` | Lookup utilities (find by slug/id) |
| `src/context/CartContext.tsx` | Cart state: reducer, actions, useCart hook |
| `src/hooks/` | useScrollAnimation, useWindowScrollPositions |
| `src/utils/priceFormatter.ts` | VND currency formatter |
| `scripts/` | Node.js data pipeline (not part of Next.js build) |
| `public/` | Static assets: images, logos, payment QR codes |
| `next.config.ts` | Standalone output, image domain whitelist |
| `Dockerfile` | Multi-stage Docker build (Node 18 Alpine) |

---

## Rendering Strategy

| Page type | Strategy | Notes |
| --------- | -------- | ----- |
| Home page (`/`) | SSG | Static at build time |
| Category pages (`/[categorySlug]`) | SSG | `generateStaticParams()` enumerates all category slugs |
| Product pages (`/[categorySlug]/[productSlug]`) | SSG | `generateStaticParams()` enumerates all product slugs |
| Policy pages | SSG | Fully static content |
| Cart (`/gio-hang`) | SSG shell + Client hydration | Cart items loaded from localStorage |
| Checkout (`/thanh-toan`) | SSG shell + Client hydration | Form is a Client Component |
| Contact (`/lien-he`) | SSG shell + Client hydration | Uses browser Geolocation API to show user coordinates |
| News article | SSG | `generateStaticParams()` enumerates news slugs |

All pages are pre-rendered at build time. No server-side rendering (SSR) at request time. No API routes.

---

## External Dependencies

| Dependency | Purpose | Configuration |
| ---------- | ------- | ------------- |
| Cloudinary (`res.cloudinary.com`) | Remote image CDN | Whitelisted in `next.config.ts`; not yet actively used |
| banhanggiasi.com.vn | Product image source (scraped) | Whitelisted in `next.config.ts` |
| Google Maps Embed | Shop location on contact page | Embedded via iframe in `src/app/lien-he/page.tsx` |
| Browser Geolocation API | Show user's current coordinates on contact page | `navigator.geolocation` in `src/app/lien-he/page.tsx` (Client Component) |
| ACB Bank | Payment method (manual transfer) | Account number + QR code in `src/sections/Payment/` |
| MoMo | Payment method (QR scan) | Static QR image in `public/assets/commons/qr_momo.jpg` |
| Zalo / Facebook Messenger | Customer support links | URLs in `src/config/constants.ts` |
| Shopee / Lazada / Tiki | Marketplace storefront links | URLs in `src/config/constants.ts` |

---

## Deployment Architecture

```
[Internet]
    │ HTTPS
    ▼
[Reverse Proxy: nginx/Caddy]   ← handles HTTPS, port 80/443 → 3000
    │ HTTP
    ▼
[Docker container: paper-web]
    │ node server.js (Next.js standalone)
    │ port 3000, user: nextjs:nodejs
    ▼
[Pre-rendered static HTML + client JS bundle]
```

**Docker build stages:**
1. `deps` — install production dependencies
2. `builder` — run `next build`, produce `.next/standalone`
3. `runner` — copy only `standalone/`, `static/`, `public/` into lean Alpine image

No database, no Redis, no external services required at runtime.
