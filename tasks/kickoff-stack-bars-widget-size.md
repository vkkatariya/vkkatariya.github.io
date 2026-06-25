<!--- Kickoff: Resize stack bars (cs-skills) to widget size -->

# Kickoff: Resize stack bars (cs-skills) to widget size

> **Author:** Hermes (orchestrator)
> **Date:** 2026-06-25
> **Target:** coding agent (claude-code)
> **Mode:** Micro-loop (CSS change + minor HTML adjustments)

---

## Goal

The 8 `.cs-skills` bar widgets on `/projects` (one per cs-section) currently stretch full-width because `.cs-skills-row` uses `grid-template-columns: 200px 1fr 32px` (the bar fills the remaining 1fr space).

User wants them to look like **a `.pcard` widget** — compact, contained, ~half the current width — so they look like a card rather than a full-width row.

**Visual goal:** The bar+score group should look like a contained widget (similar size to a `.pcard` or `.w.s12` widget), NOT edge-to-edge.

---

## Project context

- **Project:** portfolio-website
- **Path:** `/home/radxa/dev-shared/projects/portfolio-website/`
- **Branch:** Create new branch `feat/stack-bars-widget-size` from `dev`
- **File in scope:** `prototypes/portfolio-combined.html` ONLY

---

## Current state (verified via grep)

### Current CSS (added by claude-code skill-bars dispatch)

```css
.cs-skills{
  display:flex;flex-direction:column;gap:10px;
  margin-bottom:32px;
}
.cs-skills-row{
  display:grid;
  grid-template-columns: 200px 1fr 32px;
  gap:14px;align-items:center;
  font-size:11px;
}
@media(max-width:700px){
  .cs-skills-row{grid-template-columns:120px 1fr 28px;gap:8px}
}
```

The `1fr` in `grid-template-columns: 200px 1fr 32px` makes the bar stretch to fill remaining width.

### Reference: `.pcard` widget sizing

```css
.pcard{
  padding:22px;border-radius:20px;
  ...
}
```

A `.pcard` is a card-shaped container with padding and rounded corners. The user wants the cs-skills row to look like this — contained, not stretched.

---

## Fix

### Step 1 — Update `.cs-skills` to have widget-style container

Change `.cs-skills` to add a max-width so the entire stack widget doesn't stretch full-width:

```css
.cs-skills{
  display:flex;flex-direction:column;gap:10px;
  margin-bottom:32px;
  max-width: 480px;  /* caps widget width — half-ish of full cs-section width (~1100px) */
}
```

The `max-width: 480px` makes the entire `.cs-skills` container take up about half the cs-section width. Adjust to taste (440px-520px range is fine) — pick what looks right when rendered.

### Step 2 — Update `.cs-skills-row` to keep name + bar + score in the contained widget

Change `.cs-skills-row` to use a fixed bar width instead of `1fr`:

```css
.cs-skills-row{
  display:grid;
  grid-template-columns: 160px 200px 32px;  /* fixed widths: name 160, bar 200, score 32 */
  gap:14px;align-items:center;
  font-size:11px;
}
@media(max-width:700px){
  .cs-skills-row{grid-template-columns:100px 140px 28px;gap:8px}
}
```

The bar column is now `200px` (fixed) instead of `1fr` (fluid). This means the bar will NOT stretch — it'll be exactly 200px wide.

Combined with Step 1's `max-width: 480px` on `.cs-skills`, the entire widget becomes:
- Name (160px) + gap (14px) + Bar (200px) + gap (14px) + Score (32px) = ~420px
- Plus padding from `.cs-skills` container ≈ 480px total
- Sits in the left half of the cs-section, leaving the right half empty

### Step 3 — Visual treatment (optional but recommended)

To make the cs-skills widget feel more "widget-like" (matching `.pcard`), add:

```css
.cs-skills{
  ...
  background: var(--bg2);  /* matches .w and .pcard */
  border: 1px solid var(--w06);  /* subtle border like other widgets */
  border-radius: 20px;  /* matches .pcard */
  padding: 22px;  /* matches .pcard */
}
```

If you apply this, the cs-skills widget will visually look like a `.pcard` — contained card with subtle surface, sitting in the left half of the cs-section.

If you don't apply this (just keep Steps 1+2), the cs-skills will be a half-width content block without visual container.

---

## Hard rules

- DO NOT touch any other prototype file.
- DO NOT change the score values, names, or color bands.
- DO NOT change the `.cs-skills-bar`, `.cs-skills-fill`, `.cs-skills-name`, `.cs-skills-score` classes — only `.cs-skills` and `.cs-skills-row`.
- DO NOT touch the existing `.cs-stack` (it's already removed — verify with grep that 0 matches).
- DO NOT change the .cs-skills HTML structure (38 rows across 8 sections stays the same).
- DO NOT change the SKILLS widget on the homepage (uses different classes `.skill-row`, `.skill-track`, `.skill-fill` — leave those alone).

---

## Verification

```bash
# 1. Confirm cs-skills widget is now size-constrained
grep -A 1 '^\.cs-skills{' prototypes/portfolio-combined.html | head -5
# Expected: max-width property present (440-520px)

# 2. Confirm cs-skills-row no longer uses 1fr
grep -E 'cs-skills-row.*grid-template-columns' prototypes/portfolio-combined.html
# Expected: NOT containing "1fr"

# 3. Confirm HTML structure unchanged
grep -c 'class="cs-skills-row"' prototypes/portfolio-combined.html
# Expected: 38 (no change)

# 4. Confirm score values + names unchanged
grep -c 's-high\|s-mid\|s-low' prototypes/portfolio-combined.html
# Expected: same as before (~38 across all 3 classes combined)

# 5. Homepage SKILLS widget (uses different class names) NOT touched
grep -c 'class="skill-row"' prototypes/portfolio-combined.html
# Expected: same as before (whatever it was — should be 6 or so for Python, ML/AI, TypeScript, Docker, Linux, SvelteKit)
```

If playwright works, take a screenshot at `/tmp/stack-bars-widget-size.png` showing a cs-section (e.g., finance-buddy) with the new half-width stack widget.

---

## Definition of Done

1. `git diff` shows: ONLY changes to `.cs-skills` and `.cs-skills-row` CSS rules. Possibly adding `max-width` to `.cs-skills` and changing `1fr` to fixed pixel width in `.cs-skills-row`. **No HTML changes, no other CSS changes.**
2. grep verifications pass.
3. Commit: `polish(projects): size cs-skills bars to widget-half-width`
4. Push: `git push -u origin feat/stack-bars-widget-size`
5. Write DEVLOG entry at the top of `tasks/DEVLOG.md`.
6. Report back with: (a) confirmation done, (b) chosen max-width + bar width values, (c) grep results, (d) commit hash, (e) any deviations.

---

## Constraints

- Time budget: ~10 minutes.
- Single file: `prototypes/portfolio-combined.html`.
- Adjust the exact pixel values to taste — pick what looks right when rendered.

---

## Failure modes to avoid

- **Don't change HTML** — only CSS.
- **Don't change the SKILLS widget** — that's a different class chain (`.skill-row`, etc.) on the homepage.
- **Don't touch the existing `.cs-stack`** — already removed; verify and leave alone.
- **Don't change score values or names** — only the visual width.
- **Don't apply `padding`/`background`/`border` changes unless asked** — Step 3 is optional.
