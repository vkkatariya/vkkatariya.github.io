# Kickoff v2: Fix redirect links on homepage widgets

> **Author:** Hermes (orchestrator)
> **Date:** 2026-06-25
> **Target:** coding agent (claude-code)
> **Mode:** Execution (5 widget fixes on single-file SPA)

---

## What changed from v1

The v1 kickoff stalled an agent — they did no work for ~30 min. Issues with v1:
- Required verifying 4 github URLs with curl HEAD (gate could block forever if URL 404s)
- Required 3 separate screenshots at specific paths
- Bundled 5 distinct fixes into one dispatch (too much context)

v2 fixes these: split into 2 sub-tasks (this file covers SUB-TASK 1 only), softer URL checks, single screenshot.

---

## Goal

Fix redirect links on 3 widgets on the homepage (`#pg-home`):
1. NOW widget → clickable, opens /projects#orlon-bot
2. HOMELAB widget → clickable, opens /projects#homelab
3. IDENTITY widget → clickable, opens /about page

The OTHER 2 fixes (FEATURED PROJECT buttons + 3 /projects index cards) are a separate sub-task — see `tasks/kickoff-fix-redirect-links-subtask2.md` (TBD). Do not touch them in this dispatch.

---

## Project context

- **Project:** portfolio-website
- **Path:** `/home/radxa/dev-shared/projects/portfolio-website/`
- **Branch:** Create new branch `feat/fix-redirect-links-subtask1` from `dev` (do NOT reuse `feat/fix-homepage-redirect-links` — that branch has an uncommitted kickoff commit only)
- **File in scope:** `prototypes/portfolio-combined.html` ONLY
- **Files NOT in scope:** other prototype files, the kickoff doc, anything else

---

## Current state (verified via grep)

### Widget #5 NOW (line ~3335)
```html
<div class="w s11" style="...">
  <div class="wlbl-row">... now</div>
  <div style="...">orlon-bot<br>...</div>
  <div class="dp">...</div>
</div>
```
- **No link wrapping.** Click does nothing.

### Widget #6 HOMELAB (line ~3343)
```html
<div class="w s11" style="...">
  <div class="wlbl-row">... homelab</div>
  <div>...2/3 nodes online...server icon...</div>
</div>
```
- **No link at all.**

### Widget #2 IDENTITY (line ~3274)
```html
<div class="w s21" style="...">
  <div class="wlbl-row">... identity</div>
  <div>...Vishal / Katariya + 3D person SVG...</div>
  <div>...3 chips...</div>
</div>
```
- **No link wrapping.**

### SPA navigation pattern

The site uses `showPage('pagename')` to switch between homepage (/), /projects, /about, /roadmap, /me. Internal links use `href="#pg-<name>"` + `onclick="showPage('<name>');return false;"` — verify by looking at existing internal nav links in the topbar.

Anchor scrolling on /projects uses `#<id>` where `<id>` matches the `cs-section` ID (e.g. `#homelab`, `#orlon-bot`, `#finance-buddy`, `#typeshift`).

---

## What to do

### Step 1 — NOW widget link
Wrap the entire widget #5 NOW content in an `<a>` tag:

**Before:**
```html
<div class="w s11" style="display:flex;flex-direction:column;justify-content:space-between;">
  <div class="wlbl-row">...now...</div>
  <div>...orlon-bot...</div>
  <div class="dp">...</div>
</div>
```

**After:**
```html
<a class="w s11" href="projects#orlon-bot" style="text-decoration:none;color:inherit;display:flex;flex-direction:column;justify-content:space-between;">
  <div class="wlbl-row">...now...</div>
  <div>...orlon-bot...</div>
  <div class="dp">...</div>
</a>
```

Use `href="projects#orlon-bot"` (no leading `#pg-`) — this matches the existing pattern used elsewhere in the file for SPA navigation to specific cs-sections.

If the SPA needs an onclick handler, look at how other internal links in the topbar handle this and mirror the pattern.

### Step 2 — HOMELAB widget link
Wrap the entire widget #6 HOMELAB content in an `<a>` tag:

**Before:**
```html
<div class="w s11" style="display:flex;flex-direction:column;justify-content:space-between;">
  <div class="wlbl-row">...homelab...</div>
  <div>...2/3 nodes online...server icon...</div>
</div>
```

**After:**
```html
<a class="w s11" href="projects#homelab" style="text-decoration:none;color:inherit;display:flex;flex-direction:column;justify-content:space-between;">
  <div class="wlbl-row">...homelab...</div>
  <div>...2/3 nodes online...server icon...</div>
</a>
```

### Step 3 — IDENTITY widget link
Wrap the entire widget #2 IDENTITY content in an `<a>` tag linking to /about page:

**Before:**
```html
<div class="w s21" style="display:flex;flex-direction:column;justify-content:space-between;">
  <div class="wlbl-row">...identity...</div>
  <div>...Vishal/Katariya...person SVG...</div>
  <div>...chips...</div>
</div>
```

**After:**
```html
<a class="w s21" href="about" style="text-decoration:none;color:inherit;display:flex;flex-direction:column;justify-content:space-between;">
  <div class="wlbl-row">...identity...</div>
  <div>...Vishal/Katariya...person SVG...</div>
  <div>...chips...</div>
</a>
```

`href="about"` (no leading `#pg-`) — mirrors the SPA nav pattern.

---

## Hard rules

- DO NOT touch any other prototype file.
- DO NOT modify the `.w`, `.s11`, `.s21` CSS classes.
- DO NOT change widget content (text, chips, icons stay verbatim).
- DO NOT change widget heights.
- DO NOT add new CSS classes.
- DO NOT touch widget #7 (FEATURED PROJECT — that's sub-task 2).
- DO NOT touch the 3 `.pcard` widgets on /projects page (that's sub-task 2).
- DO NOT delete any kickoff files.
- DO NOT run `git merge`.

---

## Verification — lighter than v1

1. Open the file in playwright at `file:///home/radxa/dev-shared/projects/portfolio-website/prototypes/portfolio-combined.html`
2. Take a **single full-page screenshot** — save to `/tmp/redirect-subtask1.png`
3. Verify in the screenshot:
   - NOW widget now has cursor:pointer (you can check this by inspecting computed style via playwright, or just visually confirm the widget looks clickable)
   - HOMELAB widget similarly clickable
   - IDENTITY widget similarly clickable
4. **Don't bother with click-through verification** — playwright click navigation is slow and adds context. Just confirm the hrefs are correct by inspecting the rendered HTML in the screenshot or by re-reading the file.

If any verification step fails, fix and re-verify. Do NOT declare done until screenshot exists.

---

## Definition of Done

1. `git diff` shows: 3 widget wrappers changed from `<div class="w ..."` to `<a class="w ..." href="..."`, plus `text-decoration:none;color:inherit` added inline. NO other changes.
2. Screenshot at `/tmp/redirect-subtask1.png` confirms 3 widgets visually look like they're now clickable anchors.
3. Commit: `fix(homepage): add redirect links to NOW, HOMELAB, IDENTITY widgets`
4. Push: `git push -u origin feat/fix-redirect-links-subtask1`
5. Write DEVLOG entry at the top of `tasks/DEVLOG.md` (format per AGENTS.md).
6. Report back with: (a) confirmation done, (b) screenshot path, (c) commit hash + branch name, (d) any deviations.

---

## Constraints

- Time budget: **15 minutes**.
- No external packages needed.
- Commit incrementally if needed.
- If playwright is too slow, use `curl http://localhost:8900/prototypes/portfolio-combined.html` instead and grep for `href="projects#orlon-bot"` etc. — that's a valid verification.

---

## Failure modes to avoid (from prior stalled dispatch)

- **Don't burn tokens on playwright browser automation** — if it's slow, fall back to curl + grep.
- **Don't try to verify external URLs** — that's sub-task 2's job (FEATURED PROJECT + 3 cards have github URLs).
- **Don't expand scope** — if you notice other link issues elsewhere, log them in DEVLOG and STOP. Don't fix them.
- **Don't get stuck on long operations** — if playwright hangs for >2 min on any action, fall back to file inspection.
