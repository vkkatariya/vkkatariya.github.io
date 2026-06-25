# Kickoff v3: Restore the dark neomorphic surface on the CONTACT widget

> **Author:** Hermes (orchestrator)
> **Date:** 2026-06-25
> **Target:** coding agent (claude-code)
> **Mode:** Micro-loop (add one class + one max-width)

---

## Why v3

The previous dispatch (`b3c3e7e`) correctly restored the CONTACT widget to its original size (`s12`, 1 col × 2 rows), BUT did NOT add back the `about-contact` class. That class carries the **dark neomorphic surface styling** (background, box-shadow, border-radius, padding) the user explicitly wants — matching how CONTACT looked in the original bottom-section.

Without the class, CONTACT renders with default widget glass styling, NOT the dark 260px neomorphic panel the user remembers.

---

## Project context

- **Project:** portfolio-website
- **Path:** `/home/radxa/dev-shared/projects/portfolio-website/`
- **Branch:** `feat/homepage-about-contact-merge`
- **File in scope:** `prototypes/portfolio-combined.html` ONLY
- **Current state of widget #11 CONTACT (broken):**
  ```html
  <div class="w s12" style="display:flex;flex-direction:column;justify-content:space-between;">
    ...contact content...
  </div>
  ```

The widget is narrow (`s12` = 1 col) and the content is correct, but the surface is wrong.

---

## Fix

Add the `about-contact` class back to widget #11 + a `max-width` inline so it visually matches the original 260px panel.

### The existing `.about-contact` CSS rule (lines 1148-1156)

```css
.about-contact{
  padding:20px;
  border-radius:28px;
  background:var(--bg2);
  border:1px solid rgba(255,255,255,.055);
  box-shadow:5px 5px 16px var(--sd), -2px -2px 7px var(--sl),
            inset 0 1px 0 rgba(255,255,255,.035),
            inset 0 -1px 0 rgba(0,0,0,.4);
  display:flex;
  flex-direction:column;
  gap:14px;
}
```

The user wants this exact look — dark neomorphic surface, 28px rounded corners, inset shadows.

### Step 1 — Add the `about-contact` class + max-width

**Before:**
```html
<div class="w s12" style="display:flex;flex-direction:column;justify-content:space-between;">
```

**After:**
```html
<div class="w s12 about-contact" style="max-width:340px;justify-self:start">
```

Key points:
- Adding `about-contact` brings back the dark neomorphic surface automatically via the existing CSS rule (no need to repeat the styles inline).
- Removing the `display:flex;flex-direction:column;gap:14px` from inline styles — `.about-contact` already sets those via the CSS class.
- Adding `max-width:340px` to constrain the widget to roughly the original 260-300px visual width (slightly wider than 260 because the surrounding grid context is different, but still card-sized, not widget-row-sized).
- Adding `justify-self:start` so the widget anchors to the left of its grid cell rather than stretching to fill.

### Step 2 — Remove redundant inline display/flex styles

Since `.about-contact` provides `display:flex; flex-direction:column; gap:14px`, the widget's outer wrapper shouldn't double-set these.

The new widget wrapper should be:
```html
<div class="w s12 about-contact" style="max-width:340px;justify-self:start">
  <div class="wlbl-row">...contact label...</div>
  <div style="display:flex;flex-direction:column;gap:6px">...github card + web card (stacked vertically)...</div>
  <div style="display:flex;flex-direction:column;gap:7px">...location + available + download resume...</div>
</div>
```

DO NOT touch the inner divs — they were correctly fixed in the previous dispatch to use column flex.

### Step 3 — Light mode check

The original `.about-contact` had a light-mode override:
```css
html.light .about-contact { /* similar to .contact-row light-mode overrides */ }
```

Check `prototypes/portfolio-combined.html` for `html.light .about-contact` rules. They should apply via class. Verify light mode renders the card properly (dark in dark mode, light surface in light mode) — toggle `html.light` class via localStorage and re-screenshot.

---

## Hard rules

- DO NOT touch `.grid` CSS.
- DO NOT touch widget #9 ABOUT (already correct).
- DO NOT touch widget #10 PROJECTS STAT.
- DO NOT touch any other prototype file.
- DO NOT change widget height — `s12` is 2 rows tall, keep it.
- DO NOT change the widget content (github card, web card, location, etc.) — only the wrapper class and inline styles.
- DO NOT add the `glass` class.

---

## Verification

Use playwright (browser MCP should still be running from prior dispatches). This time:

1. Navigate to the file
2. **Scroll to the widget row** (the ABOUT+CONTACT row is below the upper widgets — scroll down ~700-900px on a 1440-wide viewport)
3. Take a **full-page screenshot** (not just viewport), save to `/tmp/widget-surface-v3.png`
4. Crop a tighter view of just the ABOUT+CONTACT row if needed for clarity

Verify in the screenshot:
- ABOUT widget is wide (~75% of row width) with the 3 bio paragraphs
- CONTACT widget is narrow (~340px max), with **dark neomorphic surface** (NOT glass) — visible `box-shadow` with dark inset + light outer halo, dark `var(--bg2)` background, 28px border-radius
- CONTACT shows: contact label, github card, web card (stacked vertically), "📍 Dieburg · near Darmstadt" line, "available for internships" badge, ↓ download resume pill — all stacked vertically
- They sit side by side with a small gap
- Pop-out hover on ABOUT still works
- Light mode also looks right (toggle `html.light` class via localStorage and re-verify)

If anything looks off (text clipped, wrong surface style, hover broken), fix and re-verify. Do NOT declare done until the screenshot matches the original bottom-section contact card look.

---

## Definition of Done

1. `git diff` shows ONLY: widget #11 wrapper gets `class="... about-contact"`, inline `max-width:340px;justify-self:start` instead of old inline flex styles. No other changes.
2. Screenshot at `/tmp/widget-surface-v3.png` (full-page, not viewport) confirms CONTACT widget has the dark neomorphic surface.
3. Commit: `fix(homepage): restore dark neomorphic surface on CONTACT widget`
4. Push: `git push origin feat/homepage-about-contact-merge`
5. Write DEVLOG entry at the top of `tasks/DEVLOG.md`.
6. Report back with: (a) confirmation done, (b) screenshot path, (c) commit hash, (d) any deviations.

---

## Constraints

- Time budget: 5–10 minutes.
- DO NOT touch other widgets, `.grid` CSS, or other prototype files.
- DO NOT push to any branch other than `feat/homepage-about-contact-merge`.
- Take a FULL-PAGE screenshot this time (not viewport-only) so widgets below the fold are visible.
