# CMS Auth — Two Methods (Client Owns GitHub + Cloudflare)

Live site is `output: static` (Astro + Cloudflare). Every edit in `/admin` → `git commit` to `github.com/CLIENT/CLIENT-SITE` → Cloudflare builds. GitHub is always the store, Cloudflare always the host. Difference is **who is allowed to commit**.

---

## Method A — GitHub per-user OAuth (ONE-TIME login, chosen now) — SAFER, BETTER

**Status: ACTIVE** (`public/admin/config.yml` `backend: github` + `base_url: https://auth.akarsh.dev`)

```
[Client /admin] --Login with GitHub (once)--> [sveltia/sveltia-cms-auth Worker] --OAuth--> [GitHub]
       |
       +--Save (hero kicker, work image via media_library) --> Worker exchanges token --> GitHub API: commit as client@gmail.com (GPG-signed)
```

- **Flow:** Client gets GitHub invite as `Write` collaborator on their repo. First visit to `yoursite.com/admin` clicks `Login with GitHub`, authorizes. Token stored in `localStorage`. Every later `Publish` commits directly as them, no password per push. `?logout` clears.
- **Deploy:** Deploy `https://github.com/sveltia/sveltia-cms-auth` to **client's** Cloudflare Workers (1-click). Create GitHub OAuth App (`Homepage: https://CLIENT.pages.dev`, `Callback: https://WORKER.workers.dev/callback`). Copy `Client ID/Secret` → Worker `Settings → Variables` → `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (Encrypt). Update `public/admin/config.yml` `repo: "CLIENT/CLIENT-SITE"` + `base_url`.
- **Pros:** Per-person audit (`git log` shows client), least privilege, 2FA on GitHub, revoke by removing collaborator, no shared secret, no PAT with `repo` scope in Worker.
- **Cons:** Client needs a GitHub account (one invite). After first login they never see GitHub again.
- **Cloudflare Pages:** Allowed. Worker is free (100k req/day). `publish_mode: editorial_workflow` gives `Draft → In Review → Ready` + `show_preview_links` deploy previews.

## Method B — Password-only via proxy Worker (no GitHub for client) — EASIER

**Status: DOCUMENTED, not active** (switch by changing `config.yml`)

```
[Client /admin] --enter "akarsh2024" (once)--> [Password Worker checks SHA-256 vs ADMIN_PASSWORD env, sets HttpOnly cookie]
       |
       +--Save --> POST https://proxy.CLIENT.workers.dev/api/v1/entries --> Worker checks cookie/password server-side --> Worker uses env GITHUB_TOKEN (PAT with repo scope from bot user studio-bot) --> GitHub API: commit as studio-bot
```

- **Flow:** Client only knows a shared password (e.g., `akarsh2024`, hash `e1a39d...` in current `public/admin/index.html` demo gate). No GitHub account. First visit shows password form, sets `CFP-AUTH` cookie. Every `Publish` the Worker validates cookie, then commits with its `GITHUB_TOKEN`.
- **Deploy:** Same Worker, but `backend: proxy` + `proxy_url: https://proxy.CLIENT.workers.dev/api/v1` in `config.yml`. Worker env holds `ADMIN_PASSWORD` (Encrypted) + `GITHUB_TOKEN`. Protect `/admin/*` server-side via `functions/_middleware.js` (Charca/cloudflare-pages-auth pattern: checks `Authorization: Basic` or `CFP-AUTH` cookie, not `localStorage`).
- **Pros:** No GitHub to learn, one shared password, `media_library`, `list + allow_reordering + types` (Home blocks), `live preview` (two-pane), `auto-saving drafts` all still work (Sveltia native).
- **Cons:** All commits as `bot` (no per-person trail), shared secret (if leaked, anyone with password can publish), PAT is powerful (if Worker compromised, whole repo). Must put password check server-side (Worker), not client-side `localStorage` demo we used for `akarsh2024`.

## Comparison

|  | A (GitHub OAuth) | B (Password proxy) |
|---|---|---|
| Client needs GitHub? | Yes, one invite, `Write` | No |
| Login | Once via GitHub | Once via password |
| Publish | No password per push | No password per push |
| Audit | Per-user | All as bot |
| Revoke | Remove collaborator | Change `ADMIN_PASSWORD` + rotate `GITHUB_TOKEN` |
| Security | GitHub 2FA, per-user token | Shared secret + PAT in Worker (encrypt) |
| Cloudflare | Free Worker `sveltia-cms-auth` | Free Worker `proxy` + `auth` |

## Current choice

**A is active.** `public/admin/config.yml` uses `backend: github`. To switch to B, change:

```yaml
backend:
  name: proxy
  proxy_url: https://proxy.CLIENT.workers.dev/api/v1
  branch: main
```

and deploy the proxy Worker with `GITHUB_TOKEN` + `ADMIN_PASSWORD`. Keep `media_folder: public/shots`, `publish_mode: editorial_workflow`, `show_preview_links: true`, and all `color`/`list`/`preview` widgets already wired (`site/design.yaml` → `:root` via `?raw`, `pages/home.yaml` blocks → `index.astro`).

Handoff: push `main` to client's GitHub, connect Cloudflare Pages to their repo (`Build: npm run build`, `Output: dist/client`), deploy Worker in their account, update `repo`/`base_url`/`site_url`, invite them, remove yourself.
