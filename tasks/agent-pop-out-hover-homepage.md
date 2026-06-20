# Agent Kickoff — Pop-Out Hover for Homepage

## Project
- **Name:** portfolio-website
- **Path:** `/home/radxa/dev-shared/projects/portfolio-website/`
- **Branch (already created):** `feat/pop-out-hover-homepage` (off `dev`)
- **Source file (only one):** `prototypes/portfolio-combined.html`
- **Target:** `#pg-home` ONLY. Do not touch any other page.

## Goal
Finish the pop-out hover effect on the homepage. Two specific widgets are missing it:

1. **`.about-section`** (the large block at the bottom of the homepage containing the bio + contact)
2. **`.about-contact`** (the smaller "contact" widget inside `.about-section`)

These are at `prototypes/portfolio-combined.html` lines 3068 and 3076 respectively.

## Reference work already done

There is a **global widget hover rule** at lines 2612–2623 of `prototypes/portfolio-combined.html`:

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

**DO NOT modify this rule.** Just add page-specific rules that match the same effect for `.about-section` and `.about-contact`.

## CRITICAL — User memory note

Per user-confirmed memory (from `tasks/lessons.md` / `tasks/DEVLOG.md`):
> **About page: `.about-bio` and `.about-contact` need independent hover (NOT parent `.about-section`).**

This means: the `.about-section` and `.about-contact` hovers must be **independent selectors with independent transitions**, not a parent-child cascade. Add them as TWO separate rules. The user has explicitly corrected this in the past.

## Hard scope rules

1. **ONLY edit `#pg-home` selectors.** Do not touch:
   - `#pg-projects`, `#pg-about`, `#pg-roadmap`, `#pg-me` (those are separate tasks)
   - The shared topbar (`#shared-nav`, `#roadmap-internal-nav`)
   - The global hover rule at lines 2612–2623 (do not change it)
   - Any `:root` variables, any keyframes, any non-hover CSS

2. **NO new design tokens.** Use existing tokens (`--sd`, `--sl`, `--w06`). No new color values.

3. **NO new transitions or animations.** Reuse the exact curve: `transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease`. Reuse the exact transform: `translateY(-2px) scale(1.012)`. Reuse the same shadow. Reuse the same border-color tint.

4. **NO markup changes.** Only CSS.

5. **NO JS changes.**

6. **All selectors MUST be scoped under `#pg-home`.** No bare `.about-section` rules.

## Specific CSS to add

Add these two rules at the END of the `#pg-home` CSS block (find it with `grep -n '#pg-home' prototypes/portfolio-combined.html` and append to that section, NOT to a new spot at the end of the file):

```css
/* Pop-out hover on bottom block (last big block on homepage) */
#pg-home .about-section {
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}
#pg-home .about-section:hover {
  transform: translateY(-2px) scale(1.012);
  box-shadow: 8px 10px 24px var(--sd), -2px -2px 10px var(--sl);
  border-color: var(--w06);
}

/* Pop-out hover on the small contact widget inside the bottom block.
   INDEPENDENT hover — not the parent .about-section's hover. */
#pg-home .about-contact {
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}
#pg-home .about-contact:hover {
  transform: translateY(-2px) scale(1.012);
  box-shadow: 8px 10px 24px var(--sd), -2px -2px 10px var(--sl);
  border-color: var(--w06);
}
```

**Important:** If `.about-section` already has a `transition` property defined elsewhere (e.g. in a `--base` rule), do NOT overwrite it. The `transition` line should only be added if the element doesn't already transition on the same three properties. Check with `grep -nE '\.about-section[^{]*\{' prototypes/portfolio-combined.html` before adding.

**Light mode:** Check if the same selectors need overrides for `html.light`. The `html.light .about-section` rule may exist (the about-color-profile commit may have added one). If it exists, leave it alone. If hover doesn't work in light mode, add matching `html.light #pg-home .about-section:hover` and `html.light #pg-home .about-contact:hover` rules with the same pattern.

## Acceptance criteria

- [ ] `.about-section` lifts and gains shadow on hover (dark mode)
- [ ] `.about-section` lifts and gains shadow on hover (light mode)
- [ ] `.about-contact` lifts and gains shadow on hover (dark mode)
- [ ] `.about-contact` lifts and gains shadow on hover (light mode)
- [ ] `.about-bio` is NOT affected by `.about-section:hover` (independent hover)
- [ ] `.contact-row` (the inner links inside `.about-contact`) still has its own color hover
- [ ] No other page was changed
- [ ] No markup, no JS, no new tokens
- [ ] HTTP 200 from local server

## Workflow

1. `cd /home/radxa/dev-shared/projects/portfolio-website`
2. `git status` — confirm on `feat/pop-out-hover-homepage`, clean
3. `git log --oneline dev..HEAD` — should be empty (fresh branch)
4. Read `prototypes/portfolio-combined.html` lines around 3068 to see the markup
5. Read existing `#pg-home` CSS block (search with `grep -n '#pg-home'`) to find the right place to insert
6. Make the CSS edits — TWO independent hover rules
7. Verify: HTTP 200 + visual check at 1440px (hover the elements)
8. Verify scope: `git diff dev..HEAD --stat` shows only the new file
9. Verify scope: `git diff dev..HEAD -- prototypes/portfolio-combined.html | grep -E '^[-+].*#pg-(projects|about|roadmap|me)'` MUST BE EMPTY
10. Commit: `git add prototypes/portfolio-combined.html tasks/DEVLOG.md tasks/todo.md` → `git commit -m "feat(portfolio-combined): pop-out hover on homepage about-section + about-contact"`. Use `agent(<your-name>):` prefix in the commit message.
11. Push: `git push origin feat/pop-out-hover-homepage`
12. Update `tasks/todo.md`: flip the "Page 1: homepage" sub-item from `[ ]` to `[x]`
13. **STOP. Do NOT merge to dev. Do NOT open a PR.** The user (Vishal) reviews and merges.

## After the agent finishes

Report back to Hermes with:
- The exact commit SHA on the branch
- Line numbers of the new CSS rules
- Confirmation: scope check empty, no other-page changes, light + dark mode both work
- Visual description: "hover on `.about-section` lifts it, hover on `.about-contact` lifts it independently"

If anything went wrong, STOP and report — do not improvise.

## Branch hygiene

- All work on `feat/pop-out-hover-homepage` only. No sub-branches.
- Do NOT commit to `dev` or `main`.
- If you need to abort: `git checkout dev && git branch -D feat/pop-out-hover-homepage && git push origin --delete feat/pop-out-hover-homepage` — but ASK FIRST.

## Agent identity

Sign your commits with `agent(<name>):` prefix per project convention.

Add a DEVLOG entry at the top of `tasks/DEVLOG.md` with format:
```
## [<YYYY-MM-DD>] <Agent> — pop-out hover on homepage .about-section + .about-contact
**Mode:** Execution (micro-loop)
**Did:** ...
**State:** Working on feat/pop-out-hover-homepage, awaiting user review
**Modified:** prototypes/portfolio-combined.html
```

## Emergency stop

If anything goes wrong (conflict, page break, unexpected diff in other sections), STOP and report:
- What you tried
- What went wrong
- The exact command output / error
- What you think the fix is

Do not improvise. Do not reset. Do not force-push.
