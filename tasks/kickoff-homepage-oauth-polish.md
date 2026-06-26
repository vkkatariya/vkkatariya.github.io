# Kickoff: Two homepage widget polish fixes (project title fonts + widget sizing)

> **Author:** Hermes (orchestrator)
> **Date:** 2026-06-25
> **Target:** coding agent (agy / claude-code)
> **Mode:** Execution (CSS + minimal HTML, single file)

---

## Goal

Two scoped polish fixes to the new "FEATURED: Hermes One OAuth Fork" widget on the homepage (added in commit `ebb4e11` of `feat/homepage-oauth-spotlight-widget`):

1. **Match project title font size** to the adjacent FEATURED PROJECT widget on the left (Finance Buddy) so the two projects feel visually balanced.
2. **Shrink the new widget slightly** so the CONTACT widget aligns inline with the ABOUT widget on the right side.

Both are visual-balance / sizing fixes. No new widgets, no layout restructure, no design tokens.

---

## Project context

- **Project:** portfolio-website
- **Path:** `/home/radxa/dev-shared/projects/portfolio-website/`
- **Branch:** `feat/homepage-oauth-spotlight-widget` (already created)
- **File in scope:** `prototypes/portfolio-combined.html` ONLY

---

## Current state (before fixes)

The new Hermes OAuth widget was added at line 3520 of `prototypes/portfolio-combined.html` (commit `ebb4e11`). Its current implementation:

```html
<!-- 12 · FEATURED: HERMES ONE OAUTH FORK · 1×2 — NeoPOP highlight -->
<div class="w s12" style="display:flex;flex-direction:column;gap:10px;padding:14px;position:relative;overflow:hidden">
  <div class="wlbl-row">...</div>
  <div style="font-family:var(--font-ndot);font-size:clamp(28px,3.5vw,42px);font-weight:800;letter-spacing:-1.5px;line-height:.95;margin-top:2px;color:var(--w)">
    Hermes One<br>OAuth Fork
  </div>
  ...
```

The adjacent FEATURED PROJECT widget (Finance Buddy, widget 7 at line 3466):

```html
<div class="w s22" style="display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden">
  ...
  <div class="hero-stats" style="font-size:48px;font-weight:700;letter-spacing:-2px;line-height:.9;font-family:var(--font-ndot);color:var(--w)">
    Finance<br>Buddy
  </div>
  ...
```

**Visual mismatch:** the Finance Buddy title is `font-size:48px` (fixed), while Hermes OAuth is `clamp(28px,3.5vw,42px)` (responsive, maxes at 42px). On most viewport sizes the Hermes OAuth title will look smaller than Finance Buddy's, creating an awkward side-by-side imbalance.

**Sizing issue:** the new widget is `s12` (1×2) which is the same size as STACK. The CONTACT widget (also `s12` 1×2) sits below the new widget, but visually the user wants CONTACT to align INLINE with ABOUT (right side, same row). Currently CONTACT is below STACK + NEW widget.

---

## Fix 1 — Match project title font sizes

**Goal:** Make the Hermes OAuth title visually balanced with the Finance Buddy title.

**Approach:** Change the Hermes OAuth title `font-size` from `clamp(28px,3.5vw,42px)` to `clamp(32px,3.8vw,44px)`. Slightly bigger to better match the 48px Finance Buddy title while keeping the responsive clamping.

**Specifically:**

In `prototypes/portfolio-combined.html` at the Hermes OAuth widget block (line ~3525), change:

```html
<div style="font-family:var(--font-ndot);font-size:clamp(28px,3.5vw,42px);font-weight:800;letter-spacing:-1.5px;line-height:.95;margin-top:2px;color:var(--w)">
```

to:

```html
<div style="font-family:var(--font-ndot);font-size:clamp(36px,4.2vw,48px);font-weight:800;letter-spacing:-1.8px;line-height:.95;margin-top:2px;color:var(--w)">
```

**Rationale for the new values:**
- `36px` min (was 28px) — closer to Finance Buddy's 48px even on small viewports
- `4.2vw` preferred (was 3.5vw) — scales up faster with viewport
- `48px` max (was 42px) — matches Finance Buddy's exact 48px at large viewports
- `-1.8px` letter-spacing (was -1.5px) — slightly tighter to match Finance Buddy's `-2px`

If this still looks off after testing in browser, try `clamp(38px,4.4vw,50px)` instead. Don't go higher than 50px — that would overflow the 1×2 widget height.

---

## Fix 2 — Shrink the new widget so CONTACT aligns with ABOUT

**Goal:** The CONTACT widget (260px wide, `align-self:start`) should sit visually next to the ABOUT widget on the right side of the grid. Currently the new widget's size pushes CONTACT down to the next row.

**Approach:** Reduce the new widget's max-height so it doesn't take a full row. Add `max-height` and a flex-shrink to the widget's inline style.

**Specifically:**

In `prototypes/portfolio-combined.html` at the Hermes OAuth widget block (line ~3521), change:

```html
<div class="w s12" style="display:flex;flex-direction:column;gap:10px;padding:14px;position:relative;overflow:hidden">
```

to:

```html
<div class="w s12" style="display:flex;flex-direction:column;gap:10px;padding:14px;position:relative;overflow:hidden;max-height:180px">
```

**Or alternative:** Change the widget class from `s12` (1×2) to `s11` (1×1) so it's a smaller square widget:

```html
<div class="w s11" style="display:flex;flex-direction:column;gap:8px;padding:12px;position:relative;overflow:hidden">
```

This makes the new widget a compact 1×1 square (the same size as PROJECTS STAT, HOMELAB, CURRENTLY BUILDING widgets). Tightens content, removes row pressure, lets CONTACT naturally flow into the next slot.

**Choose between options A and B based on what looks best in the browser:**

- **Option A** (`max-height:180px`): keeps the 1×2 class so content has room. Limits widget height so the row doesn't get too tall.
- **Option B** (`s11`): tighter, square widget. Content needs to compress — may require reducing the 3 stats row to fit, or removing the tagline.

**Recommended: try Option A first.** If the widget looks crowded at 180px max-height, switch to Option B.

If Option B, also need to compress internal content. Suggested compact version:

```html
<div class="w s11" style="display:flex;flex-direction:column;gap:6px;padding:12px;position:relative;overflow:hidden">
  <div class="wlbl-row">...</div>
  <div style="font-family:var(--font-ndot);font-size:clamp(20px,2.2vw,26px);font-weight:800;letter-spacing:-1px;line-height:.95;margin-top:2px;color:var(--w)">
    Hermes OAuth
  </div>
  <div style="display:flex;gap:10px;margin-top:auto;font-family:'DM Mono',monospace">
    <div style="display:flex;flex-direction:column;gap:2px">
      <div style="font-size:18px;font-weight:500;color:var(--green);line-height:1">13</div>
      <div style="font-size:8px;color:var(--w30);letter-spacing:1.5px;text-transform:uppercase">PRs merged</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:2px">
      <div style="font-size:18px;font-weight:500;color:var(--w);line-height:1">38/38</div>
      <div style="font-size:8px;color:var(--w30);letter-spacing:1.5px;text-transform:uppercase">tests</div>
    </div>
  </div>
</div>
```

(Note: with 1×1 widget, drop the "4 phases" stat (keep only 2 stats), drop the tagline, simplify title to "Hermes OAuth" — fits better in compact square.)

---

## Hard rules

1. **DO NOT change** any other widget on the homepage.
2. **DO NOT change** the CONTACT widget itself — only ensure the new widget's size allows CONTACT to flow correctly.
3. **DO NOT change** the kickoff file or any /tasks files.
4. **DO NOT add** new design tokens. Use existing CSS variables.
5. **DO NOT introduce** new SVG icons or new content — only adjust sizing.
6. **Test in browser** after both fixes to confirm CONTACT visually aligns with ABOUT.

---

## Verification

```bash
# Fix 1: Hermes OAuth title font-size changed
grep -n 'clamp(28px,3.5vw,42px)' prototypes/portfolio-combined.html
# Should return 0 (old value gone)
grep -n 'clamp(36px,4.2vw,48px)' prototypes/portfolio-combined.html
# Should return 1 (new value present)

# Fix 2: widget max-height or class change applied
grep -n 'max-height:180px' prototypes/portfolio-combined.html
# Should return 1 if Option A chosen
grep -n 'class="w s11".*Hermes\|Hermes.*class="w s11"' prototypes/portfolio-combined.html
# Should return 1 if Option B chosen (the new widget becomes s11)

# Regression: existing widgets unchanged
grep -c 'class="w ' prototypes/portfolio-combined.html
# Should be 12 (no widgets added/removed)

# Regression: existing liquid-glass + svg icon work preserved
grep -c 'linear-gradient(135deg, rgba(255,255,255,.08)' prototypes/portfolio-combined.html
# Should be >= 1
grep -c '<div class="wlbl-row">' prototypes/portfolio-combined.html
# Should be 19 (was 18 before kickoff + 1 new widget)

# Visual check via browser
# Open http://127.0.0.1:8900/prototypes/portfolio-combined.html in browser
# Confirm: CONTACT visually aligned with ABOUT (right column, same row)
# Confirm: Hermes OAuth title size matches Finance Buddy title visually
```

---

## Definition of Done

1. `git diff` shows ONLY: (a) font-size change on Hermes OAuth title, (b) widget size/class change on the new widget. No other content changes.
2. All 7 grep verifications pass.
3. Browser-tested: CONTACT aligns with ABOUT; Hermes OAuth title matches Finance Buddy visually.
4. Commit: `fix(homepage): match hermes oauth title to finance buddy size; compact widget for contact alignment`
5. Push: `git push origin feat/homepage-oauth-spotlight-widget`
6. Return: branch, commit SHA, grep results, browser confirmation, which option (A or B) was chosen, any visual issues.

---

## Constraints

- Time budget: ~10 minutes.
- Single file: `prototypes/portfolio-combined.html`.
- Use existing CSS classes — do not invent new ones.

---

## Failure modes to avoid

- **Don't make the widget too small** — content needs to remain readable.
- **Don't change CONTACT's inline styles** (`width:260px`, `align-self:start`, etc.) — they're load-bearing.
- **Don't move HTML blocks around** — only adjust sizes.
- **Don't change other widget's CSS** — keep changes scoped to the new widget only.

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
4. `git commit -m "fix(homepage): match hermes oauth title to finance buddy size; compact widget for contact alignment"`.
5. `git push origin feat/homepage-oauth-spotlight-widget`.
6. Return: branch, commit SHA, grep results, browser confirmation, which option (A or B) was chosen, any visual issues.