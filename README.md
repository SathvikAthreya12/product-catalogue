# Product Catalogue (PoC)

A small product catalogue: browse top-rated products, browse by category, search by text, view product details, and send a sales enquiry.

Built as a foundation to grow, not a throwaway prototype. The product data source and the email provider sit behind interfaces, so each can be replaced without touching business logic or the UI.

## Choices

- **Backend: Node.js + TypeScript (Express 5, Zod).** Simple to run locally, and the same language as the web client, so types can be shared later. The backend owns all product data access; the browser never calls Fake Store.
- **Web: React + TypeScript (Vite).** Fast dev server with an `/api` proxy, so there is no CORS setup in development.
- **No database.** The product catalogue comes from Fake Store (cached in memory for 5 minutes). Enquiries are delivered by email, which is the system of record for this PoC.

## Requirements

Node.js 20 or newer and npm. No accounts, API keys or paid services are needed.

## Run it locally

Terminal 1 (API on http://localhost:3000):

```bash
cd backend && npm install && npm run dev
```

Terminal 2 (web on http://localhost:5173):

```bash
cd web && npm install && npm run dev
```

Open http://localhost:5173. Enquiries are printed to the backend terminal by default.

## Configuration

Copy `backend/.env.example` to `backend/.env` to override defaults. Every value is optional for local development.

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3000` | API port |
| `FAKESTORE_BASE_URL` | `https://fakestoreapi.com` | Product data source |
| `SALES_INBOX` | `sales@example.com` | Recipient of enquiries |
| `EMAIL_FROM` | `catalogue@example.com` | Sender address |
| `EMAIL_PROVIDER` | `console` | `console` prints emails; `smtp` sends them |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | empty | Required when `EMAIL_PROVIDER=smtp` |

To send real email, set `EMAIL_PROVIDER=smtp` and fill in the `SMTP_*` values for any SMTP provider.

## Tests

```bash
cd backend && npm test   # service and HTTP tests, including validation and error paths
cd web && npm test       # enquiry form submission
```

## API

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/featured` | Five top-rated products |
| GET | `/api/categories` | Categories with `name` and URL `slug` |
| GET | `/api/categories/:slug` | `topRated` and additional `products` for a category |
| GET | `/api/search?q=` | Products whose title or description contains the term |
| GET | `/api/products/:id` | One product |
| POST | `/api/enquiries` | Body: `{ productId, name, email, phone?, message }`. Emails sales, returns 201 |

## Project layout

```
backend/src/
  domain/       Types and ports (ProductSource, EmailSender). No framework imports.
  services/     Business rules: ranking, categories, search, enquiries.
  adapters/     Fake Store client, console and SMTP email senders.
  http/         Express routes and request validation.
  app.ts        Builds the Express app (no listening; testable).
  server.ts     Composition root: chooses the concrete adapters.
web/src/
  api/          The only module that calls fetch.
  components/   Reusable UI.
  pages/        One component per route.
  hooks/        Shared data-loading hook.
```

See `DECISIONS.md` for assumptions, trade-offs and the path beyond the PoC. See `AI_USAGE.md` for how AI tools were used.
