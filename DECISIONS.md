# Decisions and assumptions

> Review this before submitting. Every item should reflect choices you can defend, so edit anything you would not make yourself.

## Assumptions where the acceptance criteria were unclear

- **"Top rated" means highest `rating.rate` from the product data**, with `rating.count` as the tie-breaker and `id` for stable output. The brief says the entrepreneur has "chosen" five products, but gives no mechanism. Rating data is the closest available signal. A curated list of product IDs in config would be a small change if the business wants manual control.
- **Home page shows the top five** by that ranking.
- **Category page** shows the top two products as "Top rated" and the rest under "More in <category>". The number two is arbitrary and easy to change (`CATEGORY_TOP_RATED_COUNT`). It is a decision I would revisit with the product owner.
- **Search** is a case-insensitive substring match on title and description, ranked by rating. It is not fuzzy and not tokenised. Searching "laptop" does not match "laptops" in the title, but it does match "laptop" in the description. That is good enough for a PoC, and a real search index (for example Postgres full-text or OpenSearch) is the natural next step.
- **Categories** are derived from the product data. No category management exists yet.
- **Enquiry form** requires name, email and message. Phone is optional. Enquiries are not stored; the sales inbox is the record.
- **"Thank you" message** appears in place of the form after a successful submit. The customer is not redirected.
- **Email** goes to a configured sales inbox, with the customer's address as reply-to so sales can reply directly.

## Requirements dropped or simplified

- **No database.** Nothing in the criteria needs persistence. Adding one would be the first step of the enquiry-tracking feature, not this PoC.
- **No authentication.** The criteria are all customer-facing and public.
- **No pagination.** Fake Store returns about 20 products. Pagination belongs with the real product source.
- **No rate limiting or CAPTCHA on enquiries.** This is a real gap for production: the endpoint can be used to spam the sales inbox. I left it out to keep the critical path short and would add it before launch.
- **No Docker.** Two `npm` commands are simpler to run here than containers, and nothing needs a service dependency.
- **No CI pipeline.** Tests run with one command in each package.
- **Mobile clients not built.** The brief allows one client. The API is client-agnostic, so a mobile app would reuse it.
- **Visual design is minimal.** The entrepreneur is still doing creative work, so the styling is placeholder-quality by design.

## How the design supports growth

- **Product source is a port.** `ProductSource` is an interface. `FakeStoreProductSource` is one implementation. The real catalogue, or an admin-managed database, is a new class. Services and routes do not change.
- **Email is a port.** `EmailSender` has console and SMTP implementations. SES, SendGrid or Postmark would be one more class and a config switch.
- **Dependencies point inward.** `domain` imports nothing framework-related. `services` depend only on ports. `http` and `adapters` are at the edges. This keeps business rules testable without HTTP or network access.
- **Config is validated once at startup**, so a misconfigured deployment fails immediately rather than on the first enquiry.
- **Frontend talks only to `/api`** through a single client module. Changing the API shape touches one file, and the browser never depends on the upstream provider.
- **Product IDs and categories are slugged on the backend**, so the URL scheme does not leak the upstream data format.

## What I would do next, with another day

1. Rate-limit `POST /api/enquiries` and add a honeypot field or CAPTCHA, then add structured logging with request IDs.
2. Store enquiries in a database before sending email, so a failed email does not lose a lead. Add a retry or outbox.
3. Add a real product source (admin-managed database or the entrepreneur's existing system) behind the same port.
4. Improve search with a proper index and typo tolerance.
5. Add end-to-end tests with Playwright covering the full enquiry flow, and a contract test for the API shape.
6. Add pagination and a sort control on category pages.
7. Add Docker Compose for one-command startup, plus CI running the two test suites.

## Time spent

[Replace with your actual time, split across planning, building, testing and reviewing.]
