# Website screenshots — what to drop in here

The site shows gray placeholder blocks until these files exist.
When a file is present, the photo replaces the placeholders automatically.

## Files needed (WebP, 1440px wide, < 200KB each)

| File                  | What to capture                                        | Used in              |
|-----------------------|--------------------------------------------------------|----------------------|
| `static-after.webp`   | The clean static page (desktop 1440×900 viewport)      | Home wipe, bottom layer |
| `bakery.webp`         | Corner Bakery site, desktop 1440×900                   | Home + Work cards    |
| `plumber.webp`        | A. Silva Plumbing site, desktop 1440×900               | Home + Work cards    |
| `law.webp`            | Reyes & Co. Legal site, desktop 1440×900               | Home + Work cards    |
| `seo-after.webp`      | Your rebuilt page (any clean search-console style shot, 1440×900) | Approach ch.1 after-card |
| `speed-after.webp`    | Your green PageSpeed result card (crop to ~600×350)    | Approach ch.2 after-card |
| `mobile-after.webp`   | Your rebuilt page at 390×844 phone viewport            | Approach ch.3 after-card |

Optional proof (Approach page counters already cover the numbers, so only add if real):
- `lighthouse-before.webp` — PageSpeed red score strip of the builder site
- `lighthouse-after.webp` — PageSpeed green 95+ strip of the static site

Crop Lighthouse cards to the score strip only (about 600×350). Full-page
PageSpeed screenshots are mostly empty space and look document-like.

## How to capture

1. Open the page in Chrome at 1440×900, close devtools.
2. Screenshot the viewport only (not full page) — `Cmd+Shift+4`, or DevTools
   `Capture screenshot` with device toolbar set to 1440×900.
3. Convert: `cwebp -q 80 in.png -o public/shots/<name>.webp`
4. Rebuild — no code changes needed.

Tip: the BEFORE layer on Home is a deliberately generic, labeled mock
("typical builder load") — no real site needed, and no client work borrowed.
Only the AFTER photo and the three project shots need capturing.
