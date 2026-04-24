# AGENTS.md

Development guidelines for agents and engineers working on the paper-web (Natro) codebase.

---

## Project Overview

**Natro** is a Vietnamese e-commerce storefront selling thermal print paper (Hansol, Oji), decal labels, and printing supplies. The site is fully static — all product and category pages are pre-rendered at build time using Next.js App Router SSG. There is no backend API and no database. All product data is stored as TypeScript arrays in `src/config/constants.ts`, which is populated by a Node.js data-sync pipeline.

**Business context:** The shop targets Vietnamese B2B and B2C customers. Payment is manual (ACB bank transfer, MoMo QR scan). Orders are processed offline. The checkout page is currently a UI stub.

---

## Structure

```
src/
├── app/          # Next.js App Router — routing, metadata, page shells (Server Components)
├── sections/     # Page-level composite components (one Section = one visual region of a page)
├── components/   # Reusable UI primitives (cards, buttons, cart drawer, header, footer)
├── config/
│   ├── constants.ts   # CANONICAL DATA: IProduct[], ICategory[], INews[], app metadata
│   └── data.ts        # Lookup helpers: getCategoryBySlug, getProductBySlug, etc.
├── context/
│   └── CartContext.tsx  # CartProvider + cartReducer + useCart hook
├── hooks/         # Custom React hooks (useScrollAnimation, useWindowScrollPositions)
└── utils/
    └── priceFormatter.ts  # VND currency formatter

scripts/           # Node.js data pipeline (not part of Next.js build)
├── sync-products.js     # PRIMARY: Excel tabs → constants.ts
├── scrape-hansol.js     # Scrape Hansol thermal paper → Excel
├── scrape-oji.js        # Scrape Oji bill paper → Excel
├── scrape-decal.js      # Scrape decal labels → Excel
└── debug-excel.js       # Diagnostic: print Excel column headers

public/            # Static assets (images, logos, QR code images for payment)
docs/              # Architecture, security, coding standards, known issues
```

---

## Commands

| Command | Purpose |
| ------- | ------- |
| `npm run dev` | Start dev server on **port 4000** with Turbopack |
| `npm run build` | Build production bundle (Turbopack) |
| `npm start` | Run the production server |
| `npm run lint` | Run ESLint |
| `npm run sync` | Sync Excel product data → `src/config/constants.ts` |
| `node scripts/scrape-hansol.js` | Scrape Hansol products from supplier site → Excel |
| `node scripts/scrape-oji.js` | Scrape Oji products from supplier site → Excel |
| `node scripts/scrape-decal.js` | Scrape decal label products from supplier site → Excel |
| `node scripts/debug-excel.js` | Print Excel column headers (diagnostic) |
| `docker build -t paper-web .` | Build Docker image |
| `docker run -p 3000:3000 paper-web` | Run production container |

---

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full breakdown. Summary:

**Four key decisions:**
1. **Static-first, no-database** — all content compiled into the JS bundle at build time.
2. **Full SSG** — `generateStaticParams()` pre-renders all category and product pages.
3. **Client components only where required** — `'use client'` is used only for browser APIs (cart drawer, scroll, IntersectionObserver, contact page geolocation).
4. **Manual data pipeline** — products come from web scraping → Excel → sync script → rebuild.

**Component layers (top to bottom):**
- `src/app/` — Route shells: URL resolution, generateMetadata(), generateStaticParams(), data lookup, pass props down. Never contains markup beyond mounting a section.
- `src/sections/` — Page-section composites: full visual regions of a page (e.g., HeroSection, FlashSale, CheckoutPage). Not reused across pages.
- `src/components/` — Reusable primitives: Product cards, SlideCart, Header, Footer, AnimateOnScroll, Breadcrumb, etc.

**State:** Single `CartContext` for the shopping cart (useReducer + localStorage). All other state is local `useState`. No Redux, Zustand, or external state library.

**Rendering:** SSG for all product/category pages. Client Components only where interactivity requires it. `output: 'standalone'` in `next.config.ts` for Docker deployment.

---

## Patterns & Conventions

### Naming

| Element | Convention | Example |
| ------- | ---------- | ------- |
| Component directories | PascalCase | `SlideCart/`, `HeroSection/` |
| Component entry | `index.tsx` | `SlideCart/index.tsx` |
| Hook files | `use` prefix, camelCase | `useScrollAnimation.ts` |
| Utility files | camelCase | `priceFormatter.ts` |
| App Router routes | kebab-case (Vietnamese URL slugs) | `gio-hang/`, `thanh-toan/` |
| TypeScript interfaces | `I` prefix, PascalCase | `IProduct`, `ICategory`, `ISlideCart` |
| Constants / enum values | SCREAMING_SNAKE_CASE | `ACTION_TYPES.ADD_PRODUCT`, `CART_STORAGE_KEY` |
| Local variables | camelCase | `cartItems`, `isOpen` |

### Component authoring

- **Default export** for every component. Named exports for hooks, context providers, and utilities.
- Add `'use client'` at the top of any component that uses `useState`, `useEffect`, `useReducer`, browser APIs, or event handlers.
- Declare the props interface inline above the component function: `interface IMyComponent { ... }`.
- Sub-components that are only used inside one parent go in the same `index.tsx` file.
- Consume context via the `useCart()` custom hook — never import `CartContext` directly.
- All images use `next/image`. All navigation links use `next/link`.
- Icons come from `lucide-react`. Do not add a new icon library.

### Styling

- **Tailwind CSS v4** is the primary styling method. Use utility classes in `className` props.
- **Custom design tokens** (defined in `tailwind.config.ts`):
  - Colors: `text-main` (#232323), `text-blue-main` / `bg-blue-main` (#1fb0a8), `text-red-1`, `bg-blue-1/2/3`
  - Breakpoints: `@lg` (512px), `@4xl` (820px), `@5xl` (992px)
  - Font: Lexend Deca (set globally)
- **SCSS** is used only for animation side-effect styles (e.g., `.open`, `.overlay` on the cart drawer) and for co-located styles that cannot be expressed cleanly in Tailwind.
- **CSS Modules** (`styles.module.scss`) are used only for shared UI primitives (`ui/Button`, `ui/Input`).
- Use Tailwind tokens over arbitrary values (`text-main` over `text-[#232323]`).

### Error handling

- Custom hooks must throw a descriptive error when used outside their provider: `throw new Error('useCart must be used within a CartProvider')`.
- The `cartReducer` default case must throw: `throw new Error('Unhandled action type: ' + action.type)`.
- Wrap `JSON.parse(localStorage.getItem(...))` in try/catch and fall back to a safe default.
- Add React error boundaries around the cart drawer and product carousel (currently missing — see [docs/KNOWN_ISSUES.md](docs/KNOWN_ISSUES.md)).

### TypeScript

- Never use `any` without a comment justifying it.
- Prefix component props interfaces with `I`: `IProductCard`, `ISlideCart`.
- Use discriminated union types for reducer actions.
- Use `satisfies Config` for configuration objects (Tailwind, etc.).
- Generic type parameters in hooks: `useScrollAnimation<T extends HTMLElement>`.

---

## Cart State API

**Provider:** `CartProvider` wraps the app at root layout. Consuming components call `useCart()`.

```ts
const {
  carts,                  // ProductItemCart[] — current cart items
  isSliderCartOpen,       // boolean — whether the slide-out drawer is open
  dispatch,               // React.Dispatch<CartAction>
  handleOpenCartSlider,   // (isOpen: boolean) => void
} = useCart();
```

**Action types** (from `ACTION_TYPES` enum):

| Action | Payload | Effect |
| ------ | ------- | ------ |
| `ADD_PRODUCT` | `{ product: IProduct, quantity: number }` | Adds product or increments quantity |
| `REMOVE_PRODUCT` | `{ productId }` | Removes item from cart |
| `UPDATE_QUANTITY` | `{ productId, quantity }` | Sets item quantity |
| `UPDATE_CART` | `CartItem[]` | Replaces entire cart array |
| `CLEAR_CART` | — | Empties the cart |
| `INITIALIZE_CART` | `CartItem[]` | Hydrates cart from localStorage on mount |
| `ADD_TO_DETAIL` | — | (Detail page specific) |

**Persistence:** Cart state is written to `localStorage` under key `packing_cart` on every state change, and read back on mount via `INITIALIZE_CART`.

---

## Data Pipeline

To update the product catalog:

```
1. Scrape:   node scripts/scrape-hansol.js  (or oji / decal)
2. Inspect:  node scripts/debug-excel.js
3. Sync:     npm run sync    → overwrites products/categories in constants.ts
4. Verify:   npm run build   → TypeScript compile check
5. Test:     npm run dev     → browse to product/category pages
6. Deploy:   docker build + docker run
```

**constants.ts is the source of truth** for all displayed data. It is safe to edit manually for metadata, news, and app-wide config. The products/categories arrays are overwritten by `npm run sync` — manual edits to those arrays will be lost on the next sync.

---

## Development Workflow

### Adding a new product
Edit the Excel file directly (or run the relevant scraper), then `npm run sync` + `npm run build`.

### Adding a new category
Add a row to the Excel categories tab, run `npm run sync`. The new category page is auto-generated via `generateStaticParams()` — no code changes needed unless you want a custom hero image.

### Adding a news article
Directly add an `INews` object to the `news` array in `src/config/constants.ts`. No sync script exists for news.

### Adding a new page
Create a directory in `src/app/` following the existing kebab-case Vietnamese slug pattern. Add `page.tsx` (Server Component by default) that calls `generateMetadata()` and mounts a section component from `src/sections/`.

### Updating site metadata (phone, social links, address)
Edit the `app` constant object in `src/config/constants.ts` directly. Rebuild to apply.

---

## Language Policy

Conversation may be in any language. All content written to files (docs, comments, changelogs, reports, etc.) must always be in **English** unless explicitly requested otherwise.
