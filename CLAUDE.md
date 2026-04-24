# Claude Code Project Configuration — paper-web (Natro)

> **This is one of 3 repos in the WEBNEW monorepo.**
> For cross-repo architecture, connections, and chatbox flow see: [`../CLAUDE.md`](../CLAUDE.md)

For full agent development guidelines, see [AGENTS.md](./AGENTS.md).

All Claude agents working on this project should follow the development guidelines outlined in AGENTS.md, which covers:
- Project structure and directory conventions
- Key commands and workflows
- Architecture and patterns
- Data pipeline (Excel → constants.ts → build)
- Component model (app/ → sections/ → components/)
- Cart state API (CartContext)
- Development best practices

## Role in the System

This is the **customer-facing storefront** (Natro — thermal paper & labels).
- Calls backend at `http://localhost:5000/api` (env: `NEXT_PUBLIC_API_URL`)
- **Guest cart:** uses `x-session-id` UUID header (no login required)
- **Customer auth:** JWT stored in localStorage via `AuthContext`
- **Guest chat:** `src/components/ChatBox/` — connects Socket.IO with `auth: { conversationId }`
- **AI chatbot:** `src/lib/api/services/chatbotService.ts` → `POST /api/chatbot/message`

## Key localStorage keys

| Key | Content | Used by |
|-----|---------|---------|
| `packing_cart` | `CartItem[]` | CartContext — persists cart across sessions |
| `packing_chat` | `{ conversationId, guestName, guestPhone }` | ChatBox — restores guest chat session |
| `session_id` | UUID string | API client — identifies anonymous guest for cart |

## Cross-repo note on AGENTS.md

AGENTS.md describes the original "static-only, no-database" architecture. The actual codebase has a full API integration layer in `src/lib/api/services/` connected to `ecommerce-backend`. Both modes co-exist: product pages are SSG (build-time), but cart/orders/auth/chat are runtime API calls.
