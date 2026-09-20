# Task Context: Fix Sveltia preview showing only peach background

Session ID: 2026-09-20-preview-fix
Created: 2026-09-20T00:00:00Z
Status: in_progress

## Current Request
Preview right-pane shows only the peach background colour, not the full styled frontend sections. Fix it and verify each section before claiming done.

## Context Files (Standards to Follow)
- /home/akarsh/the-daily-grind/docs/TEMPLATE-GUIDE.md
- /home/akarsh/the-daily-grind/src/pages/index.astro (exact live-site CSS/HTML reference)

## Reference Files (Source Material to Look At)
- /home/akarsh/the-daily-grind/public/admin/index.html
- /home/akarsh/the-daily-grind/public/admin/config.yml
- /home/akarsh/the-daily-grind/src/content/pages/home.yaml
- /home/akarsh/the-daily-grind/public/_headers

## External Docs Fetched
- Sveltia CMS bundle @sveltia/cms@0.217.0 inspected from /tmp/sveltia2.js: window.h=rr.createElement, registerPreviewTemplate(name,component) 2-arg only, preview lookup GF.get(fileName??collectionName), LAe passes entry as plain entryMap object (no getIn/toJS).
- Sveltia renders preview component output into SolidJS container then serializes DOM to blob: iframe preview svelte-1k58u5t sandbox="allow-same-origin allow-scripts allow-popups allow-forms".

## Components
- Preview templates in public/admin/index.html (home, pages, general, work)
- Live-site cms_preview_data patch in src/pages/index.astro (already verified PATCH OK)

## Constraints
- Single-file change: only the <script> preview block in public/admin/index.html. No CMS config or landing changes.
- Use dangerouslySetInnerHTML HTML-string injection to bypass SolidJS lazy-vnode blob serialization.
- Small, incremental steps: rewrite file, build, deploy preview+production, curl-verify, report.

## Exit Criteria
- [ ] public/admin/index.html home template returns h("div",{dangerouslySetInnerHTML:{__html: fullPageHtml}})
- [ ] npm run build passes with 4 page(s) built
- [ ] Deployed to preview + production and /admin/ serves new template
- [ ] All 8 live-site sections verified rendering (hero/about/menu/testimonials/faq/contact/cta/footer)
