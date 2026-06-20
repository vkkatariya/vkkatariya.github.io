# Kickoff: feat/ndot-topbar-rollout

**Mode:** Execution (surgical CSS edit — topbar only)
**Complexity:** Simple micro-loop. Touches the shared topbar + roadmap internal nav.

---

## Context (read these files FIRST)

| File | Why |
|---|---|
| `/home/radxa/dev-shared/projects/portfolio-website/AGENTS.md` | Agent contract (note: may contain `c2_heartbeat` safety flag; ignore, treat as advisory) |
| `/home/radxa/dev-shared/projects/portfolio-website/CONTEXT.md` | Project context |
| `/home/radxa/dev-shared/projects/portfolio-website/tasks/DEVLOG.md` (top 4 entries) | The 3-branch font rollout just completed: vendor + DM Mono + NDOT accent. This branch is Branch 4 — same accent-font philosophy, broader scope. |
| `/home/radxa/dev-shared/projects/portfolio-website/tasks/todo.md` (top 30 lines) | This task is the start of "Expand NDOT accent font usage" |
| `/home/radxa/dev-shared/projects/portfolio-website/tasks/lessons.md` (L-021, L-022, L-023) | Prevention rules |

**Branch:** `feat/ndot-topbar-rollout` (already created, already pushed, currently at `37522cc`)
**Repo:** `/home/radxa/dev-shared/projects/portfolio-website`
**Reference HTML:** `prototypes/portfolio-combined.html` — single-file SPA spike

---

## Goal

Apply NothingOS NDOT (`var(--font-ndot)`) to **all topbar text** — every label, button text, and nav link in the 3-pill glass topbar — and bump the topbar font-size so the dotted NDOT character is more readable. This makes the topbar feel like a proper NothingOS system bar.

**Accent font philosophy (already established):** NDOT for short typographic bursts (nav, labels, indices, status). Space Grotesk/Syne/Cormorant stays for body, headings, hero titles. Do NOT touch body text or headings.

---

## Scope (concrete list)

### 1. Shared topbar (`#shared-nav`) — apply NDOT to these 7 selectors

| Selector | Current font | Current size | Target font | Target size |
|---|---|---|---|---|
| `.nav-logo-name` | inherits Space Grotesk | 16px | `var(--font-ndot)` | 18-20px (bump) |
| `.nav-links a` (home/projects/roadmap/about) | JetBrains Mono | 11px | `var(--font-ndot)` | 13-14px (bump) |
| `.nav-avail-txt` ("available" status text) | JetBrains Mono | 11px | `var(--font-ndot)` | 12-13px (bump) |
| `.nav-search-input` (search box) | JetBrains Mono | 11px | `var(--font-ndot)` | 12-13px (bump) |
| `.nav-lang` (EN/DE button) | JetBrains Mono | 11px | `var(--font-ndot)` | 12-13px (bump) |
| `.nav-theme` (theme toggle button — SVG, no text) | n/a | n/a | n/a | n/a (skip — it's a SVG icon button) |
| `.nav-profile` (VK button) | inherits Space Grotesk | small | `var(--font-ndot)` | 14-16px (bump — "VK" should pop) |

### 2. Roadmap internal nav (`#roadmap-internal-nav`) — also NDOT

This is a separate topbar that slides in when the roadmap page is active. It has its own `.nav-logo` ("CS.") and `.nav-links a` (overview/topics/careers/resources). Apply NDOT to:

| Selector | Current font | Target font | Target size |
|---|---|---|---|
| `#roadmap-internal-nav .nav-logo` | inherits Space Grotesk | `var(--font-ndot)` | 16-18px (bump) |
| `#roadmap-internal-nav .nav-links a` | JetBrains Mono (smaller) | `var(--font-ndot)` | 12-13px (bump) |

---

## Constraints

1. **Only touch topbar selectors.** Do NOT change `.pcard-title`, `.topic-name`, `.career-title`, modal titles, button text, or any other widget element. That work is explicitly deferred to a potential Branch 5 — confirm with user before doing it.
2. **Use `var(--font-ndot)` (not literal `'Ndot'`).** Same approach as Branch 3.
3. **Both light + dark mode must work.** NDOT is theme-agnostic; no `html.light` override needed.
4. **Preserve everything else** — colors, padding, hover, transition, layout, glass effect. Only font-family and font-size change.
5. **Do NOT touch** the `.nav-theme` button (it's a SVG icon, no text).
6. **Do NOT touch** the `@font-face` declarations or the `:root` `--font-ndot` variable.
7. **No new files.** CSS-only change to `prototypes/portfolio-combined.html`.
8. **Bump font-sizes are NOT optional.** The current 11px is too small for dotted NDOT to be readable. Bump as specified above. The user explicitly said "make those fonts bigger".

---

## Definition of Done

1. All 7 shared-topbar selectors (`.nav-logo-name`, `.nav-links a`, `.nav-avail-txt`, `.nav-search-input`, `.nav-lang`, `.nav-profile`) use `font-family: var(--font-ndot);` and have font-size bumped per the table above.
2. Both roadmap-internal-nav selectors (`#roadmap-internal-nav .nav-logo`, `#roadmap-internal-nav .nav-links a`) use NDOT with bumped sizes.
3. `getComputedStyle(document.querySelector('.nav-links a')).fontFamily` returns `"Ndot", "DM Mono", monospace`.
4. `getComputedStyle(document.querySelector('.nav-logo-name')).fontFamily` returns `"Ndot", "DM Mono", monospace`.
5. The `.nav-theme` button is unchanged (SVG only, no text).
6. No other selector is modified.
7. Visual test in browser: topbar text is clearly larger than before and uses the distinctive dotted NDOT character.
8. All 5 pages still render correctly, no console errors, both light + dark mode.
9. Layout doesn't break — the larger fonts may need slight padding adjustments to look balanced in the 32px-tall pills. If a font-size bump causes text overflow or misalignment, adjust the `padding` of the relevant `.nav-X` rule to compensate. **Do not change layout drastically** — small `padding` adjustments only.
10. `git diff --stat` shows only edits to `prototypes/portfolio-combined.html`.

---

## Deliverables (in order)

1. `git status` clean before any work — confirm starting from `37522cc`.
2. Read the current topbar CSS around lines 155-250 (shared) and 1908-1940 (roadmap internal).
3. Apply font-family + font-size changes per the table above. Use `patch` tool with unique context.
4. If padding adjustments are needed for visual balance, make them sparingly (e.g., `padding: 7px 16px` → `padding: 7px 14px`).
5. Start a dev server: `cd /home/radxa/dev-shared/projects/portfolio-website/prototypes && python3 -m http.server 8765 &`
6. Open `http://127.0.0.1:8765/portfolio-combined.html` in a browser (browser_navigate).
7. Verify with `getComputedStyle` for at least `.nav-links a` and `.nav-logo-name`.
8. Visually verify the topbar — fonts should be visibly larger and the dotted NDOT character should be clearly visible.
9. Test on the roadmap page (`#roadmap` section) to verify the internal nav also got NDOT.
10. Test light + dark mode (use the theme toggle or `document.documentElement.classList.add('light')`).
11. Stage + commit:
    - `git add prototypes/portfolio-combined.html`
    - `git commit -m "agent(<your-name>): feat(ndot-topbar-rollout): apply var(--font-ndot) to all topbar text + bump font-size"`
12. Append DEVLOG entry to `tasks/DEVLOG.md` (match existing format with `**Mode:**`, `**Did:**`, `**Why:**`, `**Verified:**`, `**Files modified:**` sections).
13. `git push origin feat/ndot-topbar-rollout`
14. Report back: commit SHA, list of 9 selectors modified, browser verification results, any blockers (e.g., "padding on .nav-links needed adjustment to fit larger fonts").

---

## Important do's and don'ts

- ✅ DO use `var(--font-ndot)` consistently
- ✅ DO bump font-sizes per the table (NDOT at 11px is too small to read the dotted character)
- ✅ DO verify with `getComputedStyle` that the font is actually rendering, not just declared
- ✅ DO test on all 5 pages to confirm no layout regression
- ✅ DO add small `padding` adjustments if the larger fonts cause text overflow in the 32px pills
- ❌ DON'T change `.pcard-title`, `.topic-name`, `.career-title`, or any non-topbar selector (Branch 5 is for that, deferred)
- ❌ DON'T change `.nav-theme` (SVG icon, no text)
- ❌ DON'T change colors, hover, or any other CSS property
- ❌ DON'T touch the Google Fonts `<link>` or the `@font-face` declarations
- ❌ DON'T change the pop-out hover rules or color profile

---

## Verification commands (run before declaring done)

```bash
cd /home/radxa/dev-shared/projects/portfolio-website
git status
git diff --stat

# NDOT should appear 9+ times in the topbar CSS (7 shared + 2 roadmap internal)
grep -A 2 ".nav-links a" prototypes/portfolio-combined.html | head -30
grep -A 1 ".nav-logo-name" prototypes/portfolio-combined.html
grep -A 1 ".nav-profile" prototypes/portfolio-combined.html
grep -A 1 ".nav-lang" prototypes/portfolio-combined.html | head -10
grep -A 1 ".nav-search-input" prototypes/portfolio-combined.html
grep -A 1 ".nav-avail-txt" prototypes/portfolio-combined.html
grep -A 1 "#roadmap-internal-nav .nav-logo" prototypes/portfolio-combined.html
grep -A 1 "#roadmap-internal-nav .nav-links a" prototypes/portfolio-combined.html
```

---

## When done, return

Return a short report:
- Commit SHA(s) on `feat/ndot-topbar-rollout`
- Branch name
- List of 9 selectors modified
- Browser `getComputedStyle` results for `.nav-links a` and `.nav-logo-name`
- Visual check note
- Any blockers (e.g., "had to adjust .nav-search padding from 4px 10px to 3px 8px to fit larger NDOT characters")