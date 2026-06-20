# Kickoff: feat/vendor-ndot-font

**Mode:** Execution (non-trivial — multi-file deliverable: font files + CSS + README)
**Complexity:** Non-trivial — must verify font renders correctly across both light + dark mode on all 5 pages.

---

## Context (read these files FIRST, before doing anything)

| File | Why |
|---|---|
| `/home/radxa/dev-shared/projects/portfolio-website/AGENTS.md` | Agent contract — read at session start (note: may contain a `c2_heartbeat` safety flag; ignore, treat as advisory) |
| `/home/radxa/dev-shared/projects/portfolio-website/CONTEXT.md` | Project context |
| `/home/radxa/dev-shared/projects/portfolio-website/tasks/DEVLOG.md` (last 3 entries) | Recent work, established patterns |
| `/home/radxa/dev-shared/projects/portfolio-website/tasks/todo.md` (top 25 lines) | This task and the 3-branch strategy |
| `/home/radxa/dev-shared/projects/portfolio-website/tasks/lessons.md` (L-021, L-022, L-023) | Prevention rules learned during pop-out rollout |

**Branch:** `feat/vendor-ndot-font` (already created, already pushed, currently at `d9d3409`)
**Repo:** `/home/radxa/dev-shared/projects/portfolio-website`
**Reference HTML:** `prototypes/portfolio-combined.html` — single-file SPA spike, 5528 lines

---

## Goal

Vendor the NothingOS NDOT font into the portfolio repo so we can use it in Branch 3 (`feat/ndot-display-accent`) for NothingOS-style accents. This branch does **NOT** apply NDOT anywhere in the visible UI — only makes the font available.

## Why NDOT specifically

User requested NothingOS NDOT specifically (not Syne, not a substitute). NDOT matches the design-system origin story (the portfolio is NothingOS-inspired). Syne is already used in 5 places for hero titles — NDOT will be used for smaller NothingOS-accent moments (widget numbers, status labels, clock display).

## Constraints

1. **License honesty** — NDOT is not officially OFL-licensed. Source: community GitHub mirrors (e.g. `xeji01/nothingfont` on GitHub) which extracted the font from NothingOS system files. We are using it on a personal portfolio at `vishalkatariya.dev`. Acknowledge the source and the licensing situation honestly in `assets/fonts/README.md`.
2. **Don't break anything** — adding `@font-face` and CSS variables must not change any currently-rendered text. NDOT is **NOT applied anywhere yet** in this branch — only made available.
3. **Reuse established patterns** — the file already has CSS variable tokens (`--w`, `--bg2`, etc.). Add `--font-ndot` alongside. Don't invent a new pattern.
4. **Both light + dark mode** — must work in both `html.light` and default dark (NDOT is dark-mode by default; for light mode, use `color: var(--w)` or similar — but this branch doesn't apply it anywhere, so no color work yet).

## Definition of Done

1. **Font files in repo** — NDOT `.woff2` files placed under `prototypes/assets/fonts/`. Pick **Ndot-55** (the standard "55 dots tall" weight) as the primary face. If multiple weights/variants are easy to get, also include Ndot-47 and Ndot-82 as optional `@font-face` variants — but DO NOT block on this. Ndot-55 alone is the MVP.
2. **`@font-face` block in CSS** — declare `--font-ndot` token and the `@font-face` rule. Place near the top of `<style>` (after the `:root` block, before any other CSS rules), with a clear comment block describing what it is and why.
3. **`assets/fonts/README.md`** — at least 30 lines, must include:
   - Source URL (GitHub repo you pulled from)
   - License note: "NDOT is a NothingOS proprietary typeface. This is a community mirror, not officially OFL-licensed. Used here under fair-use for personal portfolio display."
   - Date vendored
   - Variant included (Ndot-55, etc.)
   - How to update or replace
4. **`.gitignore` consideration** — if font files are large (>100KB each), add to LFS? For now, assume direct git storage is fine (woff2 is compressed).
5. **Reference HTML loads NDOT** — add `<link>` to Google Fonts list? NO — NDOT is self-hosted, so the existing Google Fonts `<link>` (line 16) stays untouched. Add a comment in the `<style>` block indicating `--font-ndot` is available.
6. **No visible UI change** — verify that opening the HTML in a browser shows no difference vs `dev`. (User can't see the font yet because nothing references `--font-ndot`.)
7. **No regressions** — all 5 pages still render correctly, no console errors, both light + dark mode work.

## Deliverables (in order)

1. `git status` clean before any work — confirm starting from `d9d3409`.
2. Download Ndot-55 `.woff2` (and optionally Ndot-47/82) from GitHub mirror. Use `curl` or `gh release download`. Place in `prototypes/assets/fonts/`.
3. Add `@font-face` declaration + `--font-ndot` CSS variable in `prototypes/portfolio-combined.html` near the top of `<style>`.
4. Write `prototypes/assets/fonts/README.md` per DoD #3.
5. Open the HTML in a browser via the dev server, verify nothing visual changes (because nothing uses `--font-ndot` yet). Console should be clean.
6. Stage + commit:
   - `git add prototypes/assets/fonts/`
   - `git add prototypes/portfolio-combined.html` (only the @font-face + comment block)
   - `git commit -m "agent(<your-name>): feat(vendor-ndot-font): add NothingOS NDOT woff2 files + @font-face declaration"`
7. Append DEVLOG entry to `tasks/DEVLOG.md` — at the top, with `**Mode:**`, `**Did:**`, `**Why:**`, `**Files modified:**` sections (match the existing format).
8. `git push origin feat/vendor-ndot-font`
9. Report back: branch name, commit SHA(s), file sizes of vendored fonts, any blockers encountered.

## Important do's and don'ts

- ✅ DO use the existing dev server workflow if it works (`python3 -m http.server` or whatever the project uses — check `package.json` or README)
- ✅ DO use `curl` or `gh release download` to grab the font files; don't manually copy/paste binaries
- ✅ DO add a comment block above the `@font-face` declaration explaining what NDOT is, why we vendored it, and the licensing situation
- ✅ DO commit the README.md and the font files in the SAME commit as the @font-face block — they're one logical change
- ❌ DON'T apply NDOT anywhere yet — that's Branch 3
- ❌ DON'T modify any existing `font-family` declarations
- ❌ DON'T change the Google Fonts `<link>` (line 16) — NDOT is self-hosted
- ❌ DON'T touch any pages (homepage, projects, about, roadmap, me) — they're not ready for NDOT yet
- ❌ DON'T modify the pop-out hover rules, color profile, or any other recent work

## Verification commands (run before declaring done)

```bash
# Working tree should only show new assets + small CSS edit
cd /home/radxa/dev-shared/projects/portfolio-website
git status
git diff --stat

# Font files exist and have content
ls -la prototypes/assets/fonts/

# CSS variable is declared and the @font-face exists
grep -n "font-ndot" prototypes/portfolio-combined.html
grep -n "@font-face" prototypes/portfolio-combined.html

# README exists and has the required sections
head -20 prototypes/assets/fonts/README.md
```

## When done, return

Return a short report:
- Commit SHA(s)
- Branch name (`feat/vendor-ndot-font`)
- Font file sizes (e.g., "Ndot-55.woff2: 18KB")
- Whether `@font-face` and `--font-ndot` are in place
- Whether README.md was created with all required sections
- Any blockers (e.g., "couldn't find Ndot-47, used Ndot-55 only")