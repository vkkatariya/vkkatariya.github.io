# Pop-Out Hover Effect — Per-Page Implementation Plan

**Branch prefix:** `feat/pop-out-hover-<page>` (one branch per page)
**Source file (only one):** `prototypes/portfolio-combined.html`
**Reference commit:** `e6b8ea6` on dev — global widget hover rule at lines 2612–2623 (already in dev, applies to `.widget, .pcard, .skill-group, .lang-card, .lcard, .edu-card, .tl-badge, .card, .panel, .w`)

---

## Current state (dev)

| What | Status |
|---|---|
| Global hover rule | ✅ Exists at lines 2612–2623 (translateY(-2px) scale(1.012) + shadow) |
| `.w:hover` (specific) | ✅ Exists at line 1838 (translateY(-3px) scale(1.015), overrides global because of cascade order) — but loses to global due to `!important` |
| `.w.inv:hover` (contact inverted widget) | ⚠️ Only changes background (line 362), no lift/scale |
| `.pcard:hover` (specific) | ⚠️ Exists at line 1854 (translateY(-3px), no scale) — loses to global due to `!important` |
| `.tl-badge:hover` (specific) | ✅ Exists in roadmap CSS (line 1838) — small scale 1.008 |
| Projects page (`.pi, .proj-index, .pcard-*, .pfoot-type, .phase-card, .pipeline, .pipe-stage, .platform-grid, .plat, .cs-section`) | ❌ NOT applied — those selectors were in the agy commit `80ade0a` that got reverted in `da097a7` |
| `.about-section` (bottom of homepage) | ❌ NOT a pop-out widget — has bg/border from about-color-profile, no hover transform |
| `.about-contact` (small contact widget inside about-section) | ❌ Has only `color` hover, no lift/scale |

---

## Per-page work

### Page 1 — Homepage (`#pg-home`)
**Status:** Almost done. Two missing widgets.

1. `.about-section` — add pop-out hover (translateY(-2px) scale(1.012) + shadow lift + border tint, scoped to `#pg-home .about-section`)
2. `.about-contact` — add pop-out hover (same treatment, but the inner `.contact-row` text links already have color hover; we add lift to the wrapper)

**Selectors needed:**
- `#pg-home .about-section`
- `#pg-home .about-contact` (note from memory: `.about-bio` and `.about-contact` need independent hover, NOT parent `.about-section`)

**Branch:** `feat/pop-out-hover-homepage`

### Page 2 — Projects (`#pg-projects`)
**Status:** All the user-confirmed selectors need hover.

**Selectors needed** (per user-confirmed list in memory):
- `.pi`, `.proj-index`
- `.pcard`, `.pcard-num`, `.pcard-title`, `.pcard-desc`, `.pcard-tags`, `.pcard-foot`
- `.pfoot-type`
- `.phase-card`, `.pipeline`, `.pipe-stage`
- `.platform-grid`, `.plat`
- `.cs-section`

**Important:** `.pcard` already has a global hover rule at line 2619. Need to check if individual elements need their own hover too (some may be inside `.pcard` so the parent's hover propagates visually).

**Critical constraint from memory:** `.pcard` inline `overflow:hidden` clips hover shadow — must change to `overflow:visible` on project detail cards only.

**Branch:** `feat/pop-out-hover-projects`

### Page 3 — About (`#pg-about`)
**Status:** Widget classes already covered by global rule (`.skill-group`, `.lang-card`, `.lcard`, `.edu-card`).

**Selectors needed (about-specific):**
- `.about-bio` (independent hover, not parent)
- `.about-contact` (independent hover, not parent)
- `.edu-card` (covered by global — verify)
- `.skill-group` (covered by global — verify)
- `.lang-card` (covered by global — verify)
- `.contact-card` (covered by global — verify; the about-color-profile work added `:hover` rules but only for border-color, no lift)

**Branch:** `feat/pop-out-hover-about`

### Page 4 — Roadmap (`#pg-roadmap`)
**Status:** `.tl-badge` already has hover in roadmap CSS. Need to check `.tl-item`, `.card`, topic cards, career cards, etc.

**Selectors needed:**
- `.tl-item` (timeline items)
- `.topic-card`, `.career-card` (verify against global — `.card` is in global list)
- `.phase-card` (verify)
- `.resource-card` (if exists)
- `.modal` (no — overlays shouldn't hover-lift)

**Branch:** `feat/pop-out-hover-roadmap`

### Page 5 — Me (`#pg-me`)
**Status:** Mostly inline-styled. Need to check what widgets exist.

**Selectors needed:** TBD — need to audit the `#pg-me` markup to identify widget containers.

**Branch:** `feat/pop-out-hover-me`

---

## Agent dispatch strategy (avoid timeouts)

Per L-014: use `delegate_task` with `toolsets: ["terminal", "file"]`.

Per user's instruction: **one page at a time**. After each page, self-verify, merge to dev (if solid), then move to the next.

Each agent task:
- **Scope lock:** ONLY one page ID. NO other pages, NO shared CSS.
- **Branch pre-created** by Hermes (with `-u` push).
- **Reuse existing tokens** — no new color variables.
- **Verify before commit:**
  - `git diff dev..HEAD --stat` shows only the page's files
  - `git diff dev..HEAD -- prototypes/portfolio-combined.html | grep -E '^[-+].*#pg-(otherpages)'` empty
  - HTTP 200 smoke test
- **Agent does NOT merge to dev** — Hermes merges after self-review.
- **Agent writes DEVLOG entry**, flips `tasks/todo.md` for that page, commits with `agent(<name>):` prefix, pushes branch.
- **STOPS** after push. Reports back to Hermes.

---

## Hard rules (apply to all 5 pages)

1. **All new selectors scoped under `#pg-<page>`.** No bare element selectors, no global `.w` / `.card` additions.
2. **Reuse existing CSS tokens** (--sd, --sl, --w06, etc.). No new variables.
3. **Reuse existing transition curve** (.18s ease on transform, box-shadow, border-color).
4. **No markup changes** unless absolutely necessary (e.g. inline `overflow:hidden` → `overflow:visible` on `.pcard` if shadow is clipped).
5. **No JS changes.**
6. **No new animations, keyframes, or transitions** beyond the existing 3-property transition.
7. **Verify on a 1440px viewport AND a 390px viewport** (responsive).
8. **Light mode test** — verify hover works in `html.light` too.

---

## Execution order (today)

1. **Now:** Create `feat/pop-out-hover-homepage` branch, dispatch agent for homepage only.
2. After homepage merges: dispatch `feat/pop-out-hover-projects` (likely the biggest workload — many selectors).
3. Then `feat/pop-out-hover-about`, `feat/pop-out-hover-roadmap`, `feat/pop-out-hover-me`.

If at any point the agent times out, **stop** and break that page into smaller sub-tasks before continuing.

---

## Todo.md updates

Update `tasks/todo.md` after each page merges, splitting the current `[~]` line into 5 sub-items (one per page) and flipping each to `[x]` as it completes.
