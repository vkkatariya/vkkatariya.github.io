# Kickoff: SVG icons for every widget across all 5 pages

## Goal

Every rounded widget/card across `/`, `/projects`, `/roadmap`, `/about`, `/me` should have an SVG icon paired with its label. This is a **full pattern rollout**: ~125 widgets in 5 pages get a `<div class="wlbl-row"><svg>…</svg> label</div>` (or the existing `.wlbl-row` pattern where it already exists) added.

## Project context

- **Path:** `/home/radxa/dev-shared/projects/portfolio-website`
- **Base branch:** `dev` (current tip `48979b0`)
- **Working branch:** `feat/widget-svg-icons-all-pages` (create from `dev`)
- **Files in scope:**
  - `prototypes/portfolio-combined.html` (single file; all 5 pages live here)
- **Files NOT in scope:** anything else. No CSS file split, no new HTML files.

## Reference implementation (DO NOT modify these — copy their pattern)

The homepage `.w` widgets already have a working `.wlbl-row` icon header. The pattern is exactly:

```html
<div class="wlbl-row">
  <svg class="ico" width="13" height="13" viewBox="0 0 13 13" fill="none">
    <!-- simple monochrome primitives -->
    <rect x="1" y="8" width="2.5" height="4" fill="rgba(255,255,255,.5)"/>
    <line x1="2" y1="6" x2="11" y2="6" stroke="rgba(255,255,255,.5)" stroke-width="1"/>
    <circle cx="6.5" cy="6.5" r="2" stroke="rgba(255,255,255,.5)" stroke-width="1" fill="none"/>
  </svg>
  system time
</div>
```

And the CSS class (already exists at line 2138-2142):
```css
.wlbl-row {
  display: flex; align-items: center; gap: 7px;
  font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 3px;
  color: var(--w30); text-transform: uppercase; margin-bottom: 10px;
}
```

**CRITICAL — Where to put the SVG icon:**

> User explicit correction (2026-06-25): the icon goes **inline before the project/widget text**, NOT as a separate `.wlbl-row` label row above the title. The previous `.pi` card attempt was rejected because the agent added a `.wlbl-row` "FINANCE · TRACKER" header above the title — making "stack" appear twice.

This means: **for most cards, do NOT use the `.wlbl-row` class at all**. Instead, prepend the SVG directly to the existing first text node of the widget, like this:

```html
<!-- BEFORE (no icon) -->
<div class="pi-title">Finance Buddy</div>

<!-- AFTER (icon inline before title) -->
<div class="pi-title"><svg class="ico" width="13" height="13" viewBox="0 0 13 13" fill="none">
  <rect x="1" y="8" width="2.5" height="4" fill="rgba(255,255,255,.5)"/>
  <rect x="5.25" y="5" width="2.5" height="7" fill="rgba(255,255,255,.5)"/>
  <rect x="9.5" y="2" width="2.5" height="10" fill="rgba(255,255,255,.5)"/>
</svg>Finance Buddy</div>
```

The icon sits inline before the title text. Same SVG shape, same 13×13 viewBox, same monochrome `rgba(255,255,255,.5)` styling — just placed inline at the start of the existing title element, not in a separate row above.

**Exception — widgets that already have `.wlbl-row`:** the 11 homepage `.w` widgets + 8 cs-sections already use `.wlbl-row`. **DO NOT touch those.** They're already correct.

## Widget map (pre-audited — work from this, not from grep)

### `/` Homepage — 10 widgets need icons

| # | Container | Selector | Existing text node | Suggested icon concept |
|---|---|---|---|---|
| H1 | `.pcard` (HomelabDashboard) | line ~3428 | `.pcard-title` "HomelabDashboard" | server-stack |
| H2 | `.pcard` (TypeShift) | line ~3449 | `.pcard-title` "TypeShift" | keyboard |
| H3 | `.pcard` (orlon-bot) | line ~3470 | `.pcard-title` "orlon-bot" | chat-bubble |
| H4 | `.tl-item` "Started CS at h_da" | line ~3525 | `.tl-title` | calendar / cap |
| H5 | `.tl-item` "First homelab — Rock 5T" | line ~3535 | `.tl-title` | server |
| H6 | `.tl-item` "Finance Buddy" | line ~3545 | `.tl-title` | chart-bar |
| H7 | `.tl-item` "Homelab v2 — Proxmox cluster" | line ~3555 | `.tl-title` | cluster |
| H8 | `.tl-item` "TypeShift" | line ~3565 | `.tl-title` | keyboard |
| H9 | `.tl-item` "orlon-bot — in progress" | line ~3575 | `.tl-title` | bot |
| H10 | `.tl-item.future` "B.Sc. Computer Science" | line ~3585 | `.tl-title` | cap (future styling) |

### `/projects` — 19 widgets need icons

| # | Container | Selector | Existing text node | Icon concept |
|---|---|---|---|---|
| P1-P8 | `.pi` (8 index cards) | lines ~3713-3802 | `.pi-title` | finance-tracker / homelab-dashboard / typeshift / orlon-bot / portfolio-meta / hermes-lock / dashboard-grid / pulse |
| P9 | `.nd-node` "athena" | line ~4150 | `.nd-name` "athena" | rock-chip |
| P10 | `.nd-node` "atlas" | line ~4155 | `.nd-name` "atlas" | desktop |
| P11 | `.plat` (Android) | line ~4190 | `.plat-name` | android-bot |
| P12 | `.plat` (macOS) | line ~4205 | `.plat-name` | apple |
| P13 | `.plat` (Windows) | line ~4220 | `.plat-name` | windows |
| P14-P19 | `.pipe-stage` (6 stages) | line ~4260 | `.pipe-name` | data / model / train / eval / deploy / monitor |

### `/roadmap` — 35 widgets need icons (1 already has)

**Already has icon (DO NOT touch):**
- `.w.glass.guide-card` "Where to Start" — skip

**Phase cards (4):**
| # | Container | Text node | Icon |
|---|---|---|---|
| R1 | `.pcard.phase-card` "Foundation" | `.phase-name` | book / foundation |
| R2 | `.pcard.phase-card` "Core CS" | `.phase-name` | chip |
| R3 | `.pcard.phase-card` "System" | `.phase-name` | layers |
| R4 | `.pcard.phase-card` "Advanced" | `.phase-name` | rocket |

**Topic cards (11):** JS-generated. Look in `<div class="roadmap-grid">` or similar — agents should run JS via `document.querySelectorAll('.topic-card')` and inject icon into `.topic-name` of each.

| # | Topic | Icon |
|---|---|---|
| R5 | Programming Fundamentals | code-bracket |
| R6 | Object-Oriented Programming | box |
| R7 | Object-Oriented Design | blueprint |
| R8 | Data Structures & Algorithms | tree |
| R9 | Design Patterns | puzzle |
| R10 | Software Engineering | workflow |
| R11 | Databases | cylinder |
| R12 | Computer Architecture | chip |
| R13 | Operating Systems | terminal |
| R14 | Computer Networking | network |
| R15 | Security Fundamentals | shield |

**Career cards (10):** JS-generated.
| # | Career | Icon |
|---|---|---|
| R16 | Frontend Developer | browser |
| R17 | Backend Developer | server |
| R18 | Full-Stack Developer | layers |
| R19 | Mobile Developer | phone |
| R20 | DevOps Engineer | infinity / loop |
| R21 | Data Engineer | data |
| R22 | ML Engineer | brain |
| R23 | Embedded Systems | chip-small |
| R24 | Game Developer | gamepad |
| R25 | Blockchain Developer | chain |

**Timeline items (12):** find `.tl-item` elements in roadmap; pre-existing text node is `.tl-title`.
- Items: Programming Fundamentals (C++), Object-Oriented Programming, Object-Oriented Design, Data Structures & Algorithms, Design Patterns, Software Engineering, Databases, Computer Architecture, Operating Systems, Computer Networking, Security Fundamentals, Specialization & Projects

**Resource items (9):** `.resource-item` elements (rendered as `<a class="resource-item">`).

### `/about` — 28+ widgets need icons

| # | Container | Text node | Icon |
|---|---|---|---|
| A1 | `.photo-block` / `.photo-frame` | "VK" initials + "add photo" | camera (subtle, top-right corner) |
| A2 | `.edu-card` (Hochschule Darmstadt) | `.edu-inst` "HOCHSCHULE..." | graduation-cap |
| A3 | `.edu-mod` × 11 (module list) | module name | book / code |
| A4 | `.section.sh` "Education" | `.sh-label` | graduation-cap |
| A5 | `.section.sh` "Core Tech Stack" | `.sh-label` | stack |
| A6 | `.section.sh` "Languages" | `.sh-label` | globe |
| A7 | `.section.sh` "Interests" | `.sh-label` | star |
| A8 | `.section.sh` "Contact" | `.sh-label` | envelope |
| A9 | `.core-tech-card` | first label | stack |
| A10-A13 | `.lang-card` × 4 (German, English, etc.) | language name | globe |
| A14+ | `.int-card` (interest cards) | `.int-title` | varies |
| A15+ | `.cw-row` (contact rows: github, web, resume) | label text | github / web / download |

### `/me` — 1 widget needs icon

| # | Container | Text node | Icon |
|---|---|---|---|
| M1 | `.me-auth-card` | first label | lock |

## Hard rules

- **DO NOT** modify any widget that already has a working `.wlbl-row` (the 11 homepage `.w` widgets + 8 cs-sections). They are correct as-is.
- **DO NOT** add a `.wlbl-row` header above the title. The icon goes **inline at the start of the existing first text element** (e.g., directly inside `.pi-title`, `.pcard-title`, `.phase-name`, etc.).
- **DO NOT** change existing class names on widgets — only inject the SVG as the first child of the existing text element.
- **DO NOT** use icon fonts, CDN icons, or external libraries. Pure inline SVG with simple geometric primitives (rect, circle, path, line, polygon).
- **DO NOT** invent new SVG illustrations. Use the icon concepts in the table above (e.g., "chart-bar" = 3 ascending bars, "shield" = rounded shield outline). If unsure about a specific shape, use a generic placeholder (simple outline rect or circle in the icon's position).
- **DO NOT** add CSS variables, design tokens, or modify the existing `.wlbl-row` rule.
- **DO NOT** create `.wlbl-row` headers as a generic pattern. Icons are inline at the title element.
- **DO NOT** touch timeline items in homepage (H4-H10) if they're already styled differently from `/roadmap` timeline items — keep them visually consistent with their page.

## Icon style spec (must follow exactly)

```html
<svg class="ico" width="13" height="13" viewBox="0 0 13 13" fill="none">
  <!-- 1-4 simple primitives per icon -->
  <rect x="..." y="..." width="..." height="..." fill="rgba(255,255,255,.5)"/>
  <circle cx="..." cy="..." r="..." stroke="rgba(255,255,255,.5)" stroke-width="1" fill="none"/>
  <path d="..." stroke="rgba(255,255,255,.5)" stroke-width="1" fill="none"/>
  <line x1="..." y1="..." x2="..." y2="..." stroke="rgba(255,255,255,.5)" stroke-width="1"/>
</svg>
```

The SVG must:
- Be exactly 13×13 (`width="13" height="13" viewBox="0 0 13 13"`)
- Have `fill="none"` on the outer `<svg>` (primitives set their own fill)
- Use only `rgba(255,255,255,.5)` for stroke/fill colors (no other colors)
- Use 1-4 simple primitives (no detailed illustrations)

The icon must be the **first child** of the existing text element. Example:

```html
<!-- BEFORE -->
<a class="pi">
  <div class="pi-num">01 / 08</div>
  <div class="pi-title">Finance Buddy</div>
  ...
</a>

<!-- AFTER -->
<a class="pi">
  <div class="pi-num">01 / 08</div>
  <div class="pi-title"><svg class="ico" width="13" height="13" viewBox="0 0 13 13" fill="none">
    <rect x="1" y="8" width="2.5" height="4" fill="rgba(255,255,255,.5)"/>
    <rect x="5.25" y="5" width="2.5" height="7" fill="rgba(255,255,255,.5)"/>
    <rect x="9.5" y="2" width="2.5" height="10" fill="rgba(255,255,255,.5)"/>
  </svg>Finance Buddy</div>
  ...
</a>
```

The SVG is the first child of `.pi-title`. The title text "Finance Buddy" follows the SVG inline (a single text node, no extra wrapper).

## Verification (mandatory — do all 6 before declaring done)

1. **Widget count check:** `grep -c '<svg class="ico" width="13"' prototypes/portfolio-combined.html`. Expected: at least 130 (existing ~12 + new ~118).
2. **Per-page check via browser:** open `portfolio-combined.html#home`, `#projects`, `#roadmap`, `#about`, `#me` and confirm every widget on the page has a visible SVG icon inline with its label.
3. **No new `.wlbl-row` headers added:** `grep -c '<div class="wlbl-row">' prototypes/portfolio-combined.html`. Expected: 18 (unchanged from current — 8 cs-sections + 10 homepage `.w` widgets). Any new additions = scope violation.
4. **No `.pi:nth-child` regressions:** verify `grep -c '\.pi:nth-child' prototypes/portfolio-combined.html` = 0.
5. **No `.w` rule changed:** verify `grep -c '\.w{' prototypes/portfolio-combined.html` matches pre-edit count.
6. **Liquid-glass on `.pi` preserved:** verify `grep -c 'linear-gradient(135deg, rgba(255,255,255,.08)' prototypes/portfolio-combined.html` = 1 (the `.pi` rule from commit 79914d2).

## Definition of Done

- [ ] All widgets in the map above have an inline SVG icon
- [ ] No `.wlbl-row` headers added (existing 10 unchanged)
- [ ] All 6 verification checks pass
- [ ] `git diff --stat` shows ~150-250 line change in `prototypes/portfolio-combined.html`
- [ ] Single commit with message: `feat(widgets): inline svg icons on every widget across all 5 pages`
- [ ] Pushed to `origin/feat/widget-svg-icons-all-pages`
- [ ] `tasks/DEVLOG.md` entry appended

## Constraints

- **One file only.** No new CSS files, no JS extraction, no separate SVG sprites.
- **No new design tokens, no new CSS rules.** Pure SVG insertion in HTML.
- **Inline placement only** — icon goes inside the existing text element, not above it.
- **2-3 hour time budget.** This is a large cross-page visual pass; agent should plan per-page batches.
- **Do not push to dev.** User merges manually after reviewing.

## Failure modes to avoid (from kickoff anatomy reference, L-031, L-038)

- **Don't put icons above the title with `.wlbl-row`.** User explicitly rejected this approach (the previous `.pi` attempt). Icons are INLINE in the title element.
- **Don't use detailed illustrations.** Keep SVGs to 1-4 simple primitives (rect, circle, line, path). Match the homepage icon visual density.
- **Don't add new design tokens.** No new CSS vars, no new classes (except `.ico` if not already present).
- **Don't style the SVG with colors other than `rgba(255,255,255,.5)`.** Match the homepage icon contrast level.
- **Don't change existing `.w` widgets or `.cs-section` widgets.** They're correct.
- **Don't change `.pi` CSS (already liquid-glass from 79914d2).** This is purely HTML.

## END-OF-TASK CONTRACT (mandatory — do not return without completing all 7 steps)

1. Verify your changes via browser (open the prototype, navigate to each page, confirm icons visible)
2. `git status` — confirm only intended files modified
3. `git add <files>`
4. `git commit -m "feat(widgets): inline svg icons on every widget across all 5 pages"`
5. `git push -u origin feat/widget-svg-icons-all-pages`
6. Append `tasks/DEVLOG.md` entry: title, scope, files changed, self-verification result
7. Return summary stating: branch name, commit SHA, push status, verification result, widget count change

If you hit max iterations, your final action before stopping MUST be `git status && git add -A && git commit`. Do not return a "ran out of iterations" summary without committing what you changed.