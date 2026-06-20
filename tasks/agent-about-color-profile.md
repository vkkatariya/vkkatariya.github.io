# Agent Kickoff — Apply roadmap color profile to about page

## Project
- **Name:** portfolio-website
- **Path:** `~/dev-shared/projects/portfolio-website/`
- **Branch (already created):** `feat/about-color-profile` (off `dev`)
- **Source file (only one):** `prototypes/portfolio-combined.html`
- **Target:** `#pg-about` section only (and `#pg-me` if it renders)

## Goal
Apply the same roadmap-style accent color system that is already live on `#pg-home` and `#pg-projects` to `#pg-about` (and `#pg-me` if reachable). Visual parity: about page widgets, skill bars, contact card, education card, and language card should all get the lime/amber/periwinkle `pct-high / pct-mid / pct-low` treatment.

## Context — what already exists

The color profile was rolled out in two passes:
- `feat/roadmap-color-profile-site-wide` (commit `d241b67`) — base color tokens and `#pg-roadmap` selectors
- `feat/color-profile-site-wide` (commit `0f19a97`) — extended to `#pg-home` and `#pg-projects` (now merged into `dev`)

**Reference selectors to mirror** (from `dev` HEAD `prototypes/portfolio-combined.html`):
- Search for `pct-high`, `pct-mid`, `pct-low` classes in the file — those are the user-facing color classes
- Search for `.skill-fill`, `.tl-badge`, `.pcard-foot` — those are the actual element selectors that get the colors
- Read the CSS rules under `#pg-home` and `#pg-projects` for these classes — they are the template

## Hard Scope Rules (DO NOT BREAK)

1. **ONLY edit `#pg-about` and (if present) `#pg-me` sections.** Do not touch:
   - `#pg-home` CSS or markup
   - `#pg-projects` CSS or markup
   - `#pg-roadmap` CSS or markup
   - The shared `#shared-nav` or `#roadmap-internal-nav` topbars
   - Any other section

2. **NO new design tokens.** Use the colors that are already declared in `:root` (the same ones `#pg-home`/`#pg-projects` reference). Do not invent new color values, palette names, or hex codes. If a needed token does not already exist, STOP and report back.

3. **NO UI layout changes.** Only add color CSS rules. Do not change sizes, padding, margins, font sizes, or positions of about-page elements. No new markup. No new JS. No new animations.

4. **NO spillover.** Every selector you add must be scoped under `#pg-about` (or `#pg-me`). Bare element selectors and class selectors without the page prefix are forbidden — they will leak onto other pages.

5. **Verify before commit.** Run `python3 -m http.server 8087` against `prototypes/portfolio-combined.html`, open with `curl -s http://127.0.0.1:8087/prototypes/portfolio-combined.html | head -50` to confirm 200, then check the diff:
   - `git diff dev..feat/about-color-profile --stat` — should ONLY touch `prototypes/portfolio-combined.html` (and `tasks/DEVLOG.md` for the entry)
   - `git diff dev..feat/about-color-profile -- prototypes/portfolio-combined.html | grep -E '^[-+].*pg-(home|projects|roadmap)'` — must be empty (no other-page edits)

## Acceptance Criteria

- [ ] About page bio card, education card, skill bars, languages card, contact card all display colored accents (lime/amber/periwinkle, matching home + projects)
- [ ] Light mode (`html.light` class) still looks correct — no regressions
- [ ] No other page was changed
- [ ] Working tree clean, single commit on `feat/about-color-profile`
- [ ] `tasks/DEVLOG.md` entry added with your agent name, commit SHA, and verification steps

## Workflow

1. `cd ~/dev-shared/projects/portfolio-website`
2. `git status` — confirm on `feat/about-color-profile`, clean
3. `git log --oneline dev..HEAD` — should be empty (fresh branch)
4. Read `prototypes/portfolio-combined.html` lines that contain `#pg-about` (find with `grep -n '#pg-about'`)
5. Read the matching `#pg-home` and `#pg-projects` color CSS to understand the pattern
6. Plan the new CSS rules — show in `tasks/todo.md` under the existing `[~] Extend roadmap color profile to about/me` item as a sub-bullet if it gets long
7. Make the edits
8. Verify per the "NO spillover" rule above
9. Commit: `git add prototypes/portfolio-combined.html tasks/DEVLOG.md` → `git commit -m "feat(portfolio-combined): apply roadmap color profile to about page"` (use the agent commit prefix from your skill)
10. Push: `git push origin feat/about-color-profile`
11. Update `tasks/todo.md`: change the line back to `[x]`
12. **STOP. Do NOT merge to dev. Do NOT open a PR. The user reviews and merges manually.**

## After the agent finishes

The user (Vishal) will:
- Verify the diff manually
- Open a PR `feat/about-color-profile → dev` if happy
- Merge to dev themselves
- Then merge dev → main themselves

**Do not merge to dev under any circumstances.** This is a hard rule per L-014 and the project dev setup.

## Branch Hygiene

- All work happens on `feat/about-color-profile` — already created
- Do not create sub-branches
- Do not commit to dev or main
- If you need to discard the branch entirely: `git checkout dev && git branch -D feat/about-color-profile && git push origin --delete feat/about-color-profile` — but ask first

## Agent Identity

Sign your commits with `agent(<name>):` prefix per project convention. Add a DEVLOG entry under the existing color-profile section in `tasks/DEVLOG.md` with the format:

```
## [<YYYY-MM-DD>] <Agent> — apply roadmap color profile to about page
**Mode:** Execution (micro-loop)
**Did:** ...
**State:** Working on feat/about-color-profile, awaiting user review
**Modified:** prototypes/portfolio-combined.html
```

## Emergency Stop

If anything goes wrong (conflict, page break, unexpected diff in other sections), STOP and report:
- What you tried
- What went wrong
- The exact command output / error
- What you think the fix is

Do not improvise. Do not reset. Do not force-push.
