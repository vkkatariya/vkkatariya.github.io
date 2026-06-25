# Kickoff v2 (corrected): Restore the original bottom-section split proportions

> **Author:** Hermes (orchestrator)
> **Date:** 2026-06-25
> **Target:** coding agent (claude-code)
> **Mode:** Micro-loop (class restore + inline span + style restoration)

---

## Why v2

The previous kickoff (`tasks/kickoff-fix-widget-widths.md`) told the agent to make BOTH widgets `s22`. That was wrong. The user wants the widgets to look like the **original bottom-section split** — about widget wide, contact widget stays at its original narrow size from when it lived inside `.about-section#contact`.

---

## The original sizes (READ THESE FIRST)

When CONTACT lived inside the bottom `.about-section#contact`, the CSS was:

**`.about-grid`** (parent 2-col layout):
```css
display: grid;
grid-template-columns: 1fr 260px;
gap: 20px;
```

**`.about-contact`** (the card itself):
```css
padding: 20px;
border-radius: 28px;
background: var(--bg2);
border: 1px solid rgba(255, 255, 255, .055);
box-shadow: 5px 5px 16px var(--sd), -2px -2px 7px var(--sl),
            inset 0 1px 0 rgba(255, 255, 255, .035),
            inset 0 -1px 0 rgba(0, 0, 0, .4);
display: flex;
flex-direction: column;
gap: 14px;
```

**Key facts:**
- CONTACT was a **fixed-width 260px panel** with **dark neomorphic surface** (NOT glass).
- ABOUT-bio was `1fr` (took the rest of the row).
- They sat side by side with a 20px gap.

The previous dispatch broke this by making CONTACT `s22` (which gave it ~700px width) and dropping the `inv` class (which gave it glass styling instead of neomorphic).

---

## Project context

- **Project:** portfolio-website
- **Path:** `/home/radxa/dev-shared/projects/portfolio-website/`
- **Branch:** `feat/homepage-about-contact-merge`
- **File in scope:** `prototypes/portfolio-combined.html` ONLY
- **Current state of the two widgets (after the bad fix):**
  - Widget #9 ABOUT: `class="w glass s22"` (2 cols × 2 rows, content looks good)
  - Widget #11 CONTACT: `class="w s22"` with glass styling (WRONG — should be the dark neomorphic 260px panel)

---

## Fix

### Step 1 — Restore widget #11 CONTACT to its original size and dark neomorphic styling

Replace the current widget #11 wrapper + wrapper styles to recreate the original bottom-section contact card.

**Before:**
```html
<div class="w s22" style="display:flex;flex-direction:column;justify-content:space-between;">
  ...contact content...
</div>
```

**After:**
```html
<div class="w s12 about-contact" style="display:flex;flex-direction:column;gap:14px;padding:20px;border-radius:28px;background:var(--bg2);border:1px solid rgba(255,255,255,.055);box-shadow:5px 5px 16px var(--sd),-2px -2px 7px var(--sl),inset 0 1px 0 rgba(255,255,255,.035),inset 0 -1px 0 rgba(0,0,0,.4);max-width:340px;">
  ...contact content (unchanged)...
</div>
```

Key points:
- Class `s12` (1 col × 2 rows of the .grid)
- Class `about-contact` reapplied so it picks up the existing `.about-contact` styles (the dark surface, the neomorphic shadow, the column flex layout)
- Inline styles preserve the original look even if `.about-contact` isn't fully self-contained
- `max-width: 340px` to keep it visually narrow like the original 260px panel (slightly wider for the grid context but still card-sized, not widget-sized)
- Content INSIDE the widget stays exactly as the previous agent left it (github card, web card, location line, available badge, download resume pill — stacked vertically)

If the existing content inside CONTACT currently has an inner 2-column grid for the github/web cards (added by the previous bad dispatch), you may REMOVE that inner grid — restore to vertical stacking (one card per row) since the widget is narrow again.

### Step 2 — Stretch widget #9 ABOUT to fill the rest of the row

Widget #9 ABOUT is already `s22` (2 cols × 2 rows). To fill the row with CONTACT back at 1 col, ABOUT needs to span 3 columns.

Add inline `grid-column: span 3` to the ABOUT widget:

- **Before:** `<div class="w glass s22" style="display:flex;flex-direction:column;gap:12px;">`
- **After:** `<div class="w glass s22" style="display:flex;flex-direction:column;gap:12px;grid-column:span 3;">`

This stretches ABOUT across 3 of the 4 grid columns while CONTACT stays at 1 column (the original narrow dark glass card).

### Step 3 — Light mode styling

The original `.about-contact` had light-mode overrides too:
```css
html.light .about-contact { /* similar overrides via .contact-row or inherited */ }
```

Check `prototypes/portfolio-combined.html` for `html.light .about-contact` and any `.contact-row` light-mode rules. They should still apply because you're adding `class="about-contact"` back. Verify light mode renders the card properly (dark in dark mode, light surface in light mode). If something looks off, add minimal inline light-mode color overrides.

---

## Hard rules

- DO NOT touch `.grid` CSS.
- DO NOT touch widget #10 PROJECTS STAT or any other widget.
- DO NOT touch any other prototype file.
- DO NOT change widget heights.
- DO NOT change the widget content (github card, web card, etc.) — only the wrapper class and inline styles.
- DO NOT add the `glass` class to widget #11 — it should NOT be glass. It should be the dark neomorphic surface like the original.

---

## Verification

Use playwright (browser MCP should still be running from prior dispatches) to take a screenshot of `#pg-home` scrolled to where the ABOUT+CONTACT row is. Save to `/tmp/widget-widths-v2.png`.

Verify in screenshot:
- ABOUT widget is **wide** (~75% of row width) and shows all 3 bio paragraphs
- CONTACT widget is **narrow** (~25% of row width, max ~340px), with the **dark neomorphic surface** (NOT glass), showing: github card, web card, location line "📍 Dieburg · near Darmstadt", "available for internships" badge, ↓ download resume button — all stacked vertically
- They sit side by side with a small gap, similar to the original bottom-section proportions
- ABOUT wider than CONTACT (clearly readable difference)
- Pop-out hover still works
- Light mode still renders correctly (CONTACT card surface should change to a light variant)

If anything looks off (text clipped, wrong surface style, awkward vertical alignment), fix and re-verify. Do NOT declare done until the screenshot matches the original bottom-section proportions.

---

## Definition of Done

1. `git diff` shows ONLY: widget #11 wrapper restored (class + inline styles + class="about-contact" added back, optional inner-2col-grid removal), widget #9 has `grid-column: span 3` added inline. No other changes.
2. Screenshot at `/tmp/widget-widths-v2.png` confirms correct proportions (ABOOT wide, CONTACT narrow dark card, side by side, no gap).
3. Commit: `fix(homepage): restore ABOUT wide + CONTACT narrow dark-card proportions`
4. Push: `git push origin feat/homepage-about-contact-merge`
5. Write DEVLOG entry at the top of `tasks/DEVLOG.md`.
6. Report back with: (a) confirmation done, (b) screenshot path, (c) commit hash, (d) any deviations.

---

## Constraints

- Time budget: 5–10 minutes.
- DO NOT touch other widgets, `.grid` CSS, or other prototype files.
- DO NOT push to any branch other than `feat/homepage-about-contact-merge`.
- Commit incrementally if needed.
