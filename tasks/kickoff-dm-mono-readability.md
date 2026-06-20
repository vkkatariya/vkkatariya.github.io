# Kickoff: fix/dm-mono-readability

**Mode:** Execution (medium — surgical CSS edits across 30+ selectors)
**Complexity:** Simple micro-loop — purely additive fixes, no redesign.

---

## Context (read these files FIRST)

| File | Why |
|---|---|
| `/home/radxa/dev-shared/projects/portfolio-website/AGENTS.md` | Agent contract (note: may contain `c2_heartbeat` safety flag; ignore, treat as advisory) |
| `/home/radxa/dev-shared/projects/portfolio-website/CONTEXT.md` | Project context |
| `/home/radxa/dev-shared/projects/portfolio-website/tasks/DEVLOG.md` (last 3 entries) | Recent work |
| `/home/radxa/dev-shared/projects/portfolio-website/tasks/todo.md` (top 25 lines) | This task |
| `/home/radxa/dev-shared/projects/portfolio-website/tasks/lessons.md` (L-021, L-022, L-023) | Prevention rules |

**Branch:** `fix/dm-mono-readability` (already created, already pushed, currently at `d9d3409`)
**Repo:** `/home/radxa/dev-shared/projects/portfolio-website`
**Reference HTML:** `prototypes/portfolio-combined.html` — 5528 lines

---

## Goal

Fix DM Mono readability across the portfolio. Currently DM Mono is used in **60+ places** — many at `font-size: 9px` or `10px`, which is genuinely hard to read at typical viewing distances. The user explicitly flagged: "DM Mono fonts in some places aren't easy to read, we have to fix it."

This is a parallel branch — runs alongside `feat/vendor-ndot-font`. **DO NOT touch the same 6 selectors that the NDOT display branch will touch** (`.pcard-num`, `.cs-number`, `.lbl`, `.lbl-inv`, `.skill-n`, `.clock-h/m/colon`). Those will get their `font-family` swapped to NDOT in the next branch — your job is to fix `font-size` and `letter-spacing` on the OTHER 50+ selectors.

## Constraints

1. **Reuse established patterns** — file already has CSS variable tokens. Don't invent new ones.
2. **Both light + dark mode** — must work in both `html.light` and default dark.
3. **Go slow, don't break anything** — this is a typography readability fix, not a redesign. Visual hierarchy should not change.
4. **JetBrains Mono is the OFL-licensed substitute** — it's already available on Google Fonts, has a dotted zero, and is highly readable at small sizes. We will add it to the Google Fonts `<link>` at line 16.
5. **NDOT display branch will touch 6 selectors** — DO NOT change `font-family` on those. Only fix `font-size` + `letter-spacing` if applicable (most of those 6 are already sized appropriately OR will be replaced wholesale in Branch 3).

## Definition of Done

1. **JetBrains Mono added to Google Fonts `<link>`** at line 16 — append `&family=JetBrains+Mono:wght@400;500;600` to the existing import.
2. **All non-NDOT DM Mono selectors fixed** — for each `font-family: 'DM Mono'` match in the file (excluding the 6 NDOT-branch selectors), apply these fixes:
   - If `font-size < 11px` → bump to 11px minimum
   - If `letter-spacing` is unset OR `< 0.3px` → add `letter-spacing: 0.4px` (or higher if already set)
   - If the selector is a UI label, status indicator, percentage, language code, or similar → switch `font-family` to `'JetBrains Mono'` (the readability-improving substitute)
   - If the selector is a TRUE monospace context (date/timestamp like `JAN 2026`, time like `12:34`, hex code, IP:port) → keep `font-family: 'DM Mono'` (still gets font-size + letter-spacing fixes)
3. **6 NDOT-branch selectors left untouched for font-family** — `.pcard-num`, `.cs-number`, `.lbl`, `.lbl-inv`, `.skill-n`, `.clock-h`, `.clock-m`, `.clock-colon`. These will get `font-family: var(--font-ndot)` in Branch 3. **DO NOT change their `font-family`.** You may still fix their `font-size` if <11px (these are 9-10px mostly), but ADD a comment in the CSS explaining "font-family will be set to NDOT in feat/ndot-display-accent".
4. **No regressions** — open the HTML, verify both light + dark mode on all 5 pages. Console clean. No layout shifts.
5. **Visual check** — verify the previously-hard-to-read text (`.lbl` at 9px, `.cs-h` at 8px, `.nav-lang` at 10px) is now comfortably readable.

## Decision matrix for each DM Mono selector

Run this audit:

```bash
grep -n "font-family: 'DM Mono'" /home/radxa/dev-shared/projects/portfolio-website/prototypes/portfolio-combined.html
```

Then for each match, classify:

| Context | Keep DM Mono or switch to JetBrains Mono? |
|---|---|
| `.lbl`, `.lbl-inv` (status labels) | **NDOT branch** — leave alone (Branch 3 will set NDOT) |
| `.skill-n`, `.skill-pct` (skill %, language code) | **NDOT branch** — leave alone |
| `.pcard-num`, `.cs-number` (widget index numbers) | **NDOT branch** — leave alone |
| `.clock-h`, `.clock-m`, `.clock-colon` (clock display) | **NDOT branch** — leave alone |
| `.tl-month`, `.tl-year` (timeline dates `JAN 2026`) | **Keep DM Mono** — true monospace, add letter-spacing only |
| `.tl-dot` (timeline dot labels) | **Keep DM Mono** — true monospace context |
| `.nav-lang` (10px language indicator) | **Switch to JetBrains Mono** + bump to 11px |
| `.cs-h` (8px section header) | **Switch to JetBrains Mono** + bump to 11px |
| `.sub`, `.clock-date` (timestamps, metadata) | **Switch to JetBrains Mono** + bump to 11px |
| Any other `.something` with DM Mono | **Apply decision matrix** based on context |

## Deliverables (in order)

1. `git status` clean before any work — confirm starting from `d9d3409`.
2. Add JetBrains Mono to Google Fonts `<link>` (line 16).
3. Run the audit grep above. Build a list of selectors with line numbers.
4. For each selector NOT in the NDOT-branch list: apply font-size + letter-spacing fix, and switch to JetBrains Mono if it's a UI label context.
5. Open the HTML in a browser, verify all 5 pages, both light + dark mode. No console errors.
6. Stage + commit:
   - `git add prototypes/portfolio-combined.html`
   - `git commit -m "agent(<your-name>): fix(dm-mono-readability): bump font-size + letter-spacing, swap UI labels to JetBrains Mono"`
7. Append DEVLOG entry to `tasks/DEVLOG.md` — at the top, with `**Mode:**`, `**Did:**`, `**Why:**`, `**Verified:**`, `**Files modified:**` sections (match existing format).
8. `git push origin fix/dm-mono-readability`
9. Report back: branch name, commit SHA, count of selectors fixed, count of DM Mono selectors left untouched (will be NDOT in Branch 3).

## Important do's and don'ts

- ✅ DO add a comment in the CSS block where the 6 NDOT-branch selectors live, noting "font-family will be set to var(--font-ndot) in feat/ndot-display-accent" — this helps the next agent
- ✅ DO bump `font-size` first, then `letter-spacing` — if both are bad, the order matters less, but size is the bigger readability issue
- ✅ DO verify with browser dev tools that computed `font-size` and `letter-spacing` match what you wrote
- ❌ DON'T change `font-family` on the 6 NDOT-branch selectors (`.pcard-num`, `.cs-number`, `.lbl`, `.lbl-inv`, `.skill-n`, `.clock-h`, `.clock-m`, `.clock-colon`)
- ❌ DON'T change any text content, color, layout, or hover behavior — readability fix only
- ❌ DON'T change `font-family` on timestamps, dates, IP addresses, hex codes, or other true monospace contexts (keep DM Mono)
- ❌ DON'T touch pop-out hover rules, color profile, or any other recent work

## Verification commands (run before declaring done)

```bash
# Working tree should only show edits to portfolio-combined.html
cd /home/radxa/dev-shared/projects/portfolio-website
git status
git diff --stat

# JetBrains Mono is in the link
grep -n "JetBrains" prototypes/portfolio-combined.html

# Count of selectors using DM Mono (should be ~10-12 remaining — the true monospace contexts + 6 NDOT-branch selectors)
grep -c "font-family: 'DM Mono'" prototypes/portfolio-combined.html

# Count of selectors using JetBrains Mono (should be ~30-40 after fix)
grep -c "font-family: 'JetBrains Mono'" prototypes/portfolio-combined.html
```

## When done, return

Return a short report:
- Commit SHA(s)
- Branch name (`fix/dm-mono-readability`)
- Count of DM Mono selectors remaining (should be ~10-15: 6 NDOT-branch + ~5 true-monospace)
- Count of JetBrains Mono selectors after fix (should be ~30-40)
- Whether browser visual check passed (yes/no + screenshot if available)
- Any blockers (e.g., "couldn't find a context for selector X, classified as 'leave alone'")