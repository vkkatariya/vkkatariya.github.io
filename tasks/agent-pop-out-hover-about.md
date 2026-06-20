# Agent Kickoff — Pop-Out Hover for About Page

## Project
- **Name:** portfolio-website
- **Path:** `/home/radxa/dev-shared/projects/portfolio-website/`
- **Branch (already created):** `feat/pop-out-hover-about` (off `dev`)
- **Source file (only one):** `prototypes/portfolio-combined.html`
- **Target:** `#pg-about` ONLY. Do not touch any other page.

## Goal
Add pop-out hover effects to FOUR specific widgets on the about page that the user identified as missing the hover. Most other widgets on the about page are already covered by the global rule — don't touch them.

## Widgets to fix (4 total)

The user identified these 4 widgets as NOT popping out. Find each one in the markup, then add hover.

### 1. Photo widget
**Selector:** `.photo-block`
**Location:** around line 4240 in the `#pg-about` section
**Structure:**
```html
<div class="photo-block">
  <div class="photo-frame">…</div>
  <div class="photo-status">open to internships</div>
</div>
```
**Current state:** No hover. The whole `.photo-block` is ONE widget (photo + status badge), so hover the whole thing.

### 2. Core technical skills widget
**Selector:** Currently has NO class — it's an inline-styled `<div>` wrapper. **YOU MUST ADD A CLASS** to it.
**Location:** around line 4314 in the `#pg-about` section (just before the `.skill-bars` div)
**Current markup:**
```html
<div style="padding:24px 28px;border-radius:20px;background:var(--bg2);border:1px solid var(--w06);box-shadow:4px 4px 14px var(--sd),-1px -1px 5px var(--sl);margin-bottom:14px">
  <div style="font-family:'DM Mono',monospace;font-size:8px;letter-spacing:3px;color:var(--w30);text-transform:uppercase;margin-bottom:18px;display:flex;align-items:center;gap:7px">…core technical</div>
  <div class="skill-bars">
    <div class="skb-row">…</div>
    …
  </div>
</div>
```
**Required change:** Add `class="core-tech-card"` to the outer div (it currently has no class). The line starts with `<div style="padding:24px 28px;…` — change to `<div class="core-tech-card" style="padding:24px 28px;…`.

**Why this widget is ONE widget, not many:** The whole inline-styled wrapper contains a single cohesive visual (the 7 skill bars). It functions as one "core technical skills" card. Per L-021, hover the wrapper, NOT the inner `.skb-row` items.

### 3. Interests widget
**Selector:** `.int-card` (4 of them — Programming, AI, Cricket, Entrepreneurship)
**Location:** around lines 4372–4407 in the `#pg-about` section (inside `<div class="int-grid">`)
**Structure:**
```html
<div class="int-grid">
  <div class="int-card">…Programming…</div>
  <div class="int-card">…AI…</div>
  <div class="int-card">…Cricket…</div>
  <div class="int-card">…Entrepreneurship…</div>
</div>
```
**Current state:** Has only a `border-color` hover (line 1623 — `.int-card:hover{border-color:var(--w12)}`). Needs the full pop-out transform + shadow.
**Why individual:** Each `.int-card` is a distinct interactive widget. The `.int-grid` wrapper has many cards, so hover the INNER widgets (per L-021).

### 4. Contact widgets
**Selector:** `.contact-card` (4 of them — Email, GitHub, LinkedIn, Website)
**Location:** around lines 4435–4480 in the `#pg-about` section (inside `<div class="contact-grid">`)
**Structure:**
```html
<div class="contact-grid">
  <a class="contact-card" href="mailto:…">…email…</a>
  <a class="contact-card" href="…github…">…github…</a>
  <a class="contact-card" href="…linkedin…">…linkedin…</a>
  <a class="contact-card" href="…website…">…website…</a>
</div>
```
**Current state:** Has only a `border-color` + `background` hover (line 1643 — `.contact-card:hover{border-color:var(--w12);background:var(--bg3)}`). The about-color-profile work also added a `transition: border-color .2s, background .2s` at line 1712. Needs the full pop-out transform + shadow.
**IMPORTANT:** The existing `.contact-card` hover sets a background change. The new pop-out will ADD a transform/shadow on top. Both effects can stack — the bg change is just `background-color`, the pop-out is `transform` + `box-shadow` + `border-color`. They don't conflict.
**Why individual:** Each `.contact-card` is a distinct interactive widget (a clickable link).

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

**DO NOT modify this rule.** Just add page-specific rules for the 4 about-page widgets.

## Hard scope rules

1. **ONLY edit `#pg-about` selectors.** Do not touch:
   - `#pg-home`, `#pg-projects`, `#pg-roadmap`, `#pg-me`
   - The shared topbar (`#shared-nav`, `#roadmap-internal-nav`)
   - The global hover rule at lines 2612–2623
   - The existing `.contact-card:hover` rule at line 1643 and the existing `.int-card:hover` rule at line 1623 (they add a border-color change, which is fine to keep on top of the new pop-out)
   - The about-color-profile rules at lines 1712–1751 (the `#pg-about .contact-card` transition/hover rules from the about-color-profile work — keep these)
   - Any `:root` variables, any keyframes, any non-hover CSS

2. **NO new design tokens.** Use existing tokens (`--sd`, `--sl`, `--w06`).

3. **NO new transitions or animations.** Reuse the exact curve: `transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease`. Reuse the exact transform: `translateY(-2px) scale(1.012)`. Reuse the same shadow. Reuse the same border-color tint.

4. **Markup changes are MINIMAL and EXPLICITLY allowed:**
   - ONLY add `class="core-tech-card"` to the 1 inline-styled wrapper div in the about page's "core technical skills" section. NOTHING else.
   - Do not add any other classes, do not remove any existing markup, do not change any text content.

5. **NO JS changes.**

6. **All selectors MUST be scoped under `#pg-about`.** No bare element selectors, no global rules.

## Specific CSS to add

Add this block at the END of the `#pg-about` CSS block. Find it with `grep -n '#pg-about' prototypes/portfolio-combined.html` and append to that section.

```css
/* ══════════════════════════════════════════
   POP-OUT HOVER (About Page)
   Per-widget hover for the 4 widgets the user identified as missing it.
   .photo-block and .core-tech-card lift as whole widgets (per L-021's
   "one cohesive visual" rule). .int-card and .contact-card lift
   individually (they are distinct interactive widgets, not data rows).
   Reuses the same transform/shadow/transition as the global rule.
══════════════════════════════════════════ */
#pg-about .photo-block,
#pg-about .core-tech-card,
#pg-about .int-card,
#pg-about .contact-card {
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}

#pg-about .photo-block:hover,
#pg-about .core-tech-card:hover,
#pg-about .int-card:hover,
#pg-about .contact-card:hover {
  transform: translateY(-2px) scale(1.012);
  box-shadow: 8px 10px 24px var(--sd), -2px -2px 10px var(--sl);
  border-color: var(--w06);
}
```

**Note on stacking with existing hovers:**
- `.int-card:hover` already has `border-color:var(--w12)` at line 1623. The new rule will override this with `border-color:var(--w06)` since it's defined later in the stylesheet. The behavior: on hover, border goes from the base to `var(--w06)` and the card lifts.
- `.contact-card:hover` already has `border-color:var(--w12);background:var(--bg3)` at line 1643. The new rule will override the border-color to `var(--w06)` (the lift is the dominant visual) but the existing `background:var(--bg3)` (set in the base hover rule at line 1643, NOT in your new rule) is defined EARLIER so it will still apply. The behavior: on hover, background changes to `var(--bg3)` AND border tints AND card lifts. All three effects stack.

**If you want to keep the EXISTING border-color for `.int-card` and `.contact-card` instead of the new `var(--w06)`, write the rules WITHOUT the `border-color` property:**
```css
#pg-about .int-card:hover,
#pg-about .contact-card:hover {
  transform: translateY(-2px) scale(1.012);
  box-shadow: 8px 10px 24px var(--sd), -2px -2px 10px var(--sl);
  /* border-color: keep existing var(--w12) — do not override */
}
```

You decide which version is cleaner. Either is acceptable. The simplest is the full block above (let `var(--w06)` be the new border on hover — consistent with the rest of the page).

**Light mode:** Same as before. `--sd`, `--sl`, `--w06` are defined in both `:root` and `html.light`. No light-mode override needed.

## Acceptance criteria

- [ ] `.photo-block` lifts with shadow + border tint on hover (dark mode + light mode)
- [ ] `.core-tech-card` lifts with shadow + border tint on hover (the new class you added to the inline-styled wrapper)
- [ ] `.int-card` (4 of them) lift with shadow on hover — individually, not as a grid
- [ ] `.contact-card` (4 of them) lift with shadow on hover — individually, not as a grid
- [ ] `.edu-card` (education) still works via the global rule (don't break it)
- [ ] `.skill-group` (the 4 chip groups) still works via the global rule
- [ ] `.lang-card` (the 4 language cards) still works via the global rule
- [ ] The 4 `pcard`, `phase-card`, etc. on the projects page still work
- [ ] No other page was changed
- [ ] No new tokens, no new transitions
- [ ] HTTP 200 from local server
- [ ] The `.core-tech-card` markup change: only 1 line changed (the wrapper div now has `class="core-tech-card"`)

## Workflow

1. `cd /home/radxa/dev-shared/projects/portfolio-website`
2. `git status` — confirm on `feat/pop-out-hover-about`, clean
3. `git log --oneline dev..HEAD` — should be empty (fresh branch)
4. Find the 4 widgets in the markup:
   - `.photo-block` — `grep -n 'class="photo-block"' prototypes/portfolio-combined.html`
   - "core technical" inline-styled wrapper — look for `<div style="padding:24px 28px;` near line 4314
   - `.int-card` — `grep -n 'class="int-card"' prototypes/portfolio-combined.html` (should be 4 matches)
   - `.contact-card` — `grep -n 'class="contact-card"' prototypes/portfolio-combined.html` (should be 4 matches)
5. Find the `#pg-about` CSS block end — look for existing `#pg-about` rules and append to that section
6. Make the markup change: add `class="core-tech-card"` to the 1 inline-styled wrapper
7. Make the CSS additions: 2 selector groups (transition + hover) at the end of `#pg-about` CSS
8. Verify: HTTP 200 from `python3 -m http.server 8095`
9. Verify scope:
   - `git diff dev..HEAD --stat` shows only `prototypes/portfolio-combined.html` + tasks files
   - `git diff dev..HEAD -- prototypes/portfolio-combined.html | grep -E '^[-+].*#pg-(home|projects|roadmap|me)'` MUST BE EMPTY
   - `git diff dev..HEAD -- prototypes/portfolio-combined.html | grep -E '^\+.*class="core-tech-card"' | wc -l` should be 1 (the 1 markup change)
10. Commit: `git add prototypes/portfolio-combined.html tasks/DEVLOG.md tasks/todo.md` → `git commit -m "feat(portfolio-combined): pop-out hover on about page (photo, core-tech, interests, contact)"`
    Use `agent(<your-name>):` prefix in the commit message.
11. Push: `git push origin feat/pop-out-hover-about`
12. Update `tasks/todo.md`: flip the "Page 3: about" sub-item from `[ ]` to `[x]`
13. **STOP. Do NOT merge to dev. Do NOT open a PR.** The user (Vishal) reviews and merges.

## After the agent finishes

Report back to Hermes with:
- The exact commit SHA
- Line numbers of the new CSS rules
- The line number of the 1 markup change (where you added `class="core-tech-card"`)
- Confirmation: scope check empty, no other-page changes, light + dark mode both work
- Visual description: "hover on `.photo-block` lifts it, hover on `.core-tech-card` lifts it, hover on `.int-card` lifts it independently, hover on `.contact-card` lifts it independently"

If anything went wrong, STOP and report — do not improvise.

## Branch hygiene

- All work on `feat/pop-out-hover-about` only. No sub-branches.
- Do NOT commit to `dev` or `main`.
- If you need to abort: ask first.

## Agent identity

Sign your commits with `agent(<name>):` prefix.

Add a DEVLOG entry at the top of `tasks/DEVLOG.md` with format:
```
## [<YYYY-MM-DD>] <Agent> — pop-out hover on about page (4 widgets)
**Mode:** Execution (micro-loop)
**Did:** ...
**State:** Working on feat/pop-out-hover-about, awaiting user review
**Modified:** prototypes/portfolio-combined.html
```

## Emergency stop

If anything goes wrong (conflict, page break, unexpected diff in other sections), STOP and report.
