# Task: Convert `assets/logo.png` into a working favicon for portfolio-website

**Branch:** `feat/favicon` (off `dev`)
**Mode:** Builder
**Complexity:** Non-trivial full workflow (multi-file, browser QA, manifest authoring)
**Author:** Hermes (research + kickoff)
**Date:** 2026-06-30
**Dispatched by:** Vishal (manually — not auto-dispatched)

---

## Goal

Make `prototypes/assets/logo.png` (1.35 MB, black/white glass VK variant — already
approved by Vishal) work as a proper favicon across every major browser and
device context. Source file is the truth; do not redraw or redesign.

## Files in scope (6 — all live HTML)

The portfolio is a static multi-file deploy. **All 6 HTML files share the
same favicon assets**, and ALL 6 currently have **zero** favicon/icon/manifest
tags in their `<head>`. Every file needs the same `<head>` additions.

| # | File | Path | Current state |
|---|---|---|---|
| 1 | Root splash | `index.html` | no favicon |
| 2 | Main SPA | `prototypes/portfolio-combined.html` | no favicon |
| 3 | Homepage v4 | `prototypes/portfolio-v4.html` | no favicon |
| 4 | Projects page | `prototypes/projects.html` | no favicon |
| 5 | About page | `prototypes/about.html` | no favicon |
| 6 | CS Roadmap | `prototypes/cs-roadmap.html` | no favicon |
| 7 | Resume | `prototypes/resume.html` | no favicon (separate from main SPA, served from same domain — include for consistency) |

All 6 files deploy to both Vercel (`vishal-katariya.com`) and GitHub Pages
(`vkkatariya.github.io`). Vercel auto-deploys on `main` push.

## Source asset

```
prototypes/assets/logo.png
1,353,514 bytes (1.35 MB)
Format: PNG
```

**Do NOT create a new logo. Do NOT redraw. Derive all output formats from this PNG.**

> ⚠️ **DECISION NEEDED BEFORE DISPATCH:** Is `logo.png` going to be committed
> to the repo, or gitignored?
>
> - **Commit it** (1.35 MB): agent can pull from origin. Single source of truth, simpler.
> - **Gitignore it**: source lives on athena + Mac via mutagen, agent reads from local disk only.
>
> Vishal: pick one before dispatching. If committing, the agent does
> `git add prototypes/assets/logo.png` as the very first step of Phase 4.

## What "done" looks like

A user opening `https://vishal-katariya.com/` in any of these contexts sees
the glass VK logo, no broken-image placeholder, no 404, no generic browser
globe:

| Context | Browser | Expectation |
|---|---|---|
| Browser tab (light theme) | Chrome / Firefox / Edge / Safari | Renders correctly at 16×16 and 32×32 |
| Browser tab (dark theme) | Same browsers | Adapts via SVG `@media (prefers-color-scheme: dark)` — see "Dark mode" below |
| Bookmarks bar | All | Renders at 16×16 |
| iOS Safari home screen ("Add to Home Screen") | iPhone / iPad | Uses `apple-touch-icon` (180×180 PNG, no transparency, square, with brand-color background) |
| Android Chrome home screen install | Android | Uses `manifest.webmanifest` icon-192 / icon-512 |
| PWA install prompt | Chrome / Edge | Maskable icon (512×512 with safe-zone padding) |
| Tab preview / "Hover to see" | Chrome 90+ | Renders as expected (uses ICO) |
| Slack/Discord link unfurls | n/a | Uses Open Graph fallback (no action needed) |

## What to deliver

### 1. Output assets (in `prototypes/assets/`)

| File | Source | Size | Purpose |
|---|---|---|---|
| `favicon.ico` | derived from `logo.png` | multi-size (16+32, optionally 48) packed in ICO container | Legacy browsers, RSS readers, link previews |
| `favicon.svg` | derived from `logo.png` (vectorize or embed PNG-as-base64) | vector, or PNG-in-SVG wrapper | Modern browsers (Chrome/Firefox/Edge/Safari 14+). Embed `@media (prefers-color-scheme: dark)` rule for dark-mode adaptation |
| `apple-touch-icon.png` | derived from `logo.png` | 180×180 PNG, no transparency, brand-color background fill | iOS home screen |
| `icon-192.png` | derived from `logo.png` | 192×192 PNG | PWA / Android |
| `icon-512.png` | derived from `logo.png` | 512×512 PNG | PWA splash / desktop shortcuts |
| `icon-mask.png` | derived from `logo.png` | 512×512 PNG with extra padding (safe zone = central 409×409 circle) | Android maskable (cropped by launcher into any shape) |
| `site.webmanifest` | hand-authored JSON | text file | PWA manifest |

**Do not ship:** `browserconfig.xml` (IE11/Windows tile — dead, skip),
tile icons, animated favicons (not needed).

### 2. `<head>` block (add to all 7 HTML files)

Add this block to each HTML file's `<head>`, before `</head>`:

```html
<!-- Favicon (multi-format, all 7 HTML files) -->
<link rel="icon" href="assets/favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
<link rel="manifest" href="assets/site.webmanifest">
<meta name="theme-color" content="#080808">
<meta name="theme-color" content="#f0f0f0" media="(prefers-color-scheme: light)">
```

Notes:
- The `theme-color` matches the site's `--bg: #080808` and `--w: #f0f0f0` (light mode)
- Use **relative paths** (`assets/...`) not absolute (`/assets/...`) — this site is served from multiple backends (Vercel + GitHub Pages at `/prototypes/` subpath); absolute paths cause silent cross-backend bounces (L-060).
- `sizes="any"` on the ICO line is critical — without it, Chrome prefers ICO over SVG and the dark-mode media query inside the SVG won't take effect.

### 3. `site.webmanifest` content

```json
{
  "name": "Vishal Katariya — Portfolio",
  "short_name": "VK Portfolio",
  "start_url": "/prototypes/portfolio-combined.html",
  "display": "standalone",
  "background_color": "#080808",
  "theme_color": "#080808",
  "icons": [
    { "src": "assets/icon-192.png", "type": "image/png", "sizes": "192x192" },
    { "src": "assets/icon-512.png", "type": "image/png", "sizes": "512x512" },
    { "src": "assets/icon-mask.png", "type": "image/png", "sizes": "512x512", "purpose": "maskable" }
  ]
}
```

### 4. Dark-mode SVG variant

The user already approved the **black/white glass VK** (not the blue/purple
one). The dark-mode media query is needed so the white-on-glass version shows
on dark browser tabs (white text on dark backgrounds is the default for most
browsers' dark mode).

```html
<!-- inside favicon.svg -->
<style>
  :root { background: #080808; }
  @media (prefers-color-scheme: light) {
    :root { background: #f0f0f0; }
  }
</style>
```

**Implementation note:** The user supplied a PNG, not an SVG. To get the
dark-mode media query working, you need an SVG. Two options:
- (A) Vectorize the PNG (e.g. `potrace` / `vtracer` / `inkscape --actions="object-to-path"`) — best quality, smaller file
- (B) Embed the PNG as base64 inside an `<image>` tag in the SVG, and use the SVG to provide the `<style>` block for theme switching

Option B is simpler and works fine for a glass logo. Use `B` unless vectorization
gives a noticeably better result.

## Workflow

### Phase 1 — Read context (do this first)

1. `CONTEXT.md` — site architecture, design system, deploy paths
2. `AGENTS.md` — behavior contract + DEVLOG hard rule
3. `tasks/DEVLOG.md` (last 3 entries) — recent world state
4. `tasks/todo.md` (line 121: "Favicon" parent task) — what's already noted
5. `tasks/lessons.md` — L-001 through latest; pay attention to L-060 (cross-backend index.html)

### Phase 2 — Audit current state

- Confirm which HTML files exist in repo root + `prototypes/`
- Grep all 7 HTML files for any existing `rel="icon"` / `apple-touch-icon` / `manifest` to verify nothing already exists
- Confirm `prototypes/assets/logo.png` is the source (1.35 MB PNG)
- Note the `vercel.json` + GitHub Pages deploy paths

### Phase 3 — Branch + prep

1. `git status --short && git branch --show-current && git log --oneline -1` (per L-055 — confirm clean state on dev)
2. `git checkout dev && git pull origin dev`
3. `git checkout -b feat/favicon`
4. `git checkout -b feat/favicon-local` (your local-session sub-branch, per dual-session model in `tasks/CLAUDE.md` — actually you ARE the local session for this project, so just work on `feat/favicon` and merge to `claude/local` when done; the dev-branch lineage is for the local session)

### Phase 4 — Generate assets

1. Convert `logo.png` to a vector `favicon.svg` (potrace / vtracer / inkscape vectorize, or use option B above)
2. Generate `favicon.ico` containing 16+32+48 from the source (use ImageMagick `convert logo.png -define icon:auto-resize=16,32,48 favicon.ico` or a tool like `favicon` npm)
3. Generate `apple-touch-icon.png` at 180×180 with brand-color background (`#080808`) and 20px padding per Evil Martians guide
4. Generate `icon-192.png`, `icon-512.png`, `icon-mask.png` from the same source
5. Verify `site.webmanifest` JSON validates (`python -c "import json; json.load(open('site.webmanifest'))"`)
6. **Compress PNGs** with `pngquant` or `oxipng` — the source is 1.35 MB; derived PNGs should be 5-30 KB each

### Phase 5 — Wire up all 7 HTML files

Add the favicon `<head>` block (above) to all 7 files. Verify each is at the same place in `<head>` (right before `</head>`). **No copy-paste drift** — use the same exact block.

### Phase 6 — Verify

Per `AGENTS.md` + `tasks/lessons.md`:

- [ ] **Playwright check** — open each page in Chromium, capture the network requests for favicon paths, confirm 200 responses (not 404)
- [ ] **Tab bar visual check** — Playwright `page.evaluate(() => { const link = document.querySelector('link[rel*=icon]'); return link?.href; })` returns the expected path
- [ ] **HTML lint** — `npm run lint:html` (passes if no markup errors)
- [ ] **Cross-breakpoint** — viewport 320 / 400 / 560 / 860 / 1920 (favicon doesn't affect layout but check it doesn't break anything)
- [ ] **Light mode** — `html.light` class doesn't break favicon path
- [ ] **Real browser QA** — open the deployed site in Chrome, Firefox, Safari, iOS Safari (if available), Android Chrome (if available)
- [ ] **Console clean** — no 404s in dev tools Network tab
- [ ] **HTML head validation** — `<head>` parses cleanly in all 7 files

### Phase 7 — Commit + DEVLOG

1. Commit with `agent(<your-cli>): <description>` prefix per `AGENTS.md`
2. Push to `feat/favicon` branch
3. Append a session entry to `tasks/DEVLOG.md` (newest at top):
   ```
   ## [date] [your-agent] — favicon
   **Did:** generated 7 favicon assets from assets/logo.png, wired 7 HTML files
   **State:** all favicon formats generated, all 7 HTML files updated, Playwright verified
   **Modified:** assets/favicon.ico, favicon.svg, apple-touch-icon.png, icon-192/512/mask.png, site.webmanifest; *.html × 7
   ```
4. If running inside Claude Code: `/devlog` or append manually

### Phase 8 — Hand off for merge

- DO NOT auto-merge to dev or main. Wait for Vishal's review.
- Tag the commit with a clear subject so it's findable in `git log --oneline`

## Hard constraints

- **No new external dependencies** without asking. Stick to ImageMagick + potrace/vtracer + standard tools that are already on athena.
- **No redrawing the logo** — it's PNG-to-formats, not redesign. If the PNG doesn't vectorize cleanly to a 16×16 readable result, FLAG IT in the kickoff output instead of redesigning.
- **Relative paths** in the `<head>` block — `/assets/...` will break on GitHub Pages (path is `/prototypes/assets/...`). Use `assets/...` relative.
- **No breaking the existing light/dark mode** — `html.light` class is used everywhere; favicon paths must work in both.
- **Don't touch the wordmark pill** (`#shared-nav > .nav-logo-name`) — that's a separate task ("Topbar logo" in todo.md) owned by a future agent.
- **Don't change `vercel.json` or `.github/workflows/pages.yml`** unless something is genuinely broken — Vercel auto-deploys on `main` push and your current config is verified working.
- **Don't commit node_modules / .env / vercel project files** — `.gitignore` already covers these.

## Known gotchas

- **Vercel + GitHub Pages cross-backend** (L-060): all asset paths must be relative. `assets/favicon.ico` ✓, `/assets/favicon.ico` ✗.
- **Browsers cache favicons aggressively** (sometimes months). To force a refresh during testing, use a query-string: `assets/favicon.ico?v=2`. Bump the version if you re-deploy.
- **iOS Safari ignores SVG media queries** (dark-mode adapt inside SVG won't work in iOS Safari). The 180×180 apple-touch-icon handles iOS.
- **Chrome prefers ICO over SVG without `sizes="any"`** — use the exact link tag from the spec above.
- **PNG-to-SVG vectorization** for glass/gradient logos often produces a much larger SVG than the source PNG. If SVG is bigger than 30KB, switch to option B (embed PNG as base64 inside SVG).

## Reference: the canonical kickoff format

This task follows the same shape as `tasks/kickoff-calligraphic-wordmark.md`
(written 2026-06-27, ~22KB, 476 lines, dispatched to opencode). Match that
format: Branch assertion at top, Read list, Goal, Scope, Constraints,
Definition of Done, Mode, Complexity, After-completion checklist.

## After completing

- Write DEVLOG entry at top of `tasks/DEVLOG.md`
- `git add -p` (or `git add .` if you trust the working tree) + `git commit -m "agent(<your-cli>): add multi-format favicon to all 7 HTML files"`
- `git push origin feat/favicon`
- DO NOT merge to dev or main. Wait for Vishal to review.
- DO NOT delete the `feat/favicon` branch (Vishal keeps work branches on remote per L-067 / branch discipline rule)

## What "shipped" means to you

The agent's job ends at:
1. Branch `feat/favicon` exists, all changes committed + pushed
2. All 7 HTML files have the favicon `<head>` block
3. All 7 favicon assets exist in `prototypes/assets/`
4. `site.webmanifest` is valid JSON
5. Playwright verification passed (no 404s, favicon loads in all 7 pages)
6. DEVLOG entry written

Anything beyond this (merge to dev, Vercel deploy, prod QA) is Vishal's call.
