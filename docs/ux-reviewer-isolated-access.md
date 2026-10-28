# Isolated UI/UX reviewer access

- URL: https://mba-ux-review.mba-advogados.workers.dev
- Login identifier: `mba-ux-review` (HTTP Basic Auth). Password is deliberately **not** stored in this repository.
- The secret is held on the authorized VPS at `/home/ubuntu/.mba-private/ux-review-login.env` (mode 0600); never send it to Git, screenshots, debug logs, or frontend source.
- Implementation: independent Cloudflare Worker `mba-ux-review` on account `4e3f4121dcc77830acccfc5ee473d7e1`. No proxy to production, no session with MBA production, no API credentials, no Supabase bindings.
- The review screens contain only **synthetic placeholders**. They are a visual model of the Backoffice; they do NOT load the actual live React application or operational data. UX observations about live behavior must be separately validated against an authorized real client session.
- Security contract: strong HTTP Basic Auth, SHA-256 password digest, 401 for missing/wrong credentials, 403 on every path except `/` and `/index.html`, 405 for non-GET/HEAD, CSP `connect-src 'none'`, script nonce, `no-store`, no browser `fetch`/XHR, no financial metric or revenue value. The text explaining the absence of financial data is not a billing card.
- Verified 2026-10-27 with Chromium/Playwright: 8 Base Geral KPI cards; 6 Encerramentos KPI cards; modal opens and closes; no runtime JS error; only the initial page request. HTTP checks: 401 unauthenticated, 200 authenticated, 403 `/api/base-geral/faturamento`, `/api/me`, `/auth/session`, and arbitrary paths.
- Reviewer access does not imply general authorization to call real API endpoints or access sensitive data. To review exact production UI without API rights, provide screenshots or sanitised exports, or publish a mock-data build of the real React UI to this separate origin.
- Revocation: disable the Cloudflare Worker subdomain or rotate/revoke the secret; password changes require updating the stored digest in the Worker and rotating the private credential file.
