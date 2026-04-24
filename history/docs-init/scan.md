# Codebase Scan Report

## Project Type
Next.js 15 + React 19 + TypeScript — single-package frontend e-commerce application

## Structure
```
paper-web/
├── src/
│   ├── app/                          (Next.js App Router pages)
│   │   ├── [categorySlug]/           (dynamic category pages)
│   │   ├── [categorySlug]/[productSlug]/  (dynamic product detail pages)
│   │   ├── chinh-sach-doi-tra/      (return/exchange policy page)
│   │   ├── chinh-sach-kiem-hang/    (quality check policy page)
│   │   ├── chinh-sach-van-chuyen/   (shipping policy page)
│   │   ├── dich-vu-in-an/           (printing service page)
│   │   ├── gio-hang/                (cart page)
│   │   ├── hinh-thuc-thanh-toan/    (payment methods page)
│   │   ├── lien-he/                 (contact page)
│   │   ├── san-pham/                (products page)
│   │   ├── thanh-toan/              (checkout page)
│   │   ├── tin-tuc/                 (news page)
│   │   └── layout.tsx               (root layout)
│   ├── components/                   (reusable React components)
│   │   ├── CategoriesWidget/
│   │   ├── ChatBox/
│   │   ├── Footer/
│   │   ├── Header/ (Navbar, NavbarMobile)
│   │   ├── Product/
│   │   ├── SlideCart/
│   │   ├── SupportButtons/
│   │   └── ui/ (Button, Input)
│   ├── sections/                     (page-level section components)
│   │   ├── Cart/
│   │   ├── Categories/
│   │   ├── Home/ (FlashSale, HeroSection, News, RegisterPromotions, Welcome, WhyChooseUs)
│   │   ├── Payment/
│   │   └── ProductDetail/
│   ├── config/
│   │   └── constants.ts             (product catalog, app config, interfaces)
│   ├── context/
│   │   └── CartContext.tsx          (shopping cart state management)
│   ├── hooks/
│   │   ├── useScrollAnimation.ts
│   │   └── useWindowScrollPositions.ts
│   └── utils/
│       └── priceFormatter.ts
├── scripts/                          (Node.js data sync utilities)
│   ├── sync-products.js             (Excel → constants.ts sync)
│   ├── excel-to-src.js
│   ├── scrape-hansol.js
│   ├── scrape-oji.js
│   ├── scrape-decal.js
│   ├── debug-excel.js
│   └── generated-products.ts
├── public/                           (static assets, images, QR codes)
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── Dockerfile
└── README.md (default Next.js template only)
```

## Key Directories
| Directory | Purpose |
| --------- | ------- |
| src/app/ | Next.js App Router pages with Vietnamese URL slugs |
| src/components/ | Reusable React UI components |
| src/sections/ | Page-level section components for complex layouts |
| src/config/ | Product catalog, category definitions, app metadata, interfaces |
| src/context/ | React Context API for shopping cart state |
| src/hooks/ | Custom React hooks (scroll animation, scroll position) |
| src/utils/ | Utility functions (price formatting) |
| scripts/ | Node.js utilities for syncing product data from Excel files |
| public/ | Static assets (images, logos, QR codes for payment) |

## Existing Docs
- README.md: exists (default Next.js template — no project-specific content)
- AGENTS.md: missing
- CLAUDE.md: missing
- docs/: missing

## Entry Points
- src/app/page.tsx — Home page (main entry)
- src/app/layout.tsx — Root layout (Header, Footer, CartProvider, ChatBox)
- next.config.ts — Next.js configuration (standalone output, Cloudinary images)
- Development: `npm run dev` (port 4000, Turbopack)
- Production: `npm run build` && `npm start`
- Docker: Dockerfile with Node 18 Alpine, non-root nextjs user

## Dependencies
**Production:**
- next@15.5.4, react@19.1.0, react-dom@19.1.0
- lucide-react@0.544.0 (icons)
- swiper@12.0.2 (carousel/slider)

**Development:**
- typescript@5, tailwindcss@4, sass@1.93.2
- eslint@9 + eslint-config-next
- axios@1.13.6 (used in scripts)
- cheerio@1.2.0 (HTML scraping in scripts)
- exceljs@4.4.0 (Excel parsing in scripts)

## Security Signals
- Handles payment data: yes (manual bank transfer ACB, Momo QR — no card processing, no Stripe)
- Handles health/medical data: no
- Has user accounts/PII: yes (name, phone, email, address collected in checkout form)
- Has multi-tenancy: no (single shop: Natro)
- Serves EU users: no
- Serves Vietnamese users: yes (fully Vietnamese — lang="vi", VND currency, Vietnamese routes, NĐ 13/2023 applies)
