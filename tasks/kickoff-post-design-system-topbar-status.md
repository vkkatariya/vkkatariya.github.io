# Kickoff: Post-Design-System Topbar & Status Fixes

**Project:** portfolio-website
**Path:** ~/dev-shared/projects/portfolio-website/
**Branch:** feat/post-design-system-topbar-status (create from dev)
**Mode:** Execution
**Complexity:** Non-trivial full workflow

---

## Reference Files
- `tasks/germany-tax-map.html` — exact design system tokens, component patterns
- `prototypes/portfolio-combined.html` — current implementation

---

## Goal
Fix two specific issues in the topbar:
1. **Bring left (brand) and right (tools) pills close to the middle** — reduce the gap between the three pills so they sit as a tight group near center, not spread across full width
2. **Change "available" status** — replace "Open to opportunities" with "Not available" (or remove entirely if cleaner)

---

## Done When
- [ ] **Topbar pills grouped near center** — left brand pill, center nav links, right tools pill all close together (reduce `gap` in `.tb` flex container, or add max-width to center the group)
- [ ] **Status text changed** — all occurrences updated:
  - Homepage: `.nav-avail-txt`, `.nav-overlay-avail` text, `.avail-badge`
  - About page: `.photo-status`, `.avail-block` (remove or update to "Not available")
  - Resume page: hero status pills, JS `COPY` object (EN/DE)
  - Mobile overlay: `.nav-overlay-avail`
- [ ] **Light mode tokens preserved** — keep current Germany Tax Chat reference values
- [ ] **29/29 Playwright tests pass** — update selectors if needed
- [ ] **htmlhint clean** — 0 errors

---

## Constraints
- **Single file:** `prototypes/portfolio-combined.html` only
- **Preserve design system tokens** — only modify topbar layout CSS and status text
- **Preserve SPA logic** — `showPage()`, JS untouched except status text
- **Current topbar structure** — already has `.top` > `.tb` > 3 `.pill` children (brand, links, tools) — just tighten the grouping

---

## Current Topbar Structure (from portfolio-combined.html)
```html
<div class="top">
  <div class="tb">
    <a class="pill brand" ...>...</a>
    <nav class="pill links" ...>...</nav>
    <div class="pill tools">...</div>
  </div>
</div>
```
Current CSS: `.tb { display: flex; align-items: center; justify-content: center; gap: 10px; }`
**Fix:** Reduce `gap` or add `max-width` to `.tb` to pull pills together near center.

---

## Status Text Locations to Update
| Location | Selector | Current | New |
|----------|----------|---------|-----|
| Homepage nav center | `.nav-avail-txt` | "Open to opportunities" | "Not available" |
| Homepage mobile overlay | `.nav-overlay-avail span` | "Open to opportunities" | "Not available" |
| Homepage contact widget | `.avail-badge` | "Open to opportunities" | "Not available" |
| About page photo | `.photo-status` | "Open to opportunities" | "Not available" |
| About page contact | `.avail-block` | "Open to opportunities" | Remove entire block or "Not available" |
| Resume page JS | `COPY.EN.avail` | "Open to opportunities" | "Not available" |
| Resume page JS | `COPY.DE.avail` | "Offen für neue Möglichkeiten" | "Nicht verfügbar" |

---

## Files to Modify
- `prototypes/portfolio-combined.html` — topbar CSS (`.tb` gap/max-width), status text in HTML + JS `COPY` object

---

## Verification Gates
```bash
npm test              # 29/29 Playwright
npm run lint:html     # 0 errors
# Visual: 1920/860/560/390 dark & light — topbar pills grouped near center, status says "Not available"
```

---

## Notes for Agent
- **Do not restructure topbar HTML** — it's already correct (`.top` > `.tb` > 3 pills). Only adjust CSS spacing.
- **Status text** — decide "Not available" vs removal; "Not available" keeps green dot but changes text, removal is cleaner. Your call.
- **DE translation** — "Nicht verfügbar" for German.
- **Tests** — update any test expectations for status text if they check exact strings.
- **Coding agent only** — this is a coding task, dispatch via your CLI (claude/opencode/agy), not a sub-agent.