# Kickoff: Redesigned Logo Rollout Across All Site Surfaces & Assets

```text
Project: portfolio-website
Path: /home/radxa/dev-shared/projects/portfolio-website (or worktree: ~/worktrees/portfolio-website/redesign-logo-update/)
Branch: feat/redesign-logo-update (create off dev; do not switch or merge)
Goal: Replace the old VK glass logo across every surface, derivative asset, favicon, PWA icon, and Open Graph banner on the site using the newly redesigned logo in prototypes/assets/new-logos/logo.png.
Mode: Execution
Complexity: Non-trivial full workflow
```

---

## 1. Context & Scope

Vishal redesigned the `VK` glass monogram logo and placed 4 high-resolution renders (`5016×5016` RGB PNGs, ~0.85–1.1 MB each) in `prototypes/assets/new-logos/`:
- `logo.png` — **Primary master** (cool slate-blue top-left rim light + warm amber bottom-right glow)
- `logo-blue.png` — Electric blue / violet-magenta glow variant
- `logo-brown.png` — Warm bronze / amber glow variant
- `logo-mono.png` — Pure silver / monochrome variant

Use `prototypes/assets/new-logos/logo.png` as the canonical source across the site unless instructed otherwise.

### Critical Geometry & Lesson L-068 Warning
- **Outer black margin:** In `new-logos/logo.png` (`5016×5016`), the glass squircle does **not** touch the canvas edges — it sits inside `x: 329..4657, y: 328..4715` (`~4328×4387`), surrounded by ~330px of solid black margin on all 4 sides.
- **Why this matters:** Every site placement (`index.html` `.mark img`, `#pg-me .me-logo img`, `.nav-logo-mark`, `.nav-profile-mark`, `.home-identity-mark`, and `_og-template.html` `.logo-mark`) applies `border-radius: 22%` / `8px` / `34px` with `object-fit: cover` expecting the squircle to fill the canvas edge-to-edge (like the previous `1108×1122` `logo.png` whose bbox was `1..1105`).
- **Mandatory Step 1:** Before generating **any** derivative, tight-crop `new-logos/logo.png` to the squircle bounding box (centered `1:1` square crop, approx `x: 329..4689, y: 342..4702` or auto-detected via pixel threshold `max(R,G,B) > 20`) so the squircle fills the square canvas cleanly with zero outer black frame.
- **Mandatory Step 2 (L-068 — 16×16 & 32×32 legibility):** At `16×16` and `32×32` favicon sizes, dark glass shadows can swallow the `VK` monogram. Apply contrast/brightness enhancement (like the prior approved Option C: `1.6× contrast + 1.3× brightness` or tighter inner crop on the `VK` glyph) for the small favicon derivatives (`favicon-16x16.png`, `favicon-32x32.png`, `favicon.ico`, `favicon.svg`) and visually verify at `16×16` that `VK` is crisp and readable.

---

## 2. Blast Radius — Every Place on the Site

All HTML files (`index.html`, `prototypes/portfolio-combined.html`, `prototypes/resume/*.html`) and `site.webmanifest` already wire up the exact filenames below. Replacing these files in-place updates every surface across the entire site:

### A. Site Logo Marks (`prototypes/assets/`)
| Asset File | Dimensions | Used Where |
|---|---|---|
| `prototypes/assets/logo.png` | `1024×1024` PNG (optimized, <300KB) | Canonical master; also loaded directly by `prototypes/assets/_og-template.html` (`.logo-mark`, `168×168`) |
| `prototypes/assets/logo-192.webp` | `192×192` WebP (<15KB, quality ~88) | 1. Root `index.html` intro splash (`.mark img`, `76×76`)<br>2. `prototypes/portfolio-combined.html` `#pg-me .me-logo img` (`64×64`)<br>*(Asserted by `tests/e2e/index.spec.js:11` and `tests/e2e/spa.spec.js:587`)* |
| `prototypes/assets/logo-128.png` | `128×128` PNG | 1. `prototypes/portfolio-combined.html` topbar left brand pill scroll-swap (`.nav-logo-mark`, `28×28`)<br>2. `prototypes/portfolio-combined.html` topbar right tools pill profile button (`.nav-profile-mark`, `26×26`) |
| `prototypes/assets/logo-256.png` | `256×256` PNG | `prototypes/portfolio-combined.html` Homepage Identity widget (`#home-identity .home-identity-mark`, `42×42`) |
| `prototypes/assets/logo-512.png` | `512×512` PNG | High-DPI / general site derivative |
| `prototypes/assets/logo-cropped.png` | `512×512` PNG | Contrast-boosted / cropped favicon master |

### B. Favicons & PWA Icons (`prototypes/assets/` + repo root)
| Asset File | Dimensions | Used Where |
|---|---|---|
| `prototypes/assets/favicon.ico` | Multi-size ICO (`16×16`, `32×32`, `48×48`) | `<link rel="icon" href="...favicon.ico" sizes="any">` across `index.html`, `portfolio-combined.html`, and all 7 `prototypes/resume/*.html` |
| `/favicon.ico` (repo root) | Byte-identical copy of `prototypes/assets/favicon.ico` | Browser auto-requests at domain root `/` |
| `prototypes/assets/favicon.svg` | `viewBox="0 0 64 64"` SVG with embedded base64 64×64 PNG + `<style>:root{background:#080808}@media(prefers-color-scheme:light){:root{background:#f0f0f0}}</style>` | `<link rel="icon" type="image/svg+xml" ...>` across all 9 HTML files |
| `prototypes/assets/favicon-16x16.png` | `16×16` PNG | Standard PNG favicon fallback |
| `prototypes/assets/favicon-32x32.png` | `32×32` PNG | Retina PNG favicon fallback |
| `prototypes/assets/apple-touch-icon.png` | `180×180` PNG | `<link rel="apple-touch-icon" ...>` across all 9 HTML files |
| `prototypes/assets/icon-192.png` | `192×192` PNG | `prototypes/assets/site.webmanifest` Android / PWA icon |
| `prototypes/assets/icon-512.png` | `512×512` PNG | `prototypes/assets/site.webmanifest` Android / PWA splash icon |
| `prototypes/assets/icon-mask.png` | `512×512` PNG (with ~10% safe-zone padding on `#080808` bg) | `prototypes/assets/site.webmanifest` `"purpose": "maskable"` icon |

### C. Open Graph Social Preview Banner
| Asset File | Dimensions | How to Regenerate |
|---|---|---|
| `prototypes/assets/og-image.png` | `1200×630` PNG | Render `prototypes/assets/_og-template.html` (which references `src="logo.png"`) in headless Chromium via Playwright at viewport `1200×630` after updating `prototypes/assets/logo.png`. Note: make the random GitHub grid deterministic or wait for fonts (`document.fonts.ready`) before taking the screenshot. |

---

## 3. Step-by-Step Execution Plan

### Phase 1 — Startup & Alignment
1. Read `AGENTS.md`, `CONTEXT.md`, `tasks/todo.md`, `tasks/lessons.md` (specifically **L-066** and **L-068**), and the last 5 entries of `tasks/DEVLOG.md`.
2. Confirm branch: create `feat/redesign-logo-update` from `dev`.

### Phase 2 — Image Pipeline (Pillow)
Write and run a deterministic Python script (using `PIL.Image`, `ImageEnhance`, `LANCZOS`) to:
1. Load `prototypes/assets/new-logos/logo.png` (`5016×5016`).
2. Compute the non-black squircle bounding box (`max(R,G,B) > 20`), take a centered square crop around the squircle so the outer black border is stripped and the squircle reaches the canvas edges cleanly.
3. Resize with `Image.Resampling.LANCZOS` to generate:
   - `prototypes/assets/logo.png` (`1024×1024`, optimized PNG)
   - `prototypes/assets/logo-512.png` (`512×512`, optimized PNG)
   - `prototypes/assets/logo-256.png` (`256×256`, optimized PNG)
   - `prototypes/assets/logo-128.png` (`128×128`, optimized PNG)
   - `prototypes/assets/logo-192.webp` (`192×192`, WebP quality 88, verify `< 15KB`)
   - `prototypes/assets/icon-512.png` (`512×512`)
   - `prototypes/assets/icon-192.png` (`192×192`)
   - `prototypes/assets/apple-touch-icon.png` (`180×180`)
   - `prototypes/assets/icon-mask.png` (`512×512` — place the squircle at ~82% scale centered on `#080808` canvas so Android maskable circle/squircle crops don't clip the `VK`)
4. Create `prototypes/assets/logo-cropped.png` (`512×512`) with enhanced contrast/brightness (or tight crop around the `VK` + inner glass layers) so small icons pop, and derive from it:
   - `prototypes/assets/favicon-32x32.png` (`32×32`)
   - `prototypes/assets/favicon-16x16.png` (`16×16`)
   - `prototypes/assets/favicon.ico` and `/favicon.ico` (containing `16×16`, `32×32`, `48×48` frames)
   - `prototypes/assets/favicon.svg` (64×64 PNG base64-encoded inside the existing SVG wrapper)

### Phase 3 — Regenerate `og-image.png`
1. Open `file:///home/radxa/dev-shared/projects/portfolio-website/prototypes/assets/_og-template.html` in Playwright Chromium at `1200×630` (`deviceScaleFactor: 1`).
2. Wait for `document.fonts.ready` + networkidle so Syne, Cormorant Garamond, JetBrains Mono, and `logo.png` render cleanly.
3. Screenshot to `prototypes/assets/og-image.png` (optimize PNG if >250KB).

### Phase 4 — Remove Staging Folder
1. Remove `prototypes/assets/new-logos/` (or move it to `$TMPDIR` backup) so the 4MB raw 5016×5016 sources are not tracked in git.

### Phase 5 — Visual QA & Automated Tests (Mandatory per L-068)
1. Render and screenshot every surface via Playwright (save previews in `/tmp/logo-update-qa/`):
   - Favicon sheet showing `16×16`, `32×32`, `64×64` (`favicon.svg`), `180×180` on both `#080808` dark and `#ECECEC` light backgrounds.
   - `index.html#stay` at `1280×800` (dark + light).
   - `portfolio-combined.html` homepage at `1280×800` (`scroll=0` for `#home-identity` mark + topbar right `.nav-profile-mark`, and `scroll=250` for left `.nav-logo-mark` scroll-swap) in dark + light mode.
   - `portfolio-combined.html#me` at `1280×800` (`.me-logo` 64×64 WebP).
   - `prototypes/assets/og-image.png` (`1200×630`).
2. Run full test suite and HTML linter:
   ```bash
   npm test
   npm run lint:html
   ```
   All 100+ Playwright tests and `htmlhint` must pass with 0 errors.

### Phase 6 — Docs, Commit & Push
1. Tick completed items under `### Logo Redesign Rollout (2026-11-07)` in `tasks/todo.md`.
2. Append session entry at the top of `tasks/DEVLOG.md`.
3. Commit on `feat/redesign-logo-update` and push to `origin`:
   ```bash
   git push -u origin feat/redesign-logo-update
   ```
4. Report branch, verification summary, and preview paths to Vishal. **Do not merge.**
