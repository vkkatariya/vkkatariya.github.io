# Kickoff: Fix redirect links on FEATURED PROJECT + 3 /projects index cards

> **Author:** Hermes (orchestrator)
> **Date:** 2026-06-25
> **Target:** coding agent (agy / claude-code)
> **Mode:** Execution (4 widget fixes on single-file SPA)

---

## Goal

Fix redirect links on 4 widgets:

1. **FEATURED PROJECT widget** (widget #7, "Finance Buddy", line ~3417): two `<button class="np">view →</button>` and `<button class="np-ghost">github</button>` — both are inert buttons. Convert to anchors with proper hrefs.

2. **/projects index card #2 — Homelab Dashboard** (line ~3583): has `<button class="np-ghost">view →</button>` only — needs both `view` AND `github` buttons.

3. **/projects index card #3 — TypeShift** (line ~3601): has `<button class="np-ghost">github →</button>` only — needs both `view` AND `github` buttons.

4. **/projects index card #4 — orlon-bot** (line ~3619): has `<button class="np-ghost">view →</button>` only — needs both `view` AND `github` buttons.

End result: each card has both buttons (like the featured project widget), styled identically, linking to the right targets.

---

## Project context

- **Project:** portfolio-website
- **Path:** `/home/radxa/dev-shared/projects/portfolio-website/`
- **Branch:** Create new branch `feat/fix-redirect-links-subtask2` from `dev` (do NOT reuse other branches).
- **File in scope:** `prototypes/portfolio-combined.html` ONLY

---

## Current state (verified via grep)

### FEATURED PROJECT widget (#7) — line ~3417-3418

```html
<div style="display:flex;gap:10px;align-items:center;margin-top:16px;">
  <button class="np">view →</button>
  <button class="np-ghost">github</button>
</div>
```

Two inert buttons. Need to become:

```html
<div style="display:flex;gap:10px;align-items:center;margin-top:16px;">
  <a class="np" href="projects#finance-buddy" style="text-decoration:none">view →</a>
  <a class="np-ghost" href="https://github.com/vkkatariya/finance-buddy" target="_blank" rel="noopener noreferrer" style="text-decoration:none">github</a>
</div>
```

### /projects index cards (3 cards)

Each card has a `.pcard-foot` div with one button. Pattern:

**Homelab Dashboard (line ~3583):**
```html
<div class="pcard-foot">
  <span class="pfoot-type app">App · private</span>
  <button class="np-ghost" style="padding:6px 12px;font-size:10px;">view →</button>
</div>
```

**TypeShift (line ~3601):**
```html
<div class="pcard-foot">
  <span class="pfoot-type collab">Collab · open source</span>
  <button class="np-ghost" style="padding:6px 12px;font-size:10px;">github →</button>
</div>
```

**orlon-bot (line ~3619):**
```html
<div class="pcard-foot">
  <span class="pfoot-type ai">AI · ML · in progress</span>
  <button class="np-ghost" style="padding:6px 12px;font-size:10px;">view →</button>
</div>
```

Replace each `.pcard-foot` with:
```html
<div class="pcard-foot">
  <span class="pfoot-type ...">...</span>
  <div style="display:flex;gap:6px">
    <a class="np" style="padding:6px 12px;font-size:10px;text-decoration:none" href="projects#<id>">view →</a>
    <a class="np-ghost" style="padding:6px 12px;font-size:10px;text-decoration:none" href="<github-url>" target="_blank" rel="noopener noreferrer">github →</a>
  </div>
</div>
```

Where `<id>` and `<github-url>` are per project:

| Project | `<id>` | `<github-url>` | Source |
|---|---|---|---|
| Homelab Dashboard | `homelab` | `https://github.com/vkkatariya/homelab-dashboard` | user-confirmed in CONTEXT.md |
| TypeShift | `typeshift` | `https://github.com/nayalambaliya/TypeShift` | referenced in `cs-section` content (line ~4014) |
| orlon-bot | `orlon-bot` | `https://github.com/vkkatariya/orlon-bot` | common pattern, **VERIFY exists** |
| Finance Buddy (FEATURED) | `finance-buddy` | `https://github.com/vkkatariya/finance-buddy` | **VERIFY exists** |

---

## SPA navigation note (from sub-task 1 lesson)

The SPA uses `showPage('projects')` to switch pages. A plain `href="projects#<id>"` will NOT trigger `showPage()` because the hashchange listener only handles page-level hashes (`#home`, `#projects`, etc.).

For internal `view →` links, use this pattern:

```html
<a class="np" 
   href="javascript:void(0)" 
   onclick="showPage('projects');setTimeout(()=>document.getElementById('<id>')?.scrollIntoView({behavior:'smooth'}),500);return false;"
   style="text-decoration:none">view →</a>
```

This:
1. Calls `showPage('projects')` to switch to /projects page
2. After 500ms (page transition), scrolls to the cs-section id
3. Uses `href="javascript:void(0)"` + `return false` to prevent default nav

For external `github` links, just use plain anchors:

```html
<a class="np-ghost" href="https://github.com/..." target="_blank" rel="noopener noreferrer" style="text-decoration:none">github →</a>
```

---

## Hard rules

- DO NOT touch any other prototype file.
- DO NOT touch widget #5 NOW, #6 HOMELAB, #2 IDENTITY (already done in sub-task 1).
- DO NOT touch widget #9 ABOUT, #11 CONTACT (separate branch).
- DO NOT modify the `.np`, `.np-ghost`, `.pcard-foot` CSS classes.
- DO NOT change widget content (project descriptions, tags, type labels).
- DO NOT change widget heights or grid positions.

---

## Verification — REQUIRED before declaring done

**GitHub URL verification:** For each `https://github.com/vkkatariya/<repo>` URL you use, run a HEAD request to verify it exists (returns 200, not 404):

```bash
for url in https://github.com/vkkatariya/finance-buddy https://github.com/vkkatariya/homelab-dashboard https://github.com/vkkatariya/orlon-bot; do
  status=$(curl -sI -o /dev/null -w '%{http_code}' --max-time 8 "$url")
  echo "$url → $status"
done
```

If any URL returns 404, STOP and report back with the broken URL — do not invent a placeholder. The kickoff author will decide (likely: use a placeholder like `#` or `#coming-soon` with a different visual treatment, OR skip the github button for that card).

The `nayalambaliya/TypeShift` URL is confirmed in the cs-section text already — skip the check for it.

**Visual verification:** Take a **full-page screenshot** (not viewport-only) at `/tmp/redirect-subtask2.png` showing:
- /projects page scrolled to the index cards area (top half)
- 3 pcard widgets each with both view + github buttons visible
- FEATURED PROJECT (visible only on homepage) with both buttons converted to anchors

If playwright is slow, fall back to `curl http://localhost:8900/prototypes/portfolio-combined.html | grep -E 'href="projects#|href="https://github.com'` to verify all hrefs are present.

---

## Definition of Done

1. `git diff` shows: only the 4 widget changes (1 FEATURED PROJECT + 3 /projects index cards). No other modifications.
2. All 4 `https://github.com/vkkatariya/<repo>` URLs verified to return 200.
3. Screenshot at `/tmp/redirect-subtask2.png` confirms both buttons visible on each card.
4. Commit: `fix(homepage): add redirect links to FEATURED PROJECT + 3 /projects index cards`
5. Push: `git push -u origin feat/fix-redirect-links-subtask2`
6. Write DEVLOG entry at the top of `tasks/DEVLOG.md`.
7. Report back with: (a) confirmation each of the 4 steps succeeded, (b) github URL check results, (c) screenshot path, (d) commit hash + branch name, (e) any deviations.

---

## Constraints

- Time budget: ~25 minutes.
- No external packages needed.
- If a github URL 404s, STOP and report — don't invent a placeholder.

---

## Failure modes to avoid

- **Don't dispatch for partial scope** — finish all 4 widgets in one dispatch.
- **Don't skip URL verification** — the user explicitly wants real github links.
- **Don't lose progress** — commit incrementally if needed.
- **Don't expand scope** — don't touch other widgets, don't add new features.
