# Kickoff: Stretch ABOUT + CONTACT widgets to fill grid row

> **Author:** Hermes (orchestrator)
> **Date:** 2026-06-25
> **Target:** coding agent (claude-code)
> **Mode:** Micro-loop (single CSS class change + content reflow)

---

## Goal

The ABOUT + CONTACT widgets on the homepage (`#pg-home`) are tightly cramped on the left side of their grid row, with a big empty gap on the right. Stretch both widgets horizontally to fill the entire row.

---

## Project context

- **Project:** portfolio-website
- **Path:** `/home/radxa/dev-shared/projects/portfolio-website/`
- **Branch:** `feat/homepage-about-contact-merge` (already created from the prior dispatch)
- **File in scope:** `prototypes/portfolio-combined.html` ONLY
- **Visual issue (confirmed in screenshot):** The `.grid` parent has `grid-template-columns: repeat(4, 1fr)` — 4 equal columns. The two widgets currently use:
  - Widget #9 ABOUT: `class="w glass s22"` (2 cols × 2 rows)
  - Widget #11 CONTACT: `class="w s12"` (1 col × 2 rows)
  - Total: 2 + 1 = **3 of 4 columns occupied, leaving 1 empty column on the right** = ~25% empty horizontal space.

---

## Fix

**Change widget #11 CONTACT from `s12` to `s22`.**

That gives both widgets `s22` (2×2 each) → 2 + 2 = 4 columns = fills the entire row.

### Exact change
- **Before:** `<div class="w s12" style="display:flex;flex-direction:column;justify-content:space-between;">`
- **After:** `<div class="w s22" style="display:flex;flex-direction:column;justify-content:space-between;">`

That's it. One class change.

### Content reflow
The CONTACT widget content (github card, web card, location line, available badge, download resume button) currently lays out vertically because `s12` is narrow. After the change to `s22`, the widget is wider (~2x). You may need to adjust the **inner layout** so the content fills the wider widget naturally:
- Consider laying out the github + web cards as a **2-column inner grid** (e.g. `grid-template-columns: 1fr 1fr; gap: 8px`) inside `.about-contact`, so they sit side-by-side instead of stacked.
- Keep the location/avail/download-resume block at the bottom of the widget (full-width, single column).
- Adjust font sizes only if they look too small/large in the wider container.

If the wider layout needs minor CSS tweaks for the contact inner cards, that's allowed. Don't add a new `.contact-grid-2col` class — inline `style="grid-template-columns: 1fr 1fr"` is fine.

### Do NOT change
- The `.grid` CSS rule (no `grid-template-columns` changes).
- Widget #9 ABOUT (already `s22`, keep verbatim).
- Widget #10 PROJECTS STAT (already `s11`, keep verbatim).
- Any other widgets.
- Any other prototype file.

---

## Verification

Use playwright (the previous dispatch's playwright-mcp should still be running) to take a screenshot of `#pg-home` scrolled to where the ABOUT+CONTACT row is. Save to `/tmp/widget-stretch-fix.png`.

Verify in screenshot:
- Both widgets now span the full row width (no empty space on right).
- ABOUT still shows the 3 bio paragraphs, full text visible.
- CONTACT shows github + web cards side-by-side, location line + available badge + download resume button at the bottom, all visible.
- Pop-out hover still works.
- Light mode still renders correctly.

If anything looks off (content clipping, awkward inner gaps, broken hover), fix and re-verify. Do NOT declare done until the screenshot looks right.

---

## Definition of Done

1. `git diff` shows ONLY the widget #11 class change + minor inner CSS adjustment, no other changes.
2. Screenshot at `/tmp/widget-stretch-fix.png` confirms both widgets fill the row.
3. Commit: `fix(homepage): stretch ABOUT + CONTACT widgets to fill grid row`
4. Push: `git push origin feat/homepage-about-contact-merge`
5. Write DEVLOG entry at the top of `tasks/DEVLOG.md` (format per AGENTS.md).
6. Report back with: (a) confirmation done, (b) screenshot path, (c) commit hash, (d) any deviations.

---

## Constraints

- Time budget: 5–10 minutes.
- DO NOT touch other widgets, the `.grid` CSS, or other prototype files.
- DO NOT push any other branch.
- Commit incrementally if needed.
