# Agent instructions

- Backend: Node 20+, TypeScript (strict), Express 5, Zod for all external input. ESM with `.js` import suffixes.
- Web: React 18 + Vite + TypeScript. The browser never calls Fake Store directly; everything goes through `/api`.
- Dependencies point inward: `http` and `adapters` depend on `domain` and `services`, never the reverse.
- Product data is accessed only through the `ProductSource` port; email only through `EmailSender`.
- Every behaviour change needs a test. Run `npm test` in both `backend` and `web` before finishing.
- No secrets in the repo. Configuration goes in `.env.example`.
