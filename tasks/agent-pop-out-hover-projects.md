# Agent Kickoff — Pop-Out Hover for Projects Page

## Project
- **Name:** portfolio-website
- **Path:** `/home/radxa/dev-shared/projects/portfolio-website/`
- **Branch (already created):** `feat/pop-out-hover-projects` (off `dev`)
- **Source file (only one):** `prototypes/portfolio-combined.html`
- **Target:** `#pg-projects` ONLY. Do not touch any other page.

## Goal
Add pop-out hover effects to the projects page widgets. This is the BIGGEST page in the pop-out rollout — many selectors.

## Selectors that need hover (user-confirmed)

| Selector | What it is | Currently has hover? |
|---|---|---|
| `.pi` | top project index cards | only background change (line 1179) |
| `.proj-index` | wrapper around the .pi cards | NO |
| `.pcard` | project detail cards | YES via global rule at 2619 (with `!important` translateY(-2px) scale(1.012)) |
| `.pcard-num` | "01 / 04" badge | NO |
| `.pcard-title` | project title | NO |
| `.pcard-desc` | project description | NO |
| `.pcard-tags` | chip wrapper | NO |
| `.pcard-foot` | footer row with type tag | NO |
| `.pfoot-type` | type tag inside footer | NO |
| `.phase-card` | project phase card (a `.pcard` variant) | YES via global rule (`.pcard:hover` covers it) |
| `.pipeline` | pipeline wrapper | NO |
| `.pipe-stage` | pipeline stage | NO |
| `.platform-grid` | platform tech grid wrapper | NO |
| `.plat` | individual platform tile | NO |
| `.cs-section` | each project's case-study section | NO |

**`.pcard` and `.phase-card` are already covered by the global rule at lines 2612–2623.** DO NOT add hover rules for them — just verify they work. Focus your work on the 13 OTHER selectors.

## CRITICAL — User memory constraint

> **`.pcard` inline `overflow:hidden` clips hover shadow — must change to `overflow:visible` on project detail cards only.**

There are 3 `.pcard` elements on the projects page with `style="...position:relative;overflow:hidden"`. Find them with:
```bash
grep -n 'class="pcard" style="animation-delay' prototypes/portfolio-combined.html
```

For each, change `overflow:hidden` → `overflow:visible` so the pop-out shadow isn't clipped. ONLY change these 3 .pcard inline styles. Do not change `.pcard` in `.phase-card` (no `overflow:hidden` there anyway), and do not change `.pcard` on the homepage.

## Reference (global rule already in dev)

The global rule at lines 2612–2623:
```css
.widget, .pcard, .skill-group, .lang-card, .lcard, .edu-card, .tl-badge, .card, .panel, .w {
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease !important;
}

.widget:hover, .pcard:hover, .skill-group:hover, .lang-card:hover, .lcard:hover, .edu-card:hover, .tl-badge:hover, .card:hover, .panel:hover, .w:hover {
  transform: translateY(-2px) scale(1.012) !important;
  box-shadow: 8px 10px 24px var(--sd), -2px -2px 10px var(--sl) !important;
  border-color: var(--w06) !important;
}
```

**DO NOT modify this rule.** Just add page-specific rules that match the same effect.

## Hard scope rules

1. **ONLY edit `#pg-projects` selectors.** Do not touch:
   - `#pg-home`, `#pg-about`, `#pg-roadmap`, `#pg-me`
   - The shared topbar (`#shared-nav`, `#roadmap-internal-nav`)
   - The global hover rule at lines 2612–2623
   - The base `.pcard:hover` rule at line 735 (it's already overridden by the global `!important`)
   - Any `:root` variables, any keyframes, any non-hover CSS
   - Other `.pcard` elements (homepage, roadmap) — only the 3 project-detail `.pcard` cards get the `overflow:visible` change

2. **NO new design tokens.** Use existing tokens (`--sd`, `--sl`, --w06).

3. **NO new transitions or animations.** Reuse the exact curve: `transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease`. Reuse the exact transform: `translateY(-2px) scale(1.012)`. Reuse the same shadow. Reuse the same border-color tint.

4. **Markup changes are EXCEPTIONALLY allowed:**
   - ONLY the 3 inline `style="...overflow:hidden"` → `style="...overflow:visible"` changes on project detail `.pcard` elements
   - NOTHING else — no new classes, no new attributes, no removing existing markup

5. **NO JS changes.**

6. **All selectors MUST be scoped under `#pg-projects`.** No bare element selectors, no global rules.

## Specific CSS to add

Add this block at the END of the `#pg-projects` CSS block. Find it with `grep -n '#pg-projects' prototypes/portfolio-combined.html` and append to that section.

```css
/* ══════════════════════════════════════════
   POP-OUT HOVER (Projects Page)
   Independent hover per widget — not parent-child cascade.
   Reuses the same transform/shadow/transition as the global rule.
══════════════════════════════════════════ */
#pg-projects .pi,
#pg-projects .proj-index,
#pg-projects .pcard-num,
#pg-projects .pcard-title,
#pg-projects .pcard-desc,
#pg-projects .pcard-tags,
#pg-projects .pcard-foot,
#pg-projects .pfoot-type,
#pg-projects .phase-card,
#pg-projects .pipeline,
#pg-projects .pipe-stage,
#pg-projects .platform-grid,
#pg-projects .plat,
#pg-projects .cs-section {
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}

#pg-projects .pi:hover,
#pg-projects .proj-index:hover,
#pg-projects .pcard-num:hover,
#pg-projects .pcard-title:hover,
#pg-projects .pcard-desc:hover,
#pg-projects .pcard-tags:hover,
#pg-projects .pcard-foot:hover,
#pg-projects .pfoot-type:hover,
#pg-projects .phase-card:hover,
#pg-projects .pipeline:hover,
#pg-projects .pipe-stage:hover,
#pg-projects .platform-grid:hover,
#pg-projects .plat:hover,
#pg-projects .cs-section:hover {
  transform: translateY(-2px) scale(1.012);
  box-shadow: 8px 10px 24px var(--sd), -2px -2px 10px var(--sl);
  border-color: var(--w06);
}
```

**Why I'm including `.pcard` and `.phase-card` in BOTH selector lists** even though they're covered by the global rule: this gives them an EXPLICIT, non-`!important` rule on the projects page that's easier to debug and override per-page in the future. The global rule's `!important` will still win, so this is harmless. If you'd rather exclude them, that's fine — the visual result is identical.

**Note on `.pi`:** There's already a `.pi:hover{background:var(--bg2)}` at line 1179. The new rule will ADD a transform/shadow on top. Verify both work together (background change + lift). If the background change conflicts, you can keep it (it's a separate property — background-color and transform don't conflict).

**Note on `.pi:hover .pi-arrow`:** Line 1216 already animates the arrow inside `.pi` on hover. Keep that — it complements the new lift.

**Light mode:** Same as homepage. The `--sd`, `--sl`, `--w06` tokens are defined in both `:root` and `html.light`, so the same rules render correctly in both modes. No light-mode override needed unless verification fails.

## Markup change (the 3 .pcard cards)

Find these 3 lines:
```
class="pcard" style="animation-delay:.65s;position:relative;overflow:hidden"
class="pcard" style="animation-delay:.70s;position:relative;overflow:hidden"
class="pcard" style="animation-delay:.75s;position:relative;overflow:hidden"
```

Change each `overflow:hidden` → `overflow:visible`. NOTHING else in the style attribute.

## Acceptance criteria

- [ ] All 13 selectors (excluding `.pcard` / `.phase-card` which are covered by global) have pop-out hover on dark mode
- [ ] All 13 selectors have pop-out hover on light mode
- [ ] The 3 `.pcard` project detail cards have `overflow:visible` (shadow not clipped)
- [ ] `.pi` background still changes on hover (existing rule preserved)
- [ ] `.pi` arrow still moves on hover (existing rule preserved)
- [ ] No other page was changed
- [ ] No new tokens, no new transitions
- [ ] HTTP 200 from local server
- [ ] Visual: hovering any of the 15 selectors causes a 2px lift + scale + shadow + border tint

## Workflow

1. `cd /home/radxa/dev-shared/projects/portfolio-website`
2. `git status` — confirm on `feat/pop-out-hover-projects`, clean
3. `git log --oneline dev..HEAD` — should be empty (fresh branch)
4. Read existing `#pg-projects` CSS block — find it with `grep -n '#pg-projects'`
5. Read the 3 `.pcard` project detail cards (around lines 3030, 3049, 3067) to see the exact `style="..."` attribute
6. Make the markup changes: 3 × `overflow:hidden` → `overflow:visible`
7. Make the CSS additions: 2 selector groups (transition + hover)
8. Verify: HTTP 200 from `python3 -m http.server 8089`
9. Verify scope:
   - `git diff dev..HEAD --stat` shows only `prototypes/portfolio-combined.html` + tasks files
   - `git diff dev..HEAD -- prototypes/portfolio-combined.html | grep -E '^[-+].*#pg-(home|about|roadmap|me)'` MUST BE EMPTY
   - `git diff dev..HEAD -- prototypes/portfolio-combined.html | grep -E '^-.*overflow:hidden' | wc -l` should be 3 (the 3 changes)
10. Commit: `git add prototypes/portfolio-combined.html tasks/DEVLOG.md tasks/todo.md` → `git commit -m "feat(portfolio-combined): pop-out hover on projects page widgets (15 selectors + overflow fix on 3 detail cards)"`
    Use `agent(<your-name>):` prefix in the commit message.
11. Push: `git push origin feat/pop-out-hover-projects`
12. Update `tasks/todo.md`: flip the "Page 2: projects" sub-item from `[ ]` to `[x]`
13. **STOP. Do NOT merge to dev. Do NOT open a PR.** The user (Vishal) reviews and merges.

## After the agent finishes

Report back to Hermes with:
- The exact commit SHA
- Line numbers of the new CSS rules
- Which 3 .pcard inline styles you changed
- Confirmation: scope check empty, no other-page changes, light + dark mode both work
- Visual description: "hover on `.pi` lifts it and changes bg, hover on `.pcard-num` lifts it independently, etc."

If anything went wrong, STOP and report — do not improvise.

## Branch hygiene

- All work on `feat/pop-out-hover-projects` only. No sub-branches.
- Do NOT commit to `dev` or `main`.
- If you need to abort: ask first.

## Agent identity

Sign your commits with `agent(<name>):` prefix.

Add a DEVLOG entry at the top of `tasks/DEVLOG.md` with format:
```
## [<YYYY-MM-DD>] <Agent> — pop-out hover on projects page (15 selectors)
**Mode:** Execution (micro-loop)
**Did:** ...
**State:** Working on feat/pop-out-hover-projects, awaiting user review
**Modified:** prototypes/portfolio-combined.html
```

## Emergency stop

If anything goes wrong (conflict, page break, unexpected diff in other sections), STOP and report.
