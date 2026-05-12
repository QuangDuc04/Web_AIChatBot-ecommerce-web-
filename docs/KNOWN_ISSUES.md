# Known Issues

Accepted technical debt and known limitations in the current codebase.

---

## Accepted Configuration Debt

### No backend / order submission stub
**Status:** Accepted (by design for current phase)
The checkout page (`src/sections/Payment/`) is a UI stub. It collects shipping info and displays payment methods (ACB bank transfer, MoMo QR) but does not submit orders to any backend. Orders are fulfilled manually. This is acceptable for the current manual-order business model.

### No test suite
**Status:** Accepted (no test framework configured)
There are zero test files in the project. No Jest, Vitest, Playwright, or Cypress configuration exists. All verification is manual via local dev server. Adding tests is recommended before integrating a real order-submission backend.

### localStorage access is unguarded
**Status:** Known bug, low severity
`CartContext.tsx` reads from `localStorage` via `JSON.parse` without a try/catch block. A corrupted `packing_cart` key in localStorage will throw an uncaught exception, breaking the cart for that user until they clear localStorage. Fix: wrap the `JSON.parse` in try/catch and fall back to an empty array.

### No error boundaries
**Status:** Known gap
No React error boundaries are defined anywhere in the component tree. A runtime error in the cart drawer, product carousel, or any client component will propagate and crash the full React tree for the user's session.

### No Content Security Policy (CSP)
**Status:** Known gap, medium severity
`next.config.ts` does not define CSP headers. The app loads external resources (Google Maps embed, Cloudinary images, banhanggiasi.com.vn images) without an allowlist declared to the browser.

### Product data rebuild required for any content change
**Status:** Accepted (architectural decision)
All product, category, and news data is compiled into the bundle at build time. Any content update requires running the sync script + full rebuild + container redeployment. There is no CMS or hot-reload for content.

### Excel file committed to repository
**Status:** Under review
`Giay_in_nhiet_Hansol.xlsx` is tracked by git. If this file contains sensitive pricing margins or private supplier contacts, it represents a potential information disclosure. Evaluate whether it should be in `.gitignore` with data reconstructed from scrapers on demand.

### No HTTPS enforcement in app
**Status:** Accepted (handled at infrastructure layer)
The Next.js app does not enforce HTTPS redirects. HTTPS termination must be configured at the reverse proxy (nginx/Caddy) in front of the Docker container. This is intentional for the current deployment architecture.

### Checkout form has no input validation
**Status:** Known gap (low risk while no backend)
The checkout form fields (name, phone, email, address) have no client-side or server-side validation. This is currently low risk because the form does not submit to a backend, but must be addressed before any backend integration.

---

## Operational Notes

- Dev server port: **4000** (`npm run dev`)
- Docker container port: **3000** (map to any external port with `-p`)
- No environment variables required for local development
- `reactStrictMode` is **disabled** in `next.config.ts` — enable it to surface React lifecycle issues during development
