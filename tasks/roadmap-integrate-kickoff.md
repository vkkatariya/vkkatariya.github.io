# Kickoff: Two-way integrate cs-roadmap.html → portfolio-combined.html roadmap page

**Branch:** `feat/roadmap-claude-code-integrate` (created off `dev`)
**Agent:** Claude Code (claude CLI, Sonnet 4.6 default)
**Project:** portfolio-website
**Path:** `~/dev-shared/projects/portfolio-website/`

---

## Goal

Two-way integrate `prototypes/cs-roadmap.html` into the roadmap page of `prototypes/portfolio-combined.html`:

1. **Content** — every section, topic, career path, resource, timeline entry, and footer item from `cs-roadmap.html` must be present and correct inside `#pg-roadmap`.
2. **UI style** — the roadmap page inside the combined SPA adopts the visual language of `cs-roadmap.html` (its hero treatment, phase stepper, timeline visuals, topic card style, career card style, resource card style, dark/glass treatment) — without breaking the rest of the SPA shell.

## Constraints

- Read BOTH files before touching anything: `prototypes/portfolio-combined.html` and `prototypes/cs-roadmap.html`.
- Stay inside `#pg-roadmap`. Do **not** modify:
  - The shared 3-pill topbar (`#shared-nav`) or its center-pill morph logic
  - The roadmap internal nav morph (`#roadmap-internal-nav`, `#shared-nav.nav-hidden .nav-links`, `.nav-visible`)
  - Other SPA pages (`#pg-home`, `#pg-projects`, `#pg-about`)
  - The global shared topbar morph JS in `showPage()`
- One scrollable roadmap page. No nested SPA pages inside `#pg-roadmap`.
- Minimal-scope edits — touch only what's necessary. See L-006 (targeted edits beat rewrites).
- Use existing design tokens (CSS variables in `:root`) where possible. If `cs-roadmap.html` uses a token not in portfolio-combined, port the **variable**, don't duplicate values inline.
- Match portfolio's font stack: Cormorant Garamond + Space Grotesk + Outfit + DM Mono.
- Match portfolio's palette: `--bg #080808`, `--bg2 #0f0f0f`, `--w #f0f0f0`, `--acc #00D4AA`, etc.
- Internal anchor links must use `scrollInRoadmap()` (already exists), not raw `href="#section"`.
- All external links must have `target="_blank" rel="noopener noreferrer"`.
- No external CDN dependencies without asking first (L-002). Self-contained inline SVG only.

## Definition of Done

- [ ] All 11 topic cards present inside `#pg-roadmap` with full expanded content from `cs-roadmap.html`
- [ ] All 10 career paths present with correct %, CS-required topics, additional skills, tags, and roadmap.sh links
- [ ] Timeline (month-by-month breakdown) present and visually styled per `cs-roadmap.html`
- [ ] Beginner Guide section present (Where to Start + Tips for Success + Common Mistakes)
- [ ] Learning Path Overview (4 phases) present as a stepper
- [ ] Curated Resources section grouped by category
- [ ] Footer with the canonical cs-roadmap footer text and back-to-top button
- [ ] Hero section styled like cs-roadmap's hero (large headline, subtitle, stat badges, CTA)
- [ ] Topic filter bar (All / Foundation / Core Skills / System Core / Advanced) functional
- [ ] Topic expand/collapse (accordion or modal) working
- [ ] Career % bars animated on scroll
- [ ] Sticky roadmap nav with active section highlighting
- [ ] Scroll progress bar at top
- [ ] Shared topbar morph still works (no regression on the fix from `feat/roadmap-morph-restore`)
- [ ] Other pages (`#pg-home`, `#pg-projects`, `#pg-about`) visually unchanged
- [ ] HTTP smoke test 200 on the combined file
- [ ] No JS errors in browser console
- [ ] No duplicate `const`/`function` declarations (L-001)
- [ ] No stray global CSS rules that break the shared shell (L-010, L-011)
- [ ] DEVLOG.md entry written per AGENTS.md format
- [ ] lessons.md updated if any new lesson is learned
- [ ] Committed on `feat/roadmap-claude-code-integrate` with `agent(claude):` prefix per AGENTS.md

## Mode

Mixed — Builder (primary, executing the integration) + Analytical (gap analysis between the two files).

## Complexity

Non-trivial full workflow — multi-file content merge, CSS scoping, JS hooks, verification.

## Read first (mandatory)

1. `AGENTS.md` — full behavioral contract
2. `CONTEXT.md` — stack, design tokens, architecture
3. Last 10 entries of `tasks/DEVLOG.md`
4. `tasks/todo.md` — current sprint state
5. `tasks/lessons.md` — especially L-006, L-009, L-010, L-011, L-012, L-013

## Read second (the work)

6. `prototypes/portfolio-combined.html` — target file (5045 lines, has SPA shell + roadmap page already partially built)
7. `prototypes/cs-roadmap.html` — source of truth for content and roadmap visual style

## Suggested approach (non-binding)

1. **Gap analysis** — diff `cs-roadmap.html` against `#pg-roadmap` content in `portfolio-combined.html`. List what's missing, what's stubbed, what's complete. Decide per section: copy as-is, port + restyle, or merge.
2. **Token audit** — list CSS custom properties used by cs-roadmap that aren't in portfolio-combined's `:root`. Add to `:root` (do not duplicate values inline).
3. **Section-by-section merge** — start with hero + stats, then phases, then timeline, then topics, then careers, then resources, then footer. After each section: grep for breakage (L-010), curl the page, count cards/sections.
4. **Interaction wiring** — topic filter, expand/collapse, scroll progress bar, sticky nav highlighting. Reuse existing `scrollInRoadmap()`, `observeAnimElements()`, `IntersectionObserver` patterns from the file.
5. **Verification** — start a local `python3 -m http.server` and curl/inspect. Then visual inspection if browser available. Check that `#pg-home`, `#pg-projects`, `#pg-about` didn't regress.
6. **Document** — write DEVLOG entry, update todo.md with results, add a lessons.md entry if anything new came up.

## Out of scope

- Phase 1 (SvelteKit scaffold) — do not touch `src/`, do not add dependencies
- `/me` auth, private routes — not part of this task
- Vercel deploy — not part of this task
- Notion artifacts — separate project
- Any docker / homelab / Tailscale change
