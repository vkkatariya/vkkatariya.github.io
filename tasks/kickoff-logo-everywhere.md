# Task: Add logo to 7 sites — topbar, profile, OG image, hero, about, resume, /me

**Branch:** `feat/logo-everywhere` (off `dev`)
**Mode:** Builder
**Complexity:** Non-trivial full workflow (multi-file + cross-page consistency)
**Author:** Hermes (kickoff)
**Date:** 2026-06-30
**Dispatched by:** Vishal (manually)
**One shot:** all 7 sub-places in a single coherent design pass.

---

## Goal

Add the glass VK logo to **7 different places** across the portfolio site in one consistent design pass. The logo is the black/white glass VK monogram derived from `prototypes/assets/logo.png` (the same source used for the favicon). Use a single `<img>` or inline `<svg>` reference — same asset everywhere — so future swaps are one-line.

---

## The asset

Use the existing `prototypes/assets/logo.png` (1.39 MB, 1108×1122). **Do not** create a new logo. **Do not** vectorize unless it's clearly better — the agent's prior favicon work created a `logo-cropped.png` derivative (tight crop, white background, used for favicons); this task is a different concern (logo at site-scale, where the dark glass effect IS appropriate).

If you need smaller-derivative versions for performance (e.g. hero widget shouldn't load 1.39 MB), generate them:
- `logo-256.png` (~30 KB) — for sub-place 4 (hero widget)
- `logo-128.png` (~10 KB) — for sub-place 1 (topbar after scroll-swap), sub-place 2 (profile icon), sub-place 5/6/7 (smaller placements)
- `logo-512.png` (~80 KB) — for sub-place 3 (OG image source)

Use Pillow to generate. Save to `prototypes/assets/`.

---

## Sub-places (all 7, in this order)

### 1. Topbar pill (left) — scroll-responsive wordmark → logo swap

**File:** `prototypes/portfolio-combined.html` line 3456-3462 (`.nav-logo-name` contains "Vishal" + "Katariya" wordmark)

**Current behavior:** Topbar always shows the full "Vishal Katariya" wordmark in glass pill.

**Target behavior:**
- Default state (page just loaded, no scroll): show the "Vishal Katariya" wordmark
- On scroll-down past 80px: wordmark fades out, small logo (32px) fades in, in the same pill. No layout shift.
- On scroll-up (back to top): wordmark fades back in, logo fades out
- The pill width shrinks by ~50% when scrolled (gives center nav links more room)

**Implementation:**
- Wrap the existing `.nav-logo-name` div AND a new `<img class="nav-logo-mark">` inside a relative-positioned container
- Use CSS opacity transitions + scroll position. The topbar is currently position:fixed at top, so listen to window scroll position via a `scroll` event handler (debounced with rAF) that adds/removes a `.scrolled` class on `#shared-nav`
- Existing CSS at line 405-450 (`.nav-logo-name` rules) is the reference for sizing
- Use the `logo-128.png` derivative (~10 KB) for the small mark

**Verify:** Playwright at 1920px — capture topbar at y=0 (full wordmark) and y=200 (logo only). Confirm pill width shrinks.

### 2. Profile icon (right pill) — replace "VK" initials with logo SVG

**File:** `prototypes/portfolio-combined.html` line 3495

**Current behavior:**
```html
<button class="nav-profile" onclick="showPage('me')" title="Private section">VK</button>
```

**Target behavior:**
- Replace "VK" text with `<img src="assets/logo-128.png" class="nav-profile-mark">` (~32px display, 128px source for retina)
- Keep the button wrapper, onclick, title attribute
- Style: same height as before (~32px), centered

**Verify:** Playwright — `page.locator('.nav-profile-mark').isVisible()` returns true; `page.locator('.nav-profile:has-text("VK")').count()` returns 0.

### 3. Open Graph image for social share previews

**File:** All 7 HTML files (currently no OG image anywhere)

**Current behavior:** When shared on Twitter/LinkedIn/Slack, the preview shows a missing-image placeholder.

**Target behavior:** A 1200×630 PNG image with the logo + "Vishal Katariya" + tagline. Used as og:image for all 7 pages.

**Implementation:**
1. Generate the OG image: use Pillow to compose a 1200×630 PNG with:
   - Background: `#080808` (matches site `--bg`)
   - Logo at left (sized ~360px tall, centered vertically)
   - "Vishal Katariya" wordmark using Space Grotesk 800 (size ~80px)
   - Tagline: "CS student · Hochschule Darmstadt · Portfolio" (or similar — copy from existing homepage hero)
   - Save as `prototypes/assets/og-image.png`
2. Add OG meta tags to **all 7 HTML files** in the existing `<head>` block:
   ```html
   <meta property="og:image" content="assets/og-image.png">
   <meta property="og:image:width" content="1200">
   <meta property="og:image:height" content="630">
   <meta property="og:title" content="Vishal Katariya — Portfolio">
   <meta property="og:description" content="CS student at Hochschule Darmstadt. ML Engineering, Full-Stack, Infrastructure.">
   <meta property="og:type" content="website">
   <meta name="twitter:card" content="summary_large_image">
   <meta name="twitter:image" content="assets/og-image.png">
   ```
3. Adjust existing `<title>` and `<meta name="description">` for consistency (use the same copy as og:title/og:description)

**Verify:** Use a tool like https://www.opengraph.xyz/ or curl + regex to confirm all 7 pages have og:image pointing to assets/og-image.png and the file exists with 200 status.

### 4. Hero identity widget (`#home-identity`) — add logo mark alongside wordmark

**File:** `prototypes/portfolio-combined.html` line 3569 onwards

**Current behavior:** Hero widget has the big "Vishal" calligraphic + sans wordmark only.

**Target behavior:** Add the logo mark as a separate element. Placement options (pick the most aesthetically pleasing — likely top-left or top-right of the widget, not on the wordmark itself):
- Option A: top-left of the widget, small (~40px), above or beside the wordmark
- Option B: as a subtle watermark behind the wordmark (low opacity, large)
- Option C: bottom-right corner, as a stamp/seal

**Implementation:**
- Add `<img class="home-identity-mark" src="assets/logo-256.png">` inside the `<a id="home-identity">` element
- Use `logo-256.png` (~30 KB, good retina)
- Style with CSS: position absolute (or flex), small size, appropriate opacity
- Existing CSS at line 1011-1013 (mobile layout for `#home-identity`) is the reference — don't break the mobile identity-first layout
- **Verify at desktop AND mobile** (≤560px and ≤380px) per L-066

**Verify:** Playwright at 1920px, 860px, 560px, 380px — element visible, no layout shift, mobile identity-first still works.

### 5. About page photo block — add logo mark below photo

**File:** `prototypes/portfolio-combined.html` line 5714 onwards (`.photo-block` wrapper)

**Current behavior:** Photo block contains the photo + name text. No logo.

**Target behavior:** Add a small logo mark below the photo (or as a corner overlay). ~32px display, 128px source.

**Implementation:**
- Add `<img class="about-photo-mark" src="assets/logo-128.png">` inside the `.photo-block` div
- Style: centered below the photo, 32px×32px display, maybe with a subtle border or background to make it stand out
- Existing CSS at line 1834-1847 (`.photo-block` flex container) — add styling that fits the existing layout
- **Verify the existing `.photo-block` flex layout doesn't break** (it's a flex column with gap)

**Verify:** Playwright at 1920px + 560px — element visible, photo block height grows by ~40-50px (expected), no layout regressions.

### 6. Resume page header — add logo mark to `resume.html`

**File:** `prototypes/resume.html` (A4 print page, separate from the main SPA)

**Current behavior:** Header has the "Vishal Katariya" name in the top-left, role/contact info on the right.

**Target behavior:** Add the logo mark to the header, placement TBD (likely top-left above or beside the name, or as a small accent in the corner).

**Implementation:**
- The header is a flex row (`.hdr-top`) with name on the left and contact on the right
- Add `<img class="resume-logo" src="assets/logo-128.png">` either:
  - As a new element in the header (above the name, ~24px high)
  - OR as a watermark in the corner (low opacity, ~80px)
- The resume is a print page — keep the design subtle so it doesn't dominate
- Print-color-adjust is already enabled in `resume.html` so the dark glass will print correctly

**Verify:** Generate the resume PDF via the existing `tasks/lessons.md` Playwright recipe, open the PDF, confirm the logo appears in the header.

### 7. /me private page — add logo mark to heading area

**File:** `prototypes/portfolio-combined.html` line 6020 onwards (`.me-auth-card` content)

**Current behavior:** The /me page is a "Private section" auth card. The 56px circle avatar at the top of the card shows "VK" initials in a green→blue gradient. No actual logo.

**Target behavior:** Replace the "VK" avatar circle with the actual logo. Either:
- Option A: Keep the circular crop but use the logo image inside
- Option B: Square logo, no circular background (matches the rest of the site's identity)

**Implementation:**
- Line 6023 has: `<div style="...background:linear-gradient(...)...;border-radius:50%...">VK</div>`
- Replace "VK" text with `<img src="assets/logo-128.png" style="width:56px;height:56px;border-radius:50%">`
- OR replace the entire circle with the logo at a larger size (no border-radius)
- The /me page is Tailscale-only, so a less polished look is acceptable — focus on consistency with the rest of the site

**Verify:** Playwright at 1920px — navigate to /me, check the logo is in the auth card.

---

## Workflow

### Phase 1 — Read context
1. `CONTEXT.md` — design system, deploy paths, hard constraints
2. `AGENTS.md` — behavior contract + DEVLOG hard rule
3. `tasks/DEVLOG.md` (last 3 entries) — current world state (note: prior favicon agent's entry at fee0fb9)
4. `tasks/lessons.md` — L-068 (visual verification) is critical
5. `tasks/todo.md` lines 123-130 — the 7 sub-places you're completing

### Phase 2 — Branch + prep
1. `git status --short && git branch --show-current && git log --oneline -1` (L-055)
2. `git checkout dev && git pull origin dev`
3. `git checkout -b feat/logo-everywhere`

### Phase 3 — Generate size derivatives
1. Use Pillow to create `logo-128.png` (~10 KB), `logo-256.png` (~30 KB), `logo-512.png` (~80 KB) from the source `logo.png`
2. Run HTML lint to confirm asset files exist + reasonable sizes

### Phase 4 — Generate OG image
1. Use Pillow to compose `og-image.png` (1200×630) — black background, logo at left, "Vishal Katariya" + tagline
2. Test by viewing it in a browser (Playwright screenshot) to confirm composition

### Phase 5 — Apply each sub-place
For each of the 7 sub-places, in order:
1. Read the relevant markup section
2. Apply the change
3. Visual QA via Playwright (render at multiple sizes)
4. **Send previews to Vishal for sign-off** before committing
5. **If sub-place fails QA, iterate** — don't ship a broken logo

### Phase 6 — Verify all 7 together
1. Playwright at 1920, 860, 560, 380 viewports — check all 7 placements
2. HTML lint passes
3. All 7 HTML files have OG meta tags (curl check)
4. No broken image references
5. **No layout regressions** — particularly the mobile identity-first layout (L-066 territory)
6. Test light mode (`html.light` class) — does the logo still read well?

### Phase 7 — Commit + DEVLOG

Single commit (one task, one branch per L-067):
```bash
git add prototypes/assets/logo-128.png prototypes/assets/logo-256.png prototypes/assets/logo-512.png prototypes/assets/og-image.png prototypes/portfolio-combined.html prototypes/resume.html
git commit -m "agent(<your-cli>): add glass VK logo to 7 places

- Sub-place 1: topbar pill scroll-swap (wordmark → logo on scroll)
- Sub-place 2: profile icon (right pill) — 'VK' replaced with logo
- Sub-place 3: OG image (1200x630) + meta tags on all 7 HTML files
- Sub-place 4: hero identity widget — small logo mark
- Sub-place 5: about page photo block — logo below photo
- Sub-place 6: resume.html header — logo accent
- Sub-place 7: /me auth card — VK avatar replaced with logo

All 7 sub-places from tasks/todo.md (Phase 0 Brand assets) completed.
Visual QA at 16/32/180/192/512/1920 viewports: V/K clearly readable.
No layout regressions, mobile identity-first still works."
git push origin feat/logo-everywhere
```

**MANDATORY: Append DEVLOG entry** to `tasks/DEVLOG.md` (newest at top):
```markdown
## [YYYY-MM-DD HH:MM] [your-cli] — feat/logo-everywhere

**Did:**
- Generated logo-128/256/512 derivatives from logo.png
- Generated og-image.png (1200x630) with logo + name + tagline
- Added logo to 7 places (topbar pill, profile icon, OG meta, hero widget, about photo, resume header, /me auth)
- Added og:image/twitter:card meta to all 7 HTML files
- Visual QA at all breakpoints passed

**State:** ready for Vishal review + merge
**Decided:** [any design decisions — placement, size, opacity]
**Blocked/Next:** waiting for Vishal to eyeball
**Modified:** 8 files (3 derivative PNGs, og-image.png, 2 HTML files, plus possibly CSS)
```

**The DEVLOG entry is non-negotiable.** Per `AGENTS.md`: "If the session ends without a DEVLOG entry, write it as the final message anyway."

---

## Hard constraints

- **Use the existing `logo.png` source** — do not redraw, do not vectorize (the glass effect is fine at site-scale, only favicon needed the cropped version)
- **One coherent design pass** — all 7 sub-places should feel like a system, not 7 different ideas. Pick sizing + placement that's visually consistent.
- **Visual verification before commit** — per L-068. Render at multiple sizes, send previews to Vishal, only commit after sign-off.
- **No breaking the mobile identity-first layout** (L-066 territory) — sub-place 4 (hero widget) is in the most sensitive area
- **No breaking the topbar at ≤560px** (hamburger menu collapse exists there) — sub-place 1 changes the topbar pill
- **No breaking print styles** in resume.html (sub-place 6) — `print-color-adjust: exact` is already set
- **Relative paths** in OG meta tags (per L-060)
- **No new external dependencies** without asking
- **No commits to `main` or `dev` directly** — work on `feat/logo-everywhere`, push, wait for Vishal
- **Don't touch the favicon work** (already on dev, do not modify those assets)

## After completing

- Push `feat/logo-everywhere` to origin
- **Send Vishal the visual previews** (one screenshot per sub-place, all in `/tmp/logo-everywhere-previews/`)
- DO NOT auto-merge to dev. Wait for Vishal to review the previews + merge.
- DO NOT delete any branches (per L-067 / branch discipline)
