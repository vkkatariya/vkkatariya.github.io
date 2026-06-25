# Kickoff: Redistribute homepage about+contact into widget grid

> **Author:** Hermes (orchestrator)
> **Date:** 2026-06-25
> **Target:** coding agent (claude-code)
> **Mode:** Execution (single-file SPA refactor)

---

## Goal

Redistribute the big bottom about+contact widget into the middle widget grid of the homepage, then delete the bottom widget entirely.

---

## Project context

- **Project:** portfolio-website
- **Path:** `/home/radxa/dev-shared/projects/portfolio-website/`
- **Branch:** `feat/homepage-about-contact-merge` (already created — do NOT create again)
- **File in scope:** `prototypes/portfolio-combined.html` ONLY (single-file SPA)
- **Files NOT in scope:** `prototypes/portfolio-v4.html`, `prototypes/projects.html`, `prototypes/about.html`, `prototypes/cs-roadmap.html`, `prototypes/resume.html`. Do not touch them.

---

## Current layout (verified via grep)

- Middle widget grid (`#pg-home`) contains widgets #1–#12 in a `.grid` container starting at line 3237.
- The widgets in question:
  - **Widget #9 ABOUT** (line ~3440, comment `<!-- 9 · ABOUT — liquid glass · 2×1 -->`): small `.w.glass.s21` card with one short bio paragraph + 3 chips (ML/AI, full-stack, infra).
  - **Widget #10 PROJECTS STAT** (line ~3456, comment `<!-- 10 · PROJECTS STAT · 1×1 -->`): small `.w.s11` card showing "12 shipped".
  - **Widget #11 CONTACT** (line ~3466, comment `<!-- 11 · CONTACT — inverted white · 1×1 -->`): small inverted-white `.w.inv.s11` card with envelope icon.
- **Bottom of `#pg-home`** (line ~3616): big `<section class="about-section" id="contact">` containing:
  - `.about-grid` with `.about-bio` (3 paragraphs: Vishal/CS-student/Dieburg intro) on the left
  - `.about-contact` on the right with: email icon header, GITHUB card (vkkatariya), WEB card (vishalkatariya.dev), "📍 Dieburg · near Darmstadt" line, "available for internships" badge, ↓ DOWNLOAD RESUME pill (links to `assets/cv.pdf` with `download="Vishal-Katariya-Resume.pdf"`)

---

## What to do (in this exact order)

### Step 1 — Replace widget #9 ABOUT content with the bio content from the bottom widget

- DELETE the existing content inside widget #9 (`<!-- 9 · ABOUT -->`) except keep the outer wrapper (`<div class="w glass s21" ...>`) and the icon+label area (`.wlbl-row` with the info icon and "about" label).
- INSERT, in its place, the `.about-bio` block from the bottom widget, wrapped in `<div class="about-bio">`:
  ```html
  <div class="about-bio">
    <p>I'm <strong><span class="wm-cap">Vishal</span></strong> — a CS student at Hochschule Darmstadt, building production systems while studying.</p>
    <p>I work across the full stack: fine-tuning language models, building REST and WebSocket backends, designing interfaces, and managing self-hosted services on real ARM hardware. The common thread is building things that actually run — not just demos.</p>
    <p>Currently based in <strong>Dieburg · near Darmstadt</strong>. Looking for internships where I can work on systems that matter — flexible across ML engineering, full-stack development, and DevOps/infrastructure.</p>
  </div>
  ```
- VERBATIM copy, no edits.

### Step 2 — Replace widget #11 CONTACT content with the contact-card content from the bottom widget

- DELETE the existing content inside widget #11 (`<!-- 11 · CONTACT -->`) except keep the outer wrapper (`<div class="w inv s11" ...>`) and the icon+label area.
- INSERT, in its place, the `.about-contact` block from the bottom widget — adapted to fit the smaller widget slot. Keep:
  - the contact label header
  - the GITHUB card (`cw-row` linking to `github.com/vkkatariya`, `target="_blank"`)
  - the WEB card (`cw-row` linking to `vishalkatariya.dev`, `target="_blank"`)
  - the "📍 Dieburg · near Darmstadt" line
  - the "available for internships" badge
  - the DOWNLOAD RESUME pill (`href="assets/cv.pdf" download="Vishal-Katariya-Resume.pdf" class="np"`)
- Use CSS adjustments (font sizes, paddings, gaps) to make it fit cleanly in the smaller widget footprint. Keep the visual language consistent with the rest of the grid.
- VERBATIM copy of the underlying markup (links, text, icons, download attribute) — only visual styling adjustments allowed.

### Step 3 — Relocate widget #10 PROJECTS STAT upward

- Move widget #10 PROJECTS STAT from its current position (between #9 ABOUT and #11 CONTACT) to between widget #4 SKILLS and widget #9 ABOUT. There is an empty slot in that row.
- Keep its markup identical (just relocate the block — don't change anything inside it).
- Also: move widget #8 TECH STACK up slightly so the grid is balanced. Use judgment on exact vertical position. The goal is no big empty space between #4 SKILLS and #9 ABOUT.

### Step 4 — Delete the bottom about+contact widget

- DELETE the entire `<section class="about-section" id="contact">` block (from `<section class="about-section" id="contact">` to its closing `</section>`).
- The bottom of `#pg-home` should now end after the widget grid, not have this big section.

---

## Hard rules

- DO NOT touch any other prototype file. ONLY `portfolio-combined.html`.
- DO NOT change text content of any widget — copy verbatim.
- DO NOT add new CSS that affects other widgets.
- DO NOT change widget numbering or the `.grid` structure (the grid auto-flows).
- DO NOT modify the `.grid` CSS class definitions themselves — only relocate the widget blocks.
- DO NOT delete any kickoff files (e.g. `tasks/kickoff-feat-cv-pdf.md` etc).
- DO NOT run `git merge` or close any merge in progress.

---

## Verification — REQUIRED before declaring done

You MUST verify visually in a browser using playwright or chromium headless. Steps:

1. Open `prototypes/portfolio-combined.html` in a browser (use playwright or chromium headless with a known-working pattern — `npx playwright install chromium` if needed, then use `playwright` Node API to navigate to `file://` URL, set viewport, and screenshot).
2. Take a full-page screenshot.
3. Save the screenshot to `/tmp/portfolio-after-refactor.png`.
4. Verify in the screenshot:
   - The big bottom widget (`<section class="about-section" id="contact">`) is GONE.
   - Widget #9 ABOUT now contains the 3 bio paragraphs (verbatim).
   - Widget #11 CONTACT now contains: github card, web card, location line, available badge, download resume button.
   - Widget #10 PROJECTS STAT is now positioned in the row between #4 SKILLS and #9 ABOUT (not between #9 and #11).
   - Widget #8 TECH STACK is repositioned so there are no awkward empty rows.
   - The pop-out hover on the new widgets still works.
   - Light mode still renders correctly.
5. Reference the screenshot path in your final report.

**If any verification step fails, fix the issue and re-verify. Do NOT declare done until the screenshot shows the correct layout.**

---

## Definition of Done

1. `git diff` shows: widget #9 content replaced, widget #11 content replaced, widget #10 relocated, widget #8 repositioned, bottom `.about-section` deleted. No other changes outside `prototypes/portfolio-combined.html`.
2. Visual screenshot at `/tmp/portfolio-after-refactor.png` confirms the new layout matches the goal.
3. Commit with message: `refactor(homepage): redistribute about+contact into widget grid, delete bottom widget`
4. Push: `git push -u origin feat/homepage-about-contact-merge`
5. Write a DEVLOG entry at the TOP of `tasks/DEVLOG.md` with mode, did, state, decided, blocked/next, modified.
6. Report back with: (a) confirmation each of the 4 steps succeeded, (b) the screenshot path, (c) commit hash + branch name, (d) any deviations from the spec.

---

## Constraints

- Time budget: ~20 minutes.
- No external packages needed.
- Use `git add -p` style precision — don't bundle unrelated changes.
- If you cannot finish all 4 steps in one go, commit each step as a separate commit on the same branch (`refactor: step 1 - replace about content`, etc.) so partial progress is preserved.

---

## Failure modes to avoid (from prior dispatch)

The previous dispatch of this task only completed Step 1 (relocated widget #10) before the subagent process exited, leaving the work in an uncommitted state. This time:

- **Commit incrementally** — don't wait until the end. After each successful step, commit.
- **Don't lose partial progress** — if you must exit, commit what you have with a clear message and report back.
- **Don't try to do everything before verifying** — verify after each step.
