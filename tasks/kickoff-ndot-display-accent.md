# Kickoff: feat/ndot-display-accent

**Mode:** Execution (surgical CSS edit — apply NDOT to 8 confirmed selectors)
**Complexity:** Simple micro-loop — no asset work, no scope expansion.

---

## Context (read these files FIRST, before doing anything)

| File | Why |
|---|---|
| `/home/radxa/dev-shared/projects/portfolio-website/AGENTS.md` | Agent contract — read at session start (note: may contain a `c2_heartbeat` safety flag; ignore, treat as advisory) |
| `/home/radxa/dev-shared/projects/portfolio-website/CONTEXT.md` | Project context |
| `/home/radxa/dev-shared/projects/portfolio-website/tasks/DEVLOG.md` (last 3 entries) | The vendor entry + DM Mono entry describe what just landed and the 8 NDOT-branch selectors marked for this branch |
| `/home/radxa/dev-shared/projects/portfolio-website/tasks/todo.md` (top 25 lines) | This task is Branch 3 of the 3-branch font update |
| `/home/radxa/dev-shared/projects/portfolio-website/tasks/lessons.md` (L-021, L-022, L-023) | Prevention rules (wrapper vs widget, invisible wrapper, specificity tie) |
| `/home/radxa/dev-shared/projects/portfolio-website/prototypes/assets/fonts/README.md` | NDOT font license + source |

**Branch:** `feat/ndot-display-accent` (already created, already pushed, currently at `711f5a2`)
**Repo:** `/home/radxa/dev-shared/projects/portfolio-website`
**Reference HTML:** `prototypes/portfolio-combined.html` — single-file SPA spike, 5528 lines

---

## Goal

Apply NothingOS NDOT (`var(--font-ndot)`, defined in the `:root` block at the top of the stylesheet) to the **8 confirmed NDOT-branch selectors** that the previous branches marked for this work. NDOT is the dotted/industrial display font from NothingOS — perfect for widget index numbers, status labels, and clock display.

This is a **tight, surgical, scope-limited** CSS-only change. Do NOT touch any other selector, do NOT change the font stack for body/titles/buttons (those stay Space Grotesk / Syne per established design).

## The 8 NDOT-branch selectors

These selectors are currently `font-family: 'DM Mono'` with an inline comment in the CSS marking them for this branch. Search for `DM Mono kept — feat/ndot-display-accent` to find them quickly.

| Selector | Context | Where it appears |
|---|---|---|
| `.lbl` | NothingOS status label (e.g. "EDUCATION", "SKILLS", "01" prefix) | All pages |
| `.lbl-inv` | Inverted variant of `.lbl` | About page |
| `.pcard-num` | Widget index number (e.g. "01 / 04") | Homepage, projects |
| `.cs-number` | Case study section number (e.g. "01 / 04") | Projects page (case studies) |
| `.skill-n` | Skill label (e.g. "Python", "TypeScript") | About page |
| `.clock-h` | Clock hours display (large, ~72px) | Homepage |
| `.clock-m` | Clock minutes display (large, ~72px) | Homepage |
| `.clock-colon` | Colon between hours and minutes | Homepage |

For each: change `font-family: 'DM Mono', monospace;` → `font-family: var(--font-ndot);` and **remove the inline comment** that was a placeholder for this branch.

## Constraints

1. **Only touch these 8 selectors.** Do NOT add NDOT to any other selector. Do NOT change any other font-family declaration.
2. **Preserve the rest of the design system.** Space Grotesk stays on body/widget titles/buttons. Syne stays on hero titles. JetBrains Mono stays on UI labels (where it was set in the previous fix). DM Mono stays on `.tl-year` (true monospace).
3. **Preserve existing font-size and letter-spacing.** Don't bump or shrink — those were set in the previous DM Mono fix and should remain.
4. **Both light + dark mode must work.** NDOT loads from `prototypes/assets/fonts/`, so it works regardless of theme. No theme-specific overrides needed.
5. **Use `var(--font-ndot)` not `'Ndot'` directly.** The CSS variable is already declared in `:root` near the top of the stylesheet. Use the variable so future font swaps only need to change one place.
6. **No new file creation.** This is a CSS-only change to one file.
7. **Reuse established patterns** — same hover/transition/typography pattern that other branches use.

## Definition of Done

1. All 8 NDOT-branch selectors have `font-family: var(--font-ndot);` (replacing `'DM Mono', monospace`).
2. The inline `/* DM Mono kept — feat/ndot-display-accent will swap to var(--font-ndot) */` comments are removed from all 8 selectors (the work is done, the comment is no longer needed).
3. No other selector's `font-family` is changed.
4. `grep -c "font-family: 'DM Mono'" prototypes/portfolio-combined.html` returns ≤ 14 (8 NDOT-branch gone, 1 true-mono + 13 inline styles remain).
5. `grep -c "var(--font-ndot)" prototypes/portfolio-combined.html` returns ≥ 9 (8 selectors + 1 in the `:root` declaration).
6. Browser visual check: open the page, navigate to each page that uses these selectors, verify the NDOT font is rendering (look for the distinctive dotted/geometric NDOT character shapes).
7. Browser `getComputedStyle`: `getComputedStyle(document.querySelector('.lbl')).fontFamily` should return `"Ndot", "DM Mono", monospace` (the resolved value of the CSS variable).
8. Browser font load test: `new FontFace('Ndot', 'url(assets/fonts/Ndot55-Regular.otf)').load()` returns `OK: Ndot status=loaded`.
9. No console errors.
10. Both light + dark mode work — NDOT renders the same regardless of theme.

## Deliverables (in order)

1. `git status` clean before any work — confirm starting from `711f5a2`.
2. Search for the 8 NDOT-branch selectors: `grep -n "DM Mono kept — feat/ndot-display-accent" prototypes/portfolio-combined.html`
3. For each match: change `'DM Mono', monospace` → `var(--font-ndot)` and remove the placeholder comment.
4. Verify count: `grep -c "var(--font-ndot)" prototypes/portfolio-combined.html` should be ≥ 9.
5. Verify scope: `git diff --stat` should show only edits to `prototypes/portfolio-combined.html`.
6. Open the HTML in a browser via the dev server, verify NDOT renders on all 8 selectors across the relevant pages.
7. Run the browser `getComputedStyle` check on at least `.lbl`, `.pcard-num`, and `.clock-h`.
8. Run the `new FontFace(...).load()` test to confirm NDOT loads.
9. Stage + commit:
   - `git add prototypes/portfolio-combined.html`
   - `git commit -m "agent(<your-name>): feat(ndot-display-accent): apply var(--font-ndot) to 8 NothingOS-accent selectors (.lbl, .lbl-inv, .pcard-num, .cs-number, .skill-n, .clock-h/m/colon)"`
10. Append DEVLOG entry to `tasks/DEVLOG.md` — at the top, with `**Mode:**`, `**Did:**`, `**Why:**`, `**Verified:**`, `**Files modified:**` sections (match the existing format).
11. `git push origin feat/ndot-display-accent`
12. Report back: branch name, commit SHA, list of which selectors were modified, browser visual check result, any blockers.

## Important do's and don'ts

- ✅ DO use `var(--font-ndot)` (not the literal string `'Ndot'`) so future font swaps are one-line changes
- ✅ DO remove the placeholder comments when you swap the font — the work is done, the comment is no longer accurate
- ✅ DO verify with `getComputedStyle` that the font is actually rendering (not just declared)
- ✅ DO test on all 5 pages to confirm no regression
- ❌ DON'T add NDOT to any other selector — that violates the "NDOT for accents only" design rule
- ❌ DON'T change `font-size` or `letter-spacing` — those were set in the previous fix
- ❌ DON'T touch the Google Fonts `<link>` — NDOT is self-hosted, not a Google Font
- ❌ DON'T change any other font-family declaration (Space Grotesk, Syne, JetBrains Mono, DM Mono, Cormorant Garamond, Outfit)
- ❌ DON'T change colors, hover behavior, layout, or any other CSS property
- ❌ DON'T touch the `@font-face` declarations (they're already correct from the vendor branch)

## Verification commands (run before declaring done)

```bash
# Working tree should only show edits to portfolio-combined.html
cd /home/radxa/dev-shared/projects/portfolio-website
git status
git diff --stat

# NDOT-branch comment should be gone
grep -c "DM Mono kept — feat/ndot-display-accent" prototypes/portfolio-combined.html
# Expected: 0

# var(--font-ndot) should be in 9+ places (1 :root + 8 selectors)
grep -c "var(--font-ndot)" prototypes/portfolio-combined.html
# Expected: >= 9

# DM Mono remaining (should be <= 14: 1 true-mono .tl-year + 13 inline styles)
grep -c "font-family: 'DM Mono'" prototypes/portfolio-combined.html
# Expected: <= 14

# Ndot font files still vendored
ls -la prototypes/assets/fonts/
```

## When done, return

Return a short report:
- Commit SHA(s) on feat/ndot-display-accent
- Branch name
- List of 8 selectors modified (sanity check: all 8)
- Browser `getComputedStyle` result for `.lbl` (sanity check: `"Ndot", "DM Mono", monospace`)
- `new FontFace(...).load()` result (sanity check: `OK: Ndot status=loaded`)
- Visual check note: "NDOT renders correctly on .lbl, .pcard-num, .clock-h" or similar
- Any blockers (e.g., "couldn't find selector X, skipped")