# Kickoff: Compact homepage grid + fix Hermes widget layout

> **Author:** Hermes (orchestrator)
> **Date:** 2026-06-25
> **Target:** coding agent (agy / claude-code)
> **Mode:** Execution (HTML + CSS, single file)

---

## Goal

Fix the homepage widget grid layout: the new "FEATURED: Hermes OAuth" widget and CONTACT widget have layout problems (widget overflowing, big empty space between widgets, CONTACT misaligned with ABOUT). Goal: clean compact grid where:

1. **Hermes widget is compact (1-row, ~168px tall)** with all content visible (title, stats, buttons)
2. **CONTACT widget sits immediately below Hermes** with NO empty gap between them
3. **CONTACT widget bottom-aligned with ABOUT widget** (both end at the same y-position)
4. **GitHub link in Hermes widget** points to the actual repo, not the user profile
5. **No font-loading bugs** (the Ndot font must actually load or fall back gracefully)

---

## Project context

- **Project:** portfolio-website
- **Path:** `/home/radxa/dev-shared/projects/portfolio-website/`
- **Branch:** `feat/homepage-oauth-spotlight-widget` (already created)
- **File in scope:** `prototypes/portfolio-combined.html` ONLY

---

## Background — what broke and why

### The Hermes widget currently overflows
The kickoff defined Hermes as `s12` (1 col × 2 rows = ~336px tall) with content:
- wlbl-row header (~28px)
- 2-line title "Hermes One / OAuth Fork" at 28px font (~53px)
- 3-stats row (13 PRs merged, 4 phases, 38/38 tests pass) (~33px)
- buttons row (view + github, ~28px)
- gaps + padding = ~200-220px content

That fits in 336px BUT the widget had `max-height:180px` applied by an earlier polish agent, which clipped the stats and buttons.

Then I tried multiple fixes (removing max-height, shrinking fonts, dropping tagline) — but each fix introduced new issues. The user reported:
- "Hermes OAuth widget layout isnt fixed either" (visible garbled text in screenshot)
- "not a single svg icon is visible on light mode" (separate bug — see "Font issue" below)
- "contact widget is bit below" (CONTACT starts 1 row lower than ABOUT)

### Font issue (separate from layout)
The Ndot font file `assets/fonts/Ndot55-Regular.otf` is referenced via `@font-face` with `src: url('assets/fonts/Ndot55-Regular.otf') format('opentype')`. This is a relative path that should resolve correctly when the CSS is loaded from `prototypes/portfolio-combined.html`.

**Confirmed via browser:** the Ndot font has `status: "unloaded"` for one weight and `"loaded"` for another. `document.fonts.check('28px Ndot, "DM Mono", monospace')` returns `false`, meaning the font is NOT being applied at the requested size.

**Likely cause:** The `.otf` file is in `prototypes/assets/fonts/`, and the relative URL `assets/fonts/Ndot55-Regular.otf` SHOULD resolve to `prototypes/assets/fonts/Ndot55-Regular.otf` when the page is at `prototypes/portfolio-combined.html`. But this needs to be verified by checking the browser's Network tab — if the font request returns 404, the path is wrong.

**Secondary symptom:** When the font doesn't load, `font-display: swap` falls back to the next font in the stack (`DM Mono` or browser default monospace). Combined with `font-weight: 800` and `letter-spacing: -1.2px`, this can cause characters to overlap visually — explaining the "garbled HERMES OAUTH" the user reported.

**Fix:** If the font IS loading correctly but metrics differ, add a fallback that's visually distinct. If the font is NOT loading (404 on the .otf), fix the path. If both, switch to a more reliable font family.

### Grid auto-flow confusion
The grid has `grid-template-columns: repeat(4, 1fr)` and `grid-auto-rows: 168px`. Widgets flow left-to-right, top-to-bottom. The `.s22` widget (ABOUT) spans 2 cols × 2 rows via `grid-column: span 3` inline style override.

The auto-flow with current widget order gives:
- Row 5: Hermes (col 4, s12 spans 2 rows)
- Row 7: ABOUT (cols 1-3, s22 + grid-column:span 3 spans 2 rows)
- Row 7: CONTACT (col 4, s12 spans 2 rows)

Result: Hermes and CONTACT are vertically adjacent (no row between them), but CONTACT is shorter than ABOUT so its bottom doesn't align with ABOUT's bottom. To fix this without big empty space:

**Best approach:** Make CONTACT a compact 1-row widget (`s11`) so it fits in row 6 next to ABOUT's row 6 column 4. Use `align-self: end` to push it to the bottom of the cell.

---

## Tasks (execute IN ORDER)

### Task 1: Fix Ndot font loading (verify first, then fix)

**Step 1.1 — Verify the font is actually loading:**
1. Open `prototypes/portfolio-combined.html` in a browser at `http://127.0.0.1:8900/`
2. Open DevTools → Network tab → filter by font
3. Reload the page
4. Check if `Ndot55-Regular.otf` returns 200 or 404

**Step 1.2 — If 404, fix the @font-face path:**
- The CSS is inline in `portfolio-combined.html` at around line 70
- The path `assets/fonts/Ndot55-Regular.otf` is relative to the HTML file's location
- The HTML is at `prototypes/portfolio-combined.html`, fonts are at `prototypes/assets/fonts/`
- The relative path should be correct: from `prototypes/`, `assets/fonts/` resolves to `prototypes/assets/fonts/`
- If 404: try changing to `./assets/fonts/Ndot55-Regular.otf` (explicit relative)

**Step 1.3 — If 200 but metrics still broken:**
- Switch the Hermes title to a font that's known to render reliably
- Replace `font-family: var(--font-ndot)` (NDOT) with `font-family: 'Space Grotesk', sans-serif` for the Hermes title ONLY (other cs-titles can keep NDOT)
- Reduce letter-spacing from `-1.2px` to `-0.5px` to avoid overlap

### Task 2: Compact the Hermes widget

**Current state:** Hermes is `s12` (1 col × 2 rows = 336px) but content is too big to fit comfortably in 1 row (168px).

**Change:** Convert Hermes to `s11` (1 col × 1 row = 168px).

**Find this line** (around line 3557):
```html
<div class="w s12" style="display:flex;flex-direction:column;gap:10px;padding:14px;position:relative;overflow:visible;max-height:none">
```

**Change `class="w s12"` to `class="w s11"`.**

### Task 3: Simplify Hermes content to fit in 168px

**Current content (won't fit in 168px):**
```html
<div style="font-family:var(--font-ndot);font-size:clamp(20px,2.4vw,28px);font-weight:800;letter-spacing:-1.2px;line-height:.95;margin-top:2px;color:var(--w)">
  Hermes One<br>OAuth Fork
</div>
<div style="display:flex;gap:14px;margin-top:8px;font-family:'DM Mono',monospace">
  <!-- 3 stats: 13, 4, 38/38 -->
</div>
```

**Replace with compact version that fits in 168px:**
```html
<div style="font-family:'Space Grotesk',sans-serif;font-size:18px;font-weight:600;letter-spacing:-.3px;line-height:1;margin-top:4px;color:var(--w);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
  Hermes OAuth
</div>
<div style="display:flex;gap:10px;margin-top:auto;font-family:'DM Mono',monospace">
  <div style="display:flex;flex-direction:column;gap:0">
    <div style="font-size:14px;font-weight:500;color:var(--green);line-height:1">13</div>
    <div style="font-size:7px;color:var(--w30);letter-spacing:1.2px;text-transform:uppercase">PRs</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:0">
    <div style="font-size:14px;font-weight:500;color:var(--w);line-height:1">38/38</div>
    <div style="font-size:7px;color:var(--w30);letter-spacing:1.2px;text-transform:uppercase">tests</div>
  </div>
</div>
```

**Changes:**
- Title: single line "Hermes OAuth", Space Grotesk font (more reliable than NDOT for compact display)
- Drop "4 phases" stat (keep only 2)
- Smaller font sizes: 18px title, 14px stat numbers, 7px stat labels
- Use `margin-top: auto` so stats + buttons push to bottom of compact widget

### Task 4: Fix CONTACT widget placement (NO content changes)

**Current CONTACT widget is at:** col 4, row 7-8 (2 rows tall) with empty gap above.

**Goal:** Put CONTACT at col 4, row 6 (1 row, 168px tall) so it sits next to ABOUT (which is rows 6-7 cols 1-3).

**Find the CONTACT widget opening tag** (around line 3599):
```html
<div class="w s12 about-contact" style="width:260px;justify-self:start;gap:10px;padding:14px;overflow:visible;align-self:end;flex-shrink:0;grid-column:4">
```

**Change to:**
```html
<div class="w s11 about-contact" style="width:260px;justify-self:start;gap:8px;padding:12px;overflow:visible;align-self:stretch;flex-shrink:0;grid-column:4;grid-row:6">
```

**Changes (DO NOT touch the widget's internal content):**
- `s12` → `s11` (compact 1-row)
- Add `grid-column: 4; grid-row: 6` (force into row 6, col 4)
- `align-self: end` → `align-self: stretch` (let it fill the cell vertically — content stays where it is, but the cell is now smaller so it fits)
- Reduce `padding: 14px` → `padding: 12px` and `gap: 10px` → `gap: 8px` (slightly tighter for compactness)

### Task 5: Fix Hermes GitHub link

**Find** (around line 3585):
```html
<a class="np-ghost" href="https://github.com/vkkatariya" target="_blank" rel="noopener noreferrer" style="text-decoration:none;font-size:10px;padding:6px 12px">github →</a>
```

This is INSIDE the Hermes widget block (look for the surrounding `view →` link with `showPage('projects')` in the onclick to disambiguate from the FEATURED PROJECT widget which has the same link).

**Change to:**
```html
<a class="np-ghost" href="https://github.com/vkkatariya/hermes-desktop-oauth" target="_blank" rel="noopener noreferrer" style="text-decoration:none;font-size:10px;padding:6px 12px">github →</a>
```

---

## Hard rules

1. **DO NOT touch** CONTACT widget's internal content (the `<a class="cw-row">` links, the `loc-label`, the `avail-badge`, the CV download link). Only change the wrapper `<div>` class + inline style.
2. **DO NOT touch** any other widget on the homepage.
3. **DO NOT touch** the `.grid` CSS rules.
4. **DO NOT touch** other pages.
5. **DO NOT touch** any `.task/` files (kickoff, todo, DEVLOG, lessons).
6. **DO NOT change** SVG icons in the Hermes widget.
7. **DO NOT introduce** new CSS variables or design tokens.
8. **If the Ndot font is verified to load correctly** (Task 1.1 returns 200): skip Task 1.3 and keep NDOT font on Hermes title.
9. **If the Ndot font returns 404** (Task 1.1 fails): apply Task 1.2 path fix, then Task 1.3 font fallback.

---

## Verification

After all tasks complete:

```bash
# 1. Hermes widget is now s11 (1-row)
grep -A1 "<!-- 12 · FEATURED: HERMES" prototypes/portfolio-combined.html | head -3 | grep 'class="w s11"'
# Should print 1 line

# 2. Hermes title is single-line "Hermes OAuth"
grep -B0 -A2 "Hermes OAuth" prototypes/portfolio-combined.html | head -5
# Should show no <br> between Hermes and OAuth

# 3. Hermes GitHub link -> hermes-desktop-oauth repo
grep -A1 "hermes-desktop-oauth" prototypes/portfolio-combined.html | head -2
# Should find the link

# 4. CONTACT widget is now s11 + grid-row:6
grep "w s11 about-contact" prototypes/portfolio-combined.html
# Should return 1 line with the new style

# 5. No duplicate widgets
grep -c "<!-- 12 · FEATURED: HERMES" prototypes/portfolio-combined.html
# Should be 1

# 6. ABOUT widget unchanged
grep "<!-- 9 · ABOUT" prototypes/portfolio-combined.html
# Should still exist at original location

# 7. Browser check: load http://127.0.0.1:8900/prototypes/portfolio-combined.html
# - Hermes widget title renders cleanly (no overlapping letters)
# - CONTACT widget sits directly below Hermes (no gap)
# - CONTACT bottom aligns with ABOUT bottom
# - GitHub button in Hermes widget links to hermes-desktop-oauth repo
```

---

## Definition of Done

1. `git diff` shows ONLY changes to `portfolio-combined.html`:
   - Hermes widget class changed (s12 → s11)
   - Hermes content simplified
   - Hermes GitHub link updated
   - CONTACT widget class + inline styles changed (no content changes)
   - (Optional) @font-face path fixed if Task 1.2 was needed
2. All grep verifications pass
3. Browser visual check passes:
   - Hermes title is clean (no overlap)
   - CONTACT sits immediately below Hermes (no gap)
   - CONTACT bottom aligned with ABOUT
   - No regression on other widgets
4. Commit message: `fix(homepage): compact hermes widget to s11 + place contact below it (no empty space) + fix font fallback`
5. Push: `git push origin feat/homepage-oauth-spotlight-widget`

---

## Constraints

- Time budget: ~25 minutes
- Single file: `prototypes/portfolio-combined.html`
- Use existing CSS classes — do not invent new ones
- The CONTACT widget content (the cw-row links, loc-label, avail-badge, CV download) is ~280px tall when rendered. Since the widget is now `s11` (168px), the content WILL overflow the visible cell. This is expected — `overflow: visible` lets content spill out of the cell. The user accepts this because the overflow is below CONTACT (away from view) and the empty-space-between-widgets problem is what we're fixing.

  If the agent thinks this is wrong, they should ASK before changing the widget content.

---

## Failure modes to avoid

- **Don't add a `max-height` to CONTACT widget.** The user explicitly said NO to touching CONTACT widget.
- **Don't change the grid CSS** (`grid-template-columns` / `grid-auto-rows`).
- **Don't move CONTACT widget HTML position** in the DOM — just change its CSS class + inline styles.
- **Don't add `overflow: hidden`** to CONTACT — keep `overflow: visible`.
- **Don't introduce a placeholder** if the Ndot font 404s. Use the explicit fallback approach in Task 1.3.

---

## Quick setup for dispatch

```bash
cd ~/dev-shared/projects/portfolio-website
git checkout feat/homepage-oauth-spotlight-widget
git pull origin feat/homepage-oauth-spotlight-widget  # if remote is ahead
```

---

## END-OF-TASK CONTRACT (mandatory)

1. Verify with grep commands above.
2. `git status` — confirm only `prototypes/portfolio-combined.html` modified.
3. `git add prototypes/portfolio-combined.html`.
4. `git commit -m "fix(homepage): compact hermes widget to s11 + place contact below it (no empty space) + fix font fallback"`.
5. `git push origin feat/homepage-oauth-spotlight-widget`.
6. Return: branch, commit SHA, grep results, browser confirmation (clean Hermes title + no gap between Hermes and CONTACT), any deviations, whether Task 1.1 found the font 404 or 200.

---

**Tip:** Open the page in browser AFTER applying changes:
1. Toggle to light mode (top-right theme button) — verify SVG icons visible
2. Scroll to homepage — verify Hermes title is clean, CONTACT sits directly below with no gap, CONTACT bottom aligns with ABOUT bottom
3. Click Hermes github → link — verify it goes to hermes-desktop-oauth repo (not profile)