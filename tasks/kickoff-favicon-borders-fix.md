# Task: Fix favicon — re-derive from new `assets/logo.png` (tight crop, clean background)

**Branch:** `fix/favicon-borders` (off `dev`)
**Mode:** Builder
**Complexity:** Non-trivial full workflow (asset regen + visual QA)
**Author:** Hermes (audit + kickoff)
**Date:** 2026-06-30
**Dispatched by:** Vishal (manually)
**Replaces:** prior `feat/favicon` branch (kept on remote per branch discipline, NOT deleted)

---

## Context — what went wrong

Vishal reviewed the deployed favicon and reported: **borders are visible, the icons have extra black area around them, not cropped properly**. He dropped a new `logo.png` (1108×1122, RGB, 1.39 MB) with the same design but less black border than the old (1254×1254) one.

**Audit findings** (Hermes, 2026-06-30):
- OLD logo (in git, 1254×1254): letter content was 86.9% × 78.6% of canvas — large black borders on all 4 sides
- NEW logo (just dropped, 1108×1122): letter content is 98.4% × 87.8% — much less border, but still 137px of dark glass on the bottom + ~10px slivers on left/right
- The "extra black area" is a **dark glass shadow effect** baked into the logo (designed for medium-large display, NOT small favicon use)
- At 16×16 / 32×32 favicon size, the dark glass dominates and the V/K becomes hard to read

**Fix approach:** Tight crop the new source to the V/K content, then center it on a clean background before re-deriving all favicon assets. This separates favicon use (high-contrast small) from the topbar pill use (full glass effect, separate task).

---

## What "done" looks like

A user opening `https://vishal-katariya.com/` in any of these contexts sees the V/K logo clearly readable, no dark "black box" effect, no broken-image placeholder, no 404:

| Context | Expectation |
|---|---|
| Browser tab (16×16 / 32×32) | V/K letters clearly visible against clean background |
| iOS Safari home screen | Solid background, no transparent areas (iOS composes white on transparent) |
| Android Chrome PWA | 192 / 512 / maskable icons all show V/K |
| Light browser tab | V/K is dark on light bg (or whatever contrast is right) |
| Dark browser tab | V/K is light on dark bg (or whatever contrast is right) |

**The V/K must be readable at 16×16.** If the result still looks like a black box at that size, the task isn't done.

---

## Source asset

```
prototypes/assets/logo.png (NEW — already in working tree, not yet committed)
1108 × 1122 px, RGB, no alpha, 1.39 MB
```

Already replaced in working tree:
- Working tree: `M prototypes/assets/logo.png` (new file)
- Git HEAD: old `logo.png` (1254×1254, has bigger borders)
- You need to commit the new `logo.png` as part of the fix

---

## What to deliver

### 1. Cropped source (new file in `prototypes/assets/`)

Create `prototypes/assets/logo-cropped.png`:
- Tight crop to the V/K letter content (use the non-black pixel bounding box, not just white pixels — the glass shadow should be included)
- Suggested crop: x=0 to x=1107, y=0 to y=984 (the bottom 137px of dark glass removed) → 1108×985
- Add a small uniform padding (~5-10% on each side) → call it 1108×985 + 80px padding = 1188×1065, but center on a SQUARE canvas
- **Make it square** (favicons are always square). Target 1108×1108 or 1024×1024
- Background color: **pick one and commit to it across all derivatives**:
  - Dark background `#080808` (matches site `--bg`) — works on dark browser tabs but invisible on light tabs
  - Light background `#f0f0f0` (matches site `--w`) — works on light browser tabs but invisible on dark tabs
  - **Recommended:** White background for favicon (`#ffffff` or transparent). V/K will be readable at small sizes on both light and dark browser chrome. The site already has light/dark mode, so a white-bg favicon blends with light tabs and stands out on dark tabs (acceptable).

### 2. Re-derive all favicon assets from the cropped source

Replace these 9 files in `prototypes/assets/`:
- `favicon.ico` (multi-size 16+32+48)
- `favicon.svg` (PNG-in-SVG + dark-mode media query for theming)
- `apple-touch-icon.png` (180×180, solid bg, 10% padding)
- `icon-192.png` (PWA)
- `icon-512.png` (PWA)
- `icon-mask.png` (512×512, 10% safe-zone padding for maskable)
- `favicon-16x16.png` (PNG fallback)
- `favicon-32x32.png` (PNG fallback)
- `site.webmanifest` (already valid JSON, may not need changes — but verify icon paths still resolve)

**Do not** keep the old `logo.png` artifacts that have the dark glass borders. Re-derive from the cropped source.

### 3. Keep `logo.png` as-is (the source for OTHER tasks)

`prototypes/assets/logo.png` is the source for the upcoming topbar-logo task (sub-places 1-7 in `tasks/todo.md`). The dark glass effect is appropriate for medium-large display. **Don't modify `logo.png` itself** — just re-derive the favicon-specific assets from a cropped version.

### 4. Wire up all 7 HTML files (no changes needed, just verify)

The `<head>` block in all 7 HTML files is already correct from the prior agent's work:
- `index.html` (root splash)
- `prototypes/portfolio-combined.html` (main SPA)
- `prototypes/portfolio-v4.html` (homepage standalone)
- `prototypes/projects.html`
- `prototypes/about.html`
- `prototypes/cs-roadmap.html`
- `prototypes/resume.html`

Just verify the link hrefs still resolve after you re-derive the assets.

---

## Visual QA — THIS TIME, DO IT PROPERLY

Per L-066 in `tasks/lessons.md`, `vision_analyze` returns empty on local paths. The previous agent didn't visually verify, which is how this got past me and you. **This time:**

1. After re-deriving each asset, render it in a real browser via Playwright (or use `xdg-open`/`open` to open the file locally)
2. Take a screenshot at multiple sizes (16×16, 32×32, 180×180) to check the V/K is visible
3. **Ask Vishal to eyeball the previews** before committing — don't commit until he's seen the output
4. If V/K isn't visible at 16×16, iterate: try different backgrounds, more aggressive crop, or different processing

Suggested Playwright snippet (run after re-deriving):
```python
# render at 16x16 to verify legibility
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser = p.chromium.launch(args=['--no-sandbox'])
    page = browser.new_page(viewport={'width': 16, 'height': 16})
    page.goto('file:///path/to/icon-16.png')
    page.screenshot(path='/tmp/preview-16.png')
```

---

## Workflow

### Phase 1 — Read context
1. `CONTEXT.md` — design system, deploy paths
2. `AGENTS.md` — behavior contract + DEVLOG hard rule
3. `tasks/DEVLOG.md` (last 3 entries) — current world state (note: prior favicon agent's entry)
4. `tasks/lessons.md` — L-066 (vision_analyze empty on local paths) is critical
5. `tasks/todo.md` line 121 — favicon task description

### Phase 2 — Branch + prep
1. `git status --short && git branch --show-current && git log --oneline -1` (L-055)
2. `git checkout dev && git pull origin dev`
3. `git checkout -b fix/favicon-borders`

### Phase 3 — Generate cropped source
1. Use Pillow (already on athena at `/home/radxa/.local/lib/python3.11/site-packages`) to:
   - Open `prototypes/assets/logo.png`
   - Find the bounding box of all non-near-black pixels (threshold RGB > 15)
   - Crop to that box + add 5% padding on each side
   - Resize to a square canvas (e.g. 1024×1024)
   - Composite onto a clean background (white or `#f0f0f0`)
   - Save as `prototypes/assets/logo-cropped.png`
2. **Visual check**: render the cropped version in a browser, screenshot, show Vishal before proceeding

### Phase 4 — Re-derive favicon assets
1. From `logo-cropped.png`, generate all 9 favicon assets using ImageMagick + potrace/vtracer
2. Same approach as the prior agent used (see `tasks/DEVLOG.md` for the recipe)
3. **Visual check after each asset** — render at intended display size, screenshot

### Phase 5 — Visual QA
1. Open each asset in a browser at its target size
2. Screenshot at 16×16, 32×32, 180×180, 192×192, 512×512
3. **Send the screenshots to Vishal** for visual approval BEFORE committing
4. If V/K isn't legible at small sizes, iterate

### Phase 6 — Replace + commit
1. Replace the 9 favicon files in `prototypes/assets/`
2. Also replace root `/favicon.ico` (browser auto-request)
3. `git add prototypes/assets/logo.png prototypes/assets/logo-cropped.png prototypes/assets/favicon.* prototypes/assets/apple-touch-icon.png prototypes/assets/icon-*.png prototypes/assets/site.webmanifest favicon.ico`
4. `git commit -m "fix(favicon): re-derive from cropped source to remove black borders

Vishal reported visible black borders in deployed favicon (2026-06-30).
Root cause: original logo.png had dark glass shadow extending to canvas edges,
dominating the V/K content at small favicon sizes.

Fix:
- New logo.png (1108x1122, less border) replaces the 1254x1254 old one
- Created logo-cropped.png — tight crop of V/K + glass, square, clean background
- Re-derived all 9 favicon assets from cropped source
- Visual QA at 16/32/180/192/512px: V/K clearly readable

No <head> block changes needed (already correct from prior agent)."`
5. Push to `fix/favicon-borders`

### Phase 7 — DEVLOG entry (CRITICAL — don't skip)

Append a session entry to `tasks/DEVLOG.md` (newest at top):
```markdown
## [YYYY-MM-DD HH:MM] [your-cli] — fix/favicon-borders

**Did:**
- Replaced prototypes/assets/logo.png with new source (1108x1122, less border)
- Created logo-cropped.png — tight crop, square, clean background
- Re-derived 9 favicon assets (favicon.ico, favicon.svg, apple-touch-icon.png, icon-192/512/mask.png, favicon-16/32.png)
- Replaced root /favicon.ico
- Visual QA at 16/32/180/192/512px passed (V/K legible)

**State:** ready for Vishal review + merge
**Decided:** white background for favicon (V/K readable on both light + dark browser chrome)
**Blocked/Next:** waiting for Vishal to eyeball the previews
**Modified:** 11 files in prototypes/assets/, root /favicon.ico
```

**This DEVLOG entry is non-negotiable.** Per `AGENTS.md`: "If the session ends without a DEVLOG entry, write it as the final message anyway."

---

## Hard constraints

- **Visual verification before commit.** Don't commit until Vishal has seen the previews and confirmed V/K is readable at 16×16.
- **Don't modify `logo.png` itself** — it's the source for the upcoming topbar-logo task. Only the cropped derivative goes in favicon assets.
- **Don't touch the 7 HTML files' `<head>` blocks** — they're already correct.
- **Don't change `vercel.json` or `.github/workflows/pages.yml`.**
- **No new external dependencies** without asking.
- **No commits to `main` or `dev` directly** — work on `fix/favicon-borders`, push, wait for Vishal.

## After completing

- Push `fix/favicon-borders` to origin
- DO NOT auto-merge to dev. Wait for Vishal to review the visual previews + merge.
- DO NOT delete the `feat/favicon` branch (Vishal keeps work branches on remote per L-067 / branch discipline).
