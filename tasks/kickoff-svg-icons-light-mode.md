# Kickoff: Fix SVG icon visibility on all pages in light mode

> **Author:** Hermes (orchestrator)
> **Date:** 2026-06-25
> **Target:** coding agent (agy / claude-code)
> **Mode:** Execution (CSS only, single file)

---

## Goal

Fix SVG icon visibility in light mode (`html.light`) across all 5 pages (`/`, `/projects`, `/roadmap`, `/about`, `/me`). In dark mode the icons use `rgba(255,255,255,...)` strokes/fills which look great on dark backgrounds — but become invisible (white-on-white) in light mode.

**Scope is CSS-only.** No new SVG icons, no structural changes, no design tokens — just override existing SVG colors in light mode.

---

## Project context

- **Project:** portfolio-website
- **Path:** `/home/radxa/dev-shared/projects/portfolio-website/`
- **Branch:** `feat/svg-icons-light-mode` (already created)
- **File in scope:** `prototypes/portfolio-combined.html` ONLY (CSS section)

---

## Audit summary (already done — read this before making changes)

### Total SVG inventory

- **137 `<svg>` tags** total in `prototypes/portfolio-combined.html`
- **113** have `class="ico"` — already covered by EXISTING `html.light .ico svg` rules (work correctly)
- **24** don't have `class="ico"` — need SEPARATE light-mode handling

### Existing light-mode overrides (do NOT touch these — they work)

Located in the CSS section of `prototypes/portfolio-combined.html` (around line 3130-3170 — search for `html.light .ico`):

```css
html.light .ico svg [stroke*="rgba(255,255,255"],
html.light .ico svg [stroke*="rgba(255, 255, 255"] { stroke: rgba(13,13,15,.25) !important; }

html.light .ico svg [fill*="rgba(255,255,255"],
html.light .ico svg [fill*="rgba(255, 255, 255"] { fill: rgba(13,13,15,.06) !important; }

html.light .ico svg [stroke*="rgba(61,220,132"],
html.light .ico svg [fill*="rgba(61,220,132"] { stroke: var(--green); fill: var(--green); }

html.light .ico-blink2,
html.light .ico-blink3 { filter: brightness(.8); }
```

**Confirmed via browser DOM inspection:** these rules correctly recolor 123 SVGs in light mode (`.ico svg [stroke]` matches descendant elements that have the white-ish stroke).

### The bug: SVGs that are THEMSELVES `.ico-X` (not children of `.ico`)

When the `<svg>` itself carries a class like `class="ico ico-blink"` or `class="ico-float"` (alone, not inside a `.ico` parent), the existing selector `.ico svg [stroke]` does NOT match because:
- The SVG is the `.ico` element itself, not a child
- The rule looks for `[stroke]` elements **inside** an SVG that's inside a `.ico`
- When SVG IS the `.ico`, there's no nested SVG to match against

**Confirmed via browser test in light mode:** the following SVGs still show white-on-white:
- `class="ico-blink"` (1 SVG)
- `class="ico-blink2"` (2 SVGs)
- `class="ico-blink3"` (1 SVG)
- `class="ico-float"` (3 SVGs as primary class)
- `class="ico-float2"` (1 SVG)
- `class="ico-spin"` (1 SVG)

Plus the 4 project visualization SVGs (which have no class at all but contain `rgba(255,255,255,...)` strokes):
- The `.routing-flow` SVG (around line 4365)
- The `.phase-timeline` SVG (around line 4485)
- The `.route-flow` SVG (around line 4617)
- The `.module-pipeline` SVG (around line 4733)

### Clock face SVG using literal `stroke="white"` and `fill="white"`

Lines 3312-3321: a `.ico-spin` SVG inside the CLOCK widget decoration. Uses literal `white` (not rgba) so the existing attribute-selector `*="rgba(255,255,255"` doesn't match. It's wrapped in `<div style="opacity:.06">` so very faint — but should still be handled.

---

## Tasks

### Task 1 — Extend existing overrides for `.ico-X` standalone classes

**Goal:** Make the same light-mode recoloring apply to SVGs whose root element has `class="ico-blink"`, `class="ico-blink2"`, etc.

**Where to add:** Immediately after the existing `html.light .ico-blink2, .ico-blink3 { filter: brightness(.8); }` rule.

**Add these new rules:**

```css
/* When the SVG itself carries the .ico class (no nested svg), apply the same
   color overrides directly to the SVG element. */
html.light svg.ico-blink,
html.light svg.ico-blink2,
html.light svg.ico-blink3,
html.light svg.ico-float,
html.light svg.ico-float2,
html.light svg.ico-pulse,
html.light svg.ico-throb,
html.light svg.ico-spin {
  /* Inherit the parent container's foreground color — most icons use this */
  color: rgba(13, 13, 15, 0.4);
}

/* Override children with rgba(255,255,255) strokes/fills.
   These SVGs may have child elements with white-ish colors that need overriding. */
html.light svg.ico-blink [stroke*="rgba(255,255,255"],
html.light svg.ico-blink2 [stroke*="rgba(255,255,255"],
html.light svg.ico-blink3 [stroke*="rgba(255,255,255"],
html.light svg.ico-float [stroke*="rgba(255,255,255"],
html.light svg.ico-float2 [stroke*="rgba(255,255,255"],
html.light svg.ico-pulse [stroke*="rgba(255,255,255"],
html.light svg.ico-throb [stroke*="rgba(255,255,255"],
html.light svg.ico-spin [stroke*="rgba(255,255,255"],
html.light svg.ico-blink [fill*="rgba(255,255,255"],
html.light svg.ico-blink2 [fill*="rgba(255,255,255"],
html.light svg.ico-blink3 [fill*="rgba(255,255,255"],
html.light svg.ico-float [fill*="rgba(255,255,255"],
html.light svg.ico-float2 [fill*="rgba(255,255,255"],
html.light svg.ico-pulse [fill*="rgba(255,255,255"],
html.light svg.ico-throb [fill*="rgba(255,255,255"],
html.light svg.ico-spin [fill*="rgba(255,255,255"] {
  stroke: rgba(13, 13, 15, 0.25);
  fill: rgba(13, 13, 15, 0.06);
}

/* Clock face uses literal 'white' (not rgba) — handle separately */
html.light svg.ico-spin [stroke="white"] { stroke: rgba(13, 13, 15, 0.15); }
html.light svg.ico-spin [fill="white"] { fill: rgba(13, 13, 15, 0.1); }
```

**Why this works:** SVG `color` attribute is inherited by child elements with `stroke="currentColor"` or `fill="currentColor"`. But most of our icons use explicit `rgba(255,255,255,...)` colors. For those, the `svg.X [stroke*="rgba(255,255,255"]` selectors override the white-ish colors to dark-on-light variants.

### Task 2 — Add light-mode overrides for project visualization SVGs

**Goal:** The 4 rich visualization SVGs in `.routing-flow`, `.phase-timeline`, `.route-flow`, `.module-pipeline` use `rgba(255,255,255,...)` for connector lines and shadow layers.

**Where to add:** Right after the Task 1 rules.

**Add these rules:**

```css
/* Project visualization SVGs (cs-section vis-wraps) */
html.light svg.routing-flow,
html.light svg.phase-timeline,
html.light svg.route-flow,
html.light svg.module-pipeline {
  /* These SVGs use white-ish strokes for connectors on dark backgrounds.
     Invert them to dark-on-light using CSS filter. */
  filter: invert(0.92) hue-rotate(180deg);
}
```

**Why `filter: invert()`:** the project visualizations are complex multi-color SVGs with white connector lines, var(--green) dots, var(--blue) arrows, etc. Manually overriding each color would be tedious and fragile. The `filter: invert(0.92) hue-rotate(180deg)` trick:
- `invert(0.92)` flips white↔black (0.92 = mostly inverted but leaves some color)
- `hue-rotate(180deg)` keeps the colors recognizable (otherwise red becomes cyan etc.)

Test in browser to verify the result. If `filter` looks weird, fall back to per-color overrides.

**If filter doesn't work well, use this alternative** (manually override):

```css
html.light svg.routing-flow [stroke*="rgba(255,255,255"],
html.light svg.phase-timeline [stroke*="rgba(255,255,255"],
html.light svg.route-flow [stroke*="rgba(255,255,255"],
html.light svg.module-pipeline [stroke*="rgba(255,255,255"],
html.light svg.routing-flow [fill*="rgba(255,255,255"],
html.light svg.phase-timeline [fill*="rgba(255,255,255"],
html.light svg.route-flow [fill*="rgba(255,255,255"],
html.light svg.module-pipeline [fill*="rgba(255,255,255"] {
  stroke: rgba(13, 13, 15, 0.4);
  fill: rgba(13, 13, 15, 0.06);
}
```

### Task 3 — Visual verification in browser

After applying both rule sets, verify in browser:

```bash
# Start a local server if not running
python3 -m http.server 8900 &
```

1. Open `http://127.0.0.1:8900/prototypes/portfolio-combined.html` in browser
2. Toggle to light mode (top-right "EN" or "Toggle theme" button — depends on current UI)
3. **Homepage:** confirm clock decoration animation visible, `.ico-float` on FEATURED PROJECT widget is visible, `.ico-blink` on PROJECTS widget stat visible
4. **/projects:** scroll through cs-sections, confirm the 4 visualization SVGs (routing-flow, phase-timeline, route-flow, module-pipeline) render their connectors in dark color, not white
5. **/roadmap, /about, /me:** scan for any invisible icons, fix ad-hoc as you go

---

## Hard rules

1. **DO NOT touch** the existing 4 `html.light .ico` rules — they work for 123 SVGs and breaking them would regress existing functionality.
2. **DO NOT introduce** new CSS variables or design tokens — use the existing `rgba(13,13,15,...)` (the dark text color used in light mode).
3. **DO NOT modify** SVG markup (the inline `<svg>` tags). Only add CSS rules.
4. **DO NOT change** dark mode rendering. Test that dark mode still looks identical to before.
5. **DO NOT add** rules for the contact card icons (`.cw-icon`, `.cc-icon`, `.cv-dl`) — they use `fill="currentColor"` and inherit from the parent's text color, which already works correctly in light mode.
6. **DO NOT change** the hidden SVG symbol library (`#ic-moon`, `#ic-sun`) — they're never rendered.

---

## Verification

```bash
# 1. New CSS rules added
grep -c 'html.light svg.ico-blink' prototypes/portfolio-combined.html
# Should return >= 2 (stroke + fill rules)
grep -c 'html.light svg.ico-float' prototypes/portfolio-combined.html
# Should return >= 2
grep -c 'html.light svg.ico-spin' prototypes/portfolio-combined.html
# Should return >= 2

# 2. Project visualization SVGs handled
grep -c 'html.light svg.routing-flow' prototypes/portfolio-combined.html
# Should return >= 1
grep -c 'html.light svg.phase-timeline' prototypes/portfolio-combined.html
# Should return >= 1
grep -c 'html.light svg.route-flow' prototypes/portfolio-combined.html
# Should return >= 1
grep -c 'html.light svg.module-pipeline' prototypes/portfolio-combined.html
# Should return >= 1

# 3. Existing overrides preserved
grep -c 'html.light .ico svg \[stroke' prototypes/portfolio-combined.html
# Should return >= 1 (existing rules still there)
grep -c 'html.light .ico svg \[fill' prototypes/portfolio-combined.html
# Should return >= 1

# 4. Browser visual check (manual):
# - Toggle to light mode
# - Confirm clock face decoration visible on homepage
# - Confirm 4 visualization SVGs render connectors in dark color
# - Confirm .ico-blink/.ico-float animations visible on their respective widgets
```

---

## Definition of Done

1. `git diff` shows ONLY: new CSS rules added to the `<style>` section. No SVG markup changes.
2. All grep verifications pass.
3. Browser-tested in both dark and light mode:
   - Dark mode looks identical to before (no regressions)
   - Light mode renders all SVGs visibly (no white-on-white)
4. Commit: `fix(icons): light-mode visibility for .ico-X SVGs and project visualizations`
5. Push: `git push -u origin feat/svg-icons-light-mode`
6. Return: branch, commit SHA, grep results, browser screenshot if possible, any deviations.

---

## Constraints

- Time budget: ~20 minutes.
- Single file: `prototypes/portfolio-combined.html` (CSS section only).
- Use existing CSS variables — do not invent new ones.

---

## Failure modes to avoid

- **Don't break dark mode.** Test both modes before committing.
- **Don't add rules that overlap with existing `html.light .ico` rules** — duplicate selectors can cause specificity wars.
- **Don't use `!important` more than necessary** — only the existing rules use it; new rules should be specific enough on their own.
- **Don't change the SVG markup** — even minor attribute changes can affect rendering.
- **Don't introduce new colors** — use `rgba(13,13,15,...)` (the existing dark text color in light mode) for all overrides.

---

## Quick setup for dispatch

```bash
cd ~/dev-shared/projects/portfolio-website
git checkout feat/svg-icons-light-mode
git pull origin feat/svg-icons-light-mode  # if remote is ahead
```

---

## END-OF-TASK CONTRACT (mandatory)

1. Verify with grep commands above.
2. `git status` — confirm only `prototypes/portfolio-combined.html` modified.
3. `git add prototypes/portfolio-combined.html`.
4. `git commit -m "fix(icons): light-mode visibility for .ico-X SVGs and project visualizations"`.
5. `git push -u origin feat/svg-icons-light-mode`.
6. Return: branch, commit SHA, grep results, browser confirmation (both dark AND light mode), any deviations.

---

**Tip:** Browser test sequence after applying:
1. Open homepage in dark mode — confirm clock decoration, FEATURED widget animations all visible
2. Toggle to light mode (top-right theme button) — confirm same animations now visible against light background
3. Switch to /projects — scroll to Hermes OAuth cs-section, confirm routing-flow diagram is dark (not invisible white-on-white)
4. Switch to /about — confirm all icons visible
5. Toggle back to dark mode — verify no regressions