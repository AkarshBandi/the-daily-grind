# Hearth & Honey — Template Guide (Sveltia CMS + Astro + Cloudflare)

**What we built:** Figma `p.html` (1440px exact) → responsive Astro landing + Sveltia CMS (drop-in Decap) + Cloudflare Pages + GitHub.

## Live Preview (direct, not just text)
- `public/admin/index.html` now registers **full landing preview** for `figma/home` and `site/general`:
  - `CMS.registerPreviewStyle` loads same Google Fonts + `landingPreviewCSS` (hero, about, menu, testimonials) so preview is WYSIWYG like Elementor.
  - `CMS.registerPreviewTemplate("figma", ({entry}) => h("div.preview-wrap", ... heroHeading/heroText/about... ))` — edit any field on left, see full page on right instantly. Click a card in preview → left form jumps to that field (Sveltia’s `h` preview is live, not static).
  - `site` preview also shows hero so not just text.
- Before: `site/entries/general` showed only 4 text fields (little content). Now it shows the whole landing hero + sections — you can go to each box and text-edit.

## Auto-save & other convenient things for client (all exist in Sveltia)
- **Auto-save:** Sveltia auto-saves draft to `localStorage` every keystroke (no button needed). Check: edit `Home` → close tab → reopen → draft restored.
- **Editorial Workflow:** `publish_mode: editorial_workflow` in `public/admin/config.yml:11` gives `Draft → In Review → Ready → Publish` + `show_preview_links: true` gives deploy previews per PR.
- **Media Library:** `media_folder: public/shots` `public_folder: /shots` + `media_library` via `public/shots` (drag-drop, `max_file_size` handled). Images are `image` widgets in `work` collection.
- **Reordering & Types:** `widget: list` + `allow_reordering` + `types` already in `hero_buttons`/`navbar_links` (reorder buttons/links via drag handle).
- **Search:** `search: true` is default in Sveltia (top bar search). Add `"search": true` in config if missing.
- **Local Backend:** For dev, run `npx @sveltia/cms --local` or set `local_backend: true` in config to edit without pushing to GitHub.
- **Two-pane live preview:** Enabled via `registerPreviewStyle` + `registerPreviewTemplate` above — no extra config.

## Template for repetitive use (no coding from scratch, only mix content/site separate)
- **Code vs Content separation:**
  - Code: `src/pages/index.astro` (layout, GSAP, Lenis), `src/layouts/Layout.astro`, `src/styles/global.css`, `public/admin/index.html` (preview templates)
  - Content: `src/content/figma/home.yaml` (landing), `src/content/site/general.yaml` (site title/tagline), `src/content/work/*.md` (portfolio), `public/shots/*` (images)
  - To reuse for a new client: `git clone` → change `src/content/figma/home.yaml` + `src/content/site/general.yaml` + `public/shots` via CMS `/admin` — no code change. Or duplicate `src/content` folder per site.
- **Already custom code we did (not Figma):** GSAP `ScrollTrigger` + `Lenis` in `Layout.astro`, `hero-grid`/`menu-card`/`testi` responsive, `Great Vibes`/`Cormorant` script accents, `hearth-honey-auth` worker for One-Click `Login with GitHub`.
- **How to repeat:**
  1. `git clone https://github.com/AkarshBandi/the-daily-grind.git new-client`
  2. `cd new-client` → edit `public/admin/config.yml:2` `repo: "AkarshBandi/new-client"` `branch: master` `base_url: https://hearth-honey-auth.akarshbandi82.workers.dev` (same worker, add domain to `ALLOWED_DOMAINS`)
  3. `npm run build` + `wrangler pages deploy` → new `new-client.pages.dev`
  4. Invite client as `Write` collaborator → they use same One-Click GitHub flow.

## Docs stored
- This guide is at `docs/TEMPLATE-GUIDE.md` and also copied to `.opencode/context/` for AI.
- Sveltia official: `https://sveltiacms.app/en/docs/config-basics` and `https://sveltiacms.app/en/docs/working-with-ai` (Working with AI Portal) — both enable `local_backend`, `search`, and preview customisation.
