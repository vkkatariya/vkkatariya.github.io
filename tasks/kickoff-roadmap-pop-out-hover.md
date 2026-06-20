# Kickoff — Roadmap Page Pop-Out Hover

## Branch
`feat/pop-out-hover-roadmap` (off `dev`, already pushed to origin)

## Repo root
`/home/radxa/dev-shared/projects/portfolio-website`

## Files to read FIRST (mandatory)
1. `AGENTS.md` — Six Rules + Task Management Protocol
2. `CONTEXT.md` — user-maintained project context
3. `tasks/DEVLOG.md` — last 3 entries (append-only, newest at top)
4. `tasks/todo.md` — current week
5. `tasks/lessons.md` — pay special attention to **L-021** and **L-022**

## Mode
**Execution** mode. Tight scope, mechanical work, audit-driven. Single-file CSS change with no scope creep.

## Complexity
**Non-trivial full workflow.** The roadmap page is the biggest page in the SPA (548 lines of markup, ~12 distinct widget types). Audit first, write code second.

---

## Goal

Add pop-out hover effect to roadmap page widgets that DON'T already lift on hover.

The page is already 90% done by accident — the global pop-out rule (lines 2646–2654 of `prototypes/portfolio-combined.html`) covers `.pcard`, `.w`, and `.card`, which means `.phase-card`, `.topic-card`, `.career-card`, and `.guide-card` (all use one of those classes) ALREADY lift.

What's MISSING: only 2 widget types have their own hover but no lift — `.tl-header` and `.resource-item`.

## DO NOT TOUCH
The following already work correctly via the global rule. DO NOT modify, DO NOT add to any hover list, DO NOT add new selectors for them:

- `.phase-card` (4 cards in `#pg-roadmap .phases-grid`) — already covered by global `.pcard` rule
- `.topic-card` (11 JS-generated cards in `#pg-roadmap .topics-grid`) — already covered by global `.pcard` rule
- `.career-card` (12 JS-generated cards in `#pg-roadmap .careers-grid`) — already covered by global `.pcard` rule
- `.guide-card` (1 card in getting-started section) — already covered by global `.w` rule (it has class `w glass guide-card`)
- `.filter-btn` (5 filter buttons) — has its own custom hover that already feels interactive; do NOT add lift
- `.np`, `.np-ghost` (hero CTAs) — already have their own hover behavior
- `#progress-widget` — fixed-positioned progress tracker; do NOT lift (it's a control widget, not content)

## DO NOT TOUCH (L-021 — wrappers)
These are layout containers (`display: grid` or layout-only wrappers). Per L-021, never add hover to wrappers:

- `.phases-grid` (wrapper for 4 `.phase-card`)
- `.topics-grid` (wrapper for 11 `.topic-card`)
- `.careers-grid` (wrapper for 12 `.career-card`)
- `.resources-grid` (wrapper for 3 `.resource-group`)
- `.timeline` (wrapper for 12 `.tl-item`)
- `.tl-item` (wrapper for one header + body — `.tl-header` is the actual interactive element)
- `.resource-group` (wrapper for one h3 + multiple `.resource-item` — the items are distinct interactive widgets)

## What to add (the ONLY changes)

### 1. `.tl-header` — pop-out on hover

The 12 timeline accordion headers already have a custom hover (line 2086: `#pg-roadmap .tl-header:hover { border-color: var(--w12); }`) but no lift.

Add: layer the pop-out transform/box-shadow ON TOP of the existing border-color change. Do NOT remove the existing rule — keep stacking.

Scope selector: `#pg-roadmap .tl-header`

### 2. `.resource-item` — pop-out on hover

The 9 resource links (3 groups × 3 items) already have a custom hover (line 2382: `.resource-item:hover { border-color: var(--w12); background: rgba(255,255,255,.02); }`) and the arrow color change (line 2396: `.resource-item:hover .resource-arrow { color: var(--w); }`) but no lift.

Add: layer the pop-out transform/box-shadow ON TOP of the existing rules. Do NOT remove the existing rules — keep stacking.

Scope selector: `#pg-roadmap .resource-item`

### 3. (OPTIONAL — only if needed) `.resource-group` — pop-out on hover?

Before adding this, CHECK if `.resource-group` has a visible card styling (border + background of its own). If yes (it's a cohesive card containing one heading + a list), hover the wrapper as a single widget. If no (it's layout-only), skip it per L-022.

Read lines 2367–2397 of `prototypes/portfolio-combined.html` and inspect `.resource-group` styling before deciding.

---

## Spec (canonical, already used on about/projects/homepage)

```css
#pg-roadmap .tl-header,
#pg-roadmap .resource-item {
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}

#pg-roadmap .tl-header:hover,
#pg-roadmap .resource-item:hover {
  transform: translateY(-2px) scale(1.012);
  box-shadow: 8px 10px 24px var(--sd), -2px -2px 10px var(--sl);
  border-color: var(--w06);
}
```

This is a LAYERED hover — it stacks on top of any existing `:hover` rules for the same selector. The transition declaration replaces any narrower existing transition (`all .2s` etc.) for `transform`/`box-shadow`/`border-color`. The custom hover effects (border-color change, arrow color change) are preserved because they target different properties.

## Where to add

Add the new rule block in `prototypes/portfolio-combined.html` immediately after the existing `#pg-roadmap` pop-out section (currently ends around line 1783 — find the comment `POP-OUT HOVER (About Page)` block and add the new roadmap block BEFORE it, after the existing `#pg-roadmap .contact-card:nth-of-type(4) ...` rules that end around line 1751).

## DoD — Definition of Done

1. **Scope is tight**: only `.tl-header` and `.resource-item` are added to the `#pg-roadmap` hover list. Nothing else.
2. **No markup changes**: this is pure CSS. Do NOT add classes, do NOT change HTML structure.
3. **No other pages touched**: all changes scoped under `#pg-roadmap`. Verify by running `git diff` and confirming every line begins with `#pg-roadmap` or contains `pg-roadmap`.
4. **Existing hover rules preserved**: `#pg-roadmap .tl-header:hover { border-color: var(--w12); }` (line 2086) and `.resource-item:hover` rules (lines 2382, 2396) MUST remain in the file. They stack with the new transform/shadow.
5. **Light + dark mode both work**: only use existing `:root` tokens (`--sd`, `--sl`, `--w06`). No hard-coded colors.
6. **DEVLOG entry**: append a new entry to `tasks/DEVLOG.md` (top of file, newest first). Format: `## [date] — agent(pop-out-hover-roadmap): ...`. Include: which selectors added, what was already covered by global rule (so future agents know), what was deliberately skipped (with reasons), verification approach.
7. **Scope check passes**: `git diff --stat` shows changes only in `prototypes/portfolio-combined.html` and `tasks/DEVLOG.md` (max 2 files modified). NO changes to `tasks/todo.md`, no changes to `tasks/lessons.md`, no changes to any other file.
8. **Commit with proper format**: `agent(pop-out-hover-roadmap): <short description>` — see commit history for tone.

## Audit checklist (run BEFORE declaring done)

For each of the items below, confirm the current state. **Add findings to your DEVLOG entry.**

- [ ] `.phase-card` — count: 4 (lines 3741, 3752, 3764, 3775). All have class `pcard`. Covered by global rule. NO new hover needed.
- [ ] `.topic-card` — count: 11 (JS-generated, lines 5000-5027). Has class `pcard`. Covered by global rule. NO new hover needed.
- [ ] `.career-card` — count: 12 (JS-generated, lines 5091-5127). Has class `pcard`. Covered by global rule. NO new hover needed.
- [ ] `.guide-card` — count: 1 (line 3793). Has class `w`. Covered by global rule. NO new hover needed.
- [ ] `.tl-header` — count: 12 (timeline accordion headers). Has custom border-color hover but NO lift. **ADD to pop-out.**
- [ ] `.resource-item` — count: 9 (3 groups × 3 items, lines 4147-4228). Has custom hover but NO lift. **ADD to pop-out.**
- [ ] `.filter-btn` — count: 5. Has its own hover. Skip — already responsive.
- [ ] `.resource-group` — inspect CSS first. Add ONLY if it has visual card styling (border + background of its own). Otherwise skip per L-022.
- [ ] `#progress-widget` — fixed position. Skip.
- [ ] `.phases-grid`, `.topics-grid`, `.careers-grid`, `.resources-grid`, `.timeline`, `.tl-item`, `.resource-group` (if not widget) — all wrappers. Skip per L-021.

## Pitfalls to avoid

1. **DO NOT hover the wrapper when the inner widgets are already covered.** `.phases-grid` is a wrapper — its `.phase-card` children already lift via global rule. Adding hover to `.phases-grid` would lift the whole row of 4 cards as one mega-block (L-021 failure mode).
2. **DO NOT add hover to `.pcard`-classed elements under `#pg-roadmap`.** They already lift via the global rule. Adding a `#pg-roadmap .pcard:hover` rule would be redundant and might conflict with `!important`.
3. **DO NOT touch the global rule.** It uses `!important` for a reason — to ensure consistent lift across pages.
4. **DO NOT touch any other page's pop-out rules.** Homepage (line 2656+), Projects (line 2677+), About (line 1753+) are all done. Only Roadmap needs work.
5. **DO NOT add hover to `.tl-item`.** It's the wrapper containing one `.tl-header` + one `.tl-body`. The interactive widget is the `.tl-header`. The body just expands.
6. **DO NOT remove the existing custom hover rules.** Layer them. The new transition declaration will overwrite the old `transition: all .2s` but the border-color change on hover will still apply because we're using different properties.

## Self-verify before declaring done

After your CSS change, run these checks and include the output in your DEVLOG entry:

```bash
# 1. Scope check — only #pg-roadmap additions
git diff prototypes/portfolio-combined.html | grep -E "^[+-]" | grep -v "^[+-]{3}" | grep -v "#pg-roadmap" | head -30

# 2. Confirm both selectors present
grep -c "#pg-roadmap .tl-header:hover" prototypes/portfolio-combined.html   # should be 1
grep -c "#pg-roadmap .resource-item:hover" prototypes/portfolio-combined.html   # should be 1

# 3. Confirm existing hover rules preserved
grep -c "#pg-roadmap .tl-header:hover { border-color: var(--w12); }" prototypes/portfolio-combined.html   # should be 1
grep -c ".resource-item:hover { border-color: var(--w12); background:" prototypes/portfolio-combined.html   # should be 1

# 4. File count
git diff --stat | wc -l   # should show at most 3 lines (header + 2 files)
```

If any check fails, fix before committing.

## Commit message format

```
agent(pop-out-hover-roadmap): pop-out hover on .tl-header and .resource-item

Both widgets had custom border-color hover but no lift. Layered the
pop-out transform/box-shadow on top of the existing rules so the
border-color change and arrow-color change on .resource-item are
preserved.

Other roadmap widgets (.phase-card, .topic-card, .career-card,
.guide-card) already lift via the global .pcard/.w rule, so no
changes needed there.

Filtered out wrappers per L-021 (.phases-grid, .topics-grid,
.careers-grid, .resources-grid, .timeline, .tl-item) and the
fixed-position progress widget per scope decision.

See: L-021 (wrappers), L-022 (invisible wrappers) in tasks/lessons.md
```

## Final note

This is the LAST page that needs trivial additions. Page 5 (`/me`) has a separate handler and is intentionally deferred (see `tasks/todo.md`). After this merge, all 5 pages of pop-out hover will be complete.