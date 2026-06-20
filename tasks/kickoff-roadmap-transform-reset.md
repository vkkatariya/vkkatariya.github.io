# Kickoff — Fix Roadmap Page `.pcard` Pop-Out Override

## Branch
`fix/roadmap-transform-reset` (off `dev`, already pushed to origin)

## Repo root
`/home/radxa/dev-shared/projects/portfolio-website`

## Files to read FIRST (mandatory)
1. `AGENTS.md` — Six Rules + Task Management Protocol
2. `CONTEXT.md` — user-maintained project context
3. `tasks/DEVLOG.md` — last 3 entries (append-only, newest at top)
4. `tasks/todo.md` — current week
5. `tasks/lessons.md` — **pay special attention to L-021, L-022, L-023**. They explain the cascade-conflict family this fix belongs to.

## Mode
**Execution** mode. Tight scope, mechanical CSS fix, 1 line removed + 1 lesson added.

## Complexity
**Simple micro-loop.** The actual code change is 1 line. But the diagnosis context below is critical — read it completely before touching anything.

---

## User feedback (verbatim)

> "not yet, roadmap page isnt done yet, following widgets doesnt pop out: 4 widgets below learning path overview, big widget under getting started, 11 core topics widgets, career paths widgets, so most of the work yet to be done, spawn another coding agent from the coding agents clis list"

## Diagnosis (already done — don't re-discover)

The user says these 4 widget groups on the roadmap page don't pop out on hover:
1. **4 phase cards** in "Learning Path Overview" (selector: `.phase-card`, has class `.pcard`)
2. **1 guide card** in "Getting Started" (selector: `.guide-card`, has class `w glass guide-card`)
3. **11 topic cards** in "11 Core Topics" (selector: `.topic-card`, has class `.pcard`, JS-generated)
4. **10–12 career cards** in "Career Paths" (selector: `.career-card`, has class `.pcard`, JS-generated)

**All 4 widgets have the global pop-out rule applied.** Verified via `getComputedStyle()`:
- `.phase-card`: `transitionProperty = "transform, box-shadow, border-color"` ✓
- `.guide-card`: `transitionProperty = "transform, box-shadow, border-color"` ✓
- `.topic-card`: `transitionProperty = "transform, box-shadow, border-color"` ✓
- `.career-card`: `transitionProperty = "transform, box-shadow, border-color"` ✓

So the transitions ARE in place. The hover rule should fire. So why does it look like nothing happens?

### Root cause (already found — don't re-discover)

There is a `!important` reset rule at **line 2018–2023** of `prototypes/portfolio-combined.html`:

```css
/* Roadmap is an initially-hidden SPA page; IntersectionObserver cannot fire
   while display:none, so force its animated content visible once active.
   Also cancel the global .pcard entrance animation so cards don't get stuck
   at opacity:0 from their `both` fill mode keyframes. */
#pg-roadmap.active [data-anim],
#pg-roadmap.active .pcard {
  opacity: 1 !important;
  transform: none !important;     ← THIS LINE
  animation: none !important;
}
```

**The `transform: none !important` line is silently killing the pop-out hover for ALL `.pcard` elements on the roadmap page.**

Cascade analysis:
- Global pop-out hover (line 2651): `.pcard:hover { transform: translateY(-2px) scale(1.012) !important; }` — specificity (0,0,2,0)
- Roadmap state reset (line 2021): `#pg-roadmap.active .pcard { transform: none !important; }` — specificity (0,1,2,0)

Specificity tie-breaker + source order: roadmap rule wins. Even with `:hover` adding a pseudo-class, the specificity is (0,1,2,0) on both sides after combining. The roadmap rule comes LATER in source order → wins.

**The same rule also kills pop-out on `.guide-card` and any other `[data-anim]` element** because of the combined selector `#pg-roadmap.active [data-anim]`.

### Why this rule exists (don't blindly delete it)

The rule was added to cancel the entrance animation (`@keyframes widget-enter` at line 671–674, with `both` fill mode). When the user navigates to the roadmap page, the page was previously hidden via `display: none`, so IntersectionObserver couldn't fire. The rule forces everything to visible state immediately, bypassing the entrance animation. It was added in a previous fix (search git log for `IntersectionObserver` to see history).

The `transform: none !important` was a defensive "belt and suspenders" — cancelling both opacity AND transform AND animation. But the keyframe's `to` state is `translateY(0) scale(1)` which is functionally `transform: none`. So if we just cancel the animation (line 2022), the transform will naturally settle at the keyframe's `to` value.

**The fix is safe:** we can remove the `transform: none !important` line without breaking the entrance-cancellation behavior, because cancelling `animation` is sufficient.

---

## The fix (the ONLY change to `prototypes/portfolio-combined.html`)

**Remove line 2021** (`transform: none !important;`) from the `#pg-roadmap.active` rule.

The result should be:

```css
#pg-roadmap.active [data-anim],
#pg-roadmap.active .pcard {
  opacity: 1 !important;
  animation: none !important;
}
```

That's it. 1 line deleted. Do NOT add any new rules. Do NOT modify the global pop-out rule. Do NOT modify any widget hover rules.

### Why this works

- `animation: none !important` cancels the entrance animation → element's transform settles at the keyframe's `to` state (`translateY(0) scale(1)`, visually no transform).
- `opacity: 1 !important` keeps the element visible (in case the animation's `from` state `opacity: 0` somehow sticks).
- Once the element is at its natural resting position, the global pop-out rule's `:hover` transform (`translateY(-2px) scale(1.012) !important`) can apply on hover because the overriding `transform: none !important` is gone.

### Verify after the fix

In the browser console:
```js
const el = document.querySelector('#pg-roadmap .phase-card');
const cs = getComputedStyle(el);
cs.transitionProperty  // should include 'transform'
// hover the card and check:
el.matches(':hover')   // true when hovered
// the card should now visually lift on hover with shadow
```

Even better: simulate hover via DevTools and visually confirm 4 distinct lift states across the 4 phase cards when each is hovered individually.

---

## DoD — Definition of Done

1. **Scope is tight**: exactly 1 line removed from `prototypes/portfolio-combined.html` (line 2021).
2. **No other CSS changes**: do NOT modify the global pop-out rule, do NOT add new selectors to any hover list, do NOT modify widget-specific hover rules.
3. **Lesson captured**: add a new entry `L-024` to `tasks/lessons.md` (after L-023, before L-001). Format matches existing lessons (see L-021, L-022, L-023 for the family this belongs to). Include:
   - What failed (specificity tie + source order killed pop-out)
   - Why this rule exists (defensive entrance-animation cancellation)
   - Why removing `transform` is safe (keyframe `to` state is no-op)
   - Detection method (`getComputedStyle().transitionProperty` won't reveal this — the symptom is visible behavior, not computed style)
   - Prevention rule: when adding `!important` resets for animation cancellation, audit what OTHER properties the animation touches and decide whether the reset is actually needed
4. **DEVLOG entry**: append a new entry to `tasks/DEVLOG.md` (top of file, newest first). Format: `## [date] — agent(agy): ...` Include: root cause, the 1-line fix, verification approach.
5. **Scope check passes**: `git diff --stat` shows changes only in `prototypes/portfolio-combined.html` and `tasks/lessons.md` and `tasks/DEVLOG.md` (max 3 files modified). NO changes to `tasks/todo.md`, no changes to other files.
6. **Visual verification**: boot the local server (`cd prototypes && python3 -m http.server 8765`), navigate to `http://localhost:8765/portfolio-combined.html`, click "roadmap" in the nav, hover each of the 4 widget groups and confirm lift:
   - Hover `.phase-card` (Foundation, Core Skills, System Core, Security) — each should lift individually
   - Hover `.guide-card` (Getting Started big card) — should lift as one cohesive block
   - Hover `.topic-card` (any of the 11) — should lift individually
   - Hover `.career-card` (any of the 10–12) — should lift individually
   - Confirm `.tl-header` (timeline accordion headers) still lifts — NOT affected by this fix
   - Confirm `.resource-item` (curated resources) still lifts — NOT affected by this fix
7. **Commit with proper format**: `agent(agy): remove transform: none !important from #pg-roadmap.active — restores pop-out on .pcard`
8. **Push to `origin/fix/roadmap-transform-reset`**.
9. **If work is solid**: merge to `dev` yourself (per agent-autonomy rule established 2026-06-20). If uncertain, report back without merging.

---

## Pitfalls to avoid

1. **DO NOT add new hover rules.** The global pop-out rule already covers `.pcard` and `.w`. The fix is to remove the conflict, not add more rules.
2. **DO NOT modify the global pop-out rule** at line 2646–2654.
3. **DO NOT change the selector** `#pg-roadmap.active [data-anim], #pg-roadmap.active .pcard` — keep both target selectors.
4. **DO NOT remove `opacity: 1 !important`** or `animation: none !important`. Both are needed for the entrance-cancellation behavior. Only remove `transform`.
5. **DO NOT add `:not(:hover)` to the selector.** That would break cascade in other ways.
6. **DO NOT remove the rule entirely.** The opacity + animation cancellation is needed.

## Self-verify before declaring done

```bash
# 1. Confirm the line is removed
grep -n "transform: none !important" prototypes/portfolio-combined.html
# Expected output: line 2021 should be GONE (was previously the only occurrence)
# (Other "transform: none !important" might exist elsewhere — that's fine)

# 2. Confirm the rule still has the other properties
grep -A 4 "^#pg-roadmap.active \[" prototypes/portfolio-combined.html
# Expected: 4 lines (selector + 3 properties: opacity, animation, closing brace)

# 3. Confirm no new hover rules added
git diff prototypes/portfolio-combined.html | grep -E "^\+" | grep -i ":hover"
# Expected: NO new lines (we only removed a line, didn't add any)

# 4. Confirm only 3 files modified
git diff --stat | wc -l
# Expected: 4 (1 header + 3 files: .html, lessons.md, DEVLOG.md)
```

## Final note

This is a **Simple micro-loop** despite being page 4 of 5 in the pop-out hover rollout. The actual change is 1 line. The lesson (L-024) is the high-value artifact — capture the cascade-conflict family clearly so future agents (and you) don't repeat the pattern.

User's expected end state: hover any widget on the roadmap page and see a clean pop-out. All 5 pages of pop-out hover should be functionally complete after this.