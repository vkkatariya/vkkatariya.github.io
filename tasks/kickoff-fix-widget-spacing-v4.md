# Kickoff v4: Fix widget content spacing to match original bottom-section look

> **Author:** Hermes (orchestrator)
> **Date:** 2026-06-25
> **Target:** coding agent (claude-code)
> **Mode:** Micro-loop (3 small inline style overrides)

---

## Why v4

The v3 fix added the `about-contact` class back to widget #11 (good) and made ABOUT span 3 cols (good), but the rendered content is still not right per user:

1. **ABOUT widget text is too small** — agent in v1 added inline `font-size:12.5px;line-height:1.7` on `.about-bio`, which overrides the original CSS class's `font-size:15px;line-height:1.85`. User says the original bottom-section text was bigger.

2. **CONTACT widget content is cramped/too tall** — the original `.about-contact` has `padding:20px;gap:14px`. With 6 content items stacked vertically and 14px gaps between each, the widget feels sparse and stretched. User says it's "tight" — meaning the items feel cramped together even though there's empty space.

---

## Project context

- **Project:** portfolio-website
- **Path:** `/home/radxa/dev-shared/projects/portfolio-website/`
- **Branch:** `feat/homepage-about-contact-merge`
- **File in scope:** `prototypes/portfolio-combined.html` ONLY

---

## Current state

### Widget #9 ABOUT (around line 3449-3461)
```html
<div class="w glass s22" style="display:flex;flex-direction:column;gap:12px;grid-column:span 3;">
  <div class="wlbl-row">...about</div>
  <div class="about-bio" style="font-size:12.5px;line-height:1.7;">  <!-- ← PROBLEM: inline overrides -->
    <p>I'm <strong>...Vishal</strong> — a CS student at Hochschule Darmstadt...</p>
    <p>I work across the full stack...</p>
    <p>Currently based in <strong>Dieburg · near Darmstadt</strong>...</p>
  </div>
</div>
```

The `.about-bio` CSS class (line 1140-ish) is `font-size:15px;line-height:1.85` but the inline style is **smaller**. Need to remove the inline override.

### Widget #11 CONTACT (around line 3463-3497)
```html
<div class="w s12 about-contact" style="max-width:340px;justify-self:start">
  <div class="wlbl-row">contact</div>
  <div style="display:flex;flex-direction:column;gap:6px">  <!-- internal gap -->
    <a class="cw-row">github</a>
    <a class="cw-row">web</a>
  </div>
  <div style="display:flex;flex-direction:column;gap:7px">
    <div class="loc-label">📍 Dieburg · near Darmstadt</div>
    <div class="avail-badge">available for internships</div>
    <a class="np">↓ download resume</a>
  </div>
</div>
```

The outer `.about-contact` class has `gap:14px` which is too much vertical space between sections.

---

## Fix

### Fix 1 — Remove inline font override from ABOUT widget

In widget #9, change:
```html
<!-- Before -->
<div class="about-bio" style="font-size:12.5px;line-height:1.7;">

<!-- After -->
<div class="about-bio">
```

This lets the original `.about-bio` CSS class (15px / 1.85) apply.

### Fix 2 — Tighten CONTACT widget gaps

The widget feels cramped. Two complementary changes:

**Fix 2a:** Reduce `.about-contact` outer gap. Since `.about-contact` is a global CSS class, do NOT modify it directly — instead override inline on this specific widget:

Change:
```html
<!-- Before -->
<div class="w s12 about-contact" style="max-width:340px;justify-self:start">

<!-- After -->
<div class="w s12 about-contact" style="max-width:340px;justify-self:start;gap:10px;padding:16px">
```

This reduces outer gap from 14px → 10px and padding from 20px → 16px, making the widget feel less stretched.

**Fix 2b:** Increase the gap between the github card and web card so they breathe a bit. Change:
```html
<!-- Before -->
<div style="display:flex;flex-direction:column;gap:6px">

<!-- After -->
<div style="display:flex;flex-direction:column;gap:8px">
```

A small bump (6px → 8px) makes the cards feel less crammed against each other.

**Fix 2c (optional):** Increase the gap between the contact links block and the location/availability block so the spacing feels more balanced. Change:
```html
<!-- Before -->
<div style="display:flex;flex-direction:column;gap:7px">

<!-- After -->
<div style="display:flex;flex-direction:column;gap:8px">
```

Tiny bump for visual rhythm.

---

## Hard rules

- DO NOT change the `.about-bio` CSS class itself.
- DO NOT change the `.about-contact` CSS class itself (we override inline on the widget).
- DO NOT touch widget #10 PROJECTS STAT.
- DO NOT touch any other prototype file.
- DO NOT change widget #11 wrapper class or max-width.
- DO NOT add new CSS classes.

---

## Verification

Take a **full-page screenshot** at `/tmp/widget-spacing-v4.png`. Compare visually to the v3 screenshot (`/tmp/widget-surface-v3.png`):

- ABOUT widget text should now be visibly **larger** (15px line-height 1.85 vs previous 12.5px / 1.7)
- CONTACT widget should feel **less stretched** — outer gap reduced, padding reduced
- The contact cards (github/web) should have a slightly larger internal gap (8px vs 6px)
- The widget should still look like a dark neomorphic card

If anything still looks wrong, fix and re-verify.

---

## Definition of Done

1. `git diff` shows ONLY: (a) `.about-bio` inline style removed, (b) widget #11 inline style + 2 internal `gap` values bumped. No other changes.
2. Screenshot at `/tmp/widget-spacing-v4.png` confirms spacing looks closer to original.
3. Commit: `fix(homepage): tighten widget content spacing to match original bottom-section`
4. Push: `git push origin feat/homepage-about-contact-merge`
5. Write DEVLOG entry at the top of `tasks/DEVLOG.md`.
6. Report back with: (a) confirmation done, (b) screenshot path, (c) commit hash, (d) any deviations.

---

## Constraints

- Time budget: 5 minutes.
- DO NOT touch other widgets, `.grid` CSS, or other prototype files.
- DO NOT push to any branch other than `feat/homepage-about-contact-merge`.
